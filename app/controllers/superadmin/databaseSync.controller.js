const {
  errorCodes,
  formatErrorResponse,
  formatResponse,
} = require("@utils/response.config");
const { spawn, spawnSync } = require("child_process");
const fs = require("fs");
const mysql = require("mysql2/promise");
const dbConfigs = require("../../../config/config");

const normalizeDbHost = (host = "") => {
  const value = `${host}`.trim().toLowerCase();
  if (value === "localhost") {
    return "127.0.0.1";
  }
  return value;
};

const isSameMySqlServer = (sourceConfig, targetConfig) =>
  normalizeDbHost(sourceConfig.host) === normalizeDbHost(targetConfig.host) &&
  `${sourceConfig.port}` === `${targetConfig.port}`;

const quoteIdentifier = (value = "") =>
  `\`${String(value).replace(/`/g, "``")}\``;

const resolveExecutable = (candidates = []) => {
  for (const cmd of candidates) {
    if (!cmd) {
      continue;
    }

    if (cmd.includes("/")) {
      try {
        fs.accessSync(cmd, fs.constants.X_OK);
        return cmd;
      } catch (error) {
        continue;
      }
    }

    const check = spawnSync("which", [cmd], { encoding: "utf8" });
    if (check.status === 0 && check.stdout && check.stdout.trim()) {
      return check.stdout.trim();
    }
  }
  return null;
};

const getMySqlTools = () => {
  const mysqlClient = resolveExecutable([
    process.env.MYSQL_CLIENT_BIN,
    "mysql",
    "mariadb",
  ]);
  const mysqlDump = resolveExecutable([
    process.env.MYSQL_DUMP_BIN,
    "mysqldump",
    "mariadb-dump",
  ]);

  if (!mysqlClient || !mysqlDump) {
    const missing = [];
    if (!mysqlClient) missing.push("mysql client (mysql or mariadb)");
    if (!mysqlDump) missing.push("mysql dump (mysqldump or mariadb-dump)");
    throw new Error(
      `Required DB tools not found: ${missing.join(", ")}. Install MySQL client tools or set MYSQL_CLIENT_BIN / MYSQL_DUMP_BIN in .env.`,
    );
  }

  return { mysqlClient, mysqlDump };
};

const runCommand = (cmd, args, env = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      env: { ...process.env, ...env },
      shell: false,
    });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (err) => {
      if (err && err.code === "ENOENT") {
        reject(
          new Error(
            `Command not found: ${cmd}. Install DB tools or configure executable path in .env.`,
          ),
        );
        return;
      }
      reject(err);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr || `${cmd} exited with code ${code}`));
      }
    });
  });

const createDatabaseIfNotExists = async (targetConfig, mysqlClient) => {
  const args = [
    "-h",
    `${targetConfig.host}`,
    "-P",
    `${targetConfig.port}`,
    "-u",
    `${targetConfig.username}`,
    "-e",
    `CREATE DATABASE IF NOT EXISTS \`${targetConfig.database}\`;`,
  ];

  await runCommand(mysqlClient, args, {
    MYSQL_PWD: `${targetConfig.password || ""}`,
  });
};

const cloneDatabase = (sourceConfig, targetConfig, tools) =>
  new Promise((resolve, reject) => {
    const dumpArgs = [
      "-h",
      `${sourceConfig.host}`,
      "-P",
      `${sourceConfig.port}`,
      "-u",
      `${sourceConfig.username}`,
      "--single-transaction",
      "--routines",
      "--triggers",
      "--events",
      `${sourceConfig.database}`,
    ];

    const importArgs = [
      "-h",
      `${targetConfig.host}`,
      "-P",
      `${targetConfig.port}`,
      "-u",
      `${targetConfig.username}`,
      `${targetConfig.database}`,
    ];

    const dump = spawn(tools.mysqlDump, dumpArgs, {
      env: { ...process.env, MYSQL_PWD: `${sourceConfig.password || ""}` },
      shell: false,
    });

    const restore = spawn(tools.mysqlClient, importArgs, {
      env: { ...process.env, MYSQL_PWD: `${targetConfig.password || ""}` },
      shell: false,
    });

    let dumpErr = "";
    let restoreErr = "";

    dump.stderr.on("data", (chunk) => {
      dumpErr += chunk.toString();
    });
    restore.stderr.on("data", (chunk) => {
      restoreErr += chunk.toString();
    });

    dump.on("error", (err) => {
      if (err && err.code === "ENOENT") {
        reject(
          new Error(
            `Command not found: ${tools.mysqlDump}. Install DB tools or set MYSQL_DUMP_BIN in .env.`,
          ),
        );
        return;
      }
      reject(err);
    });
    restore.on("error", (err) => {
      if (err && err.code === "ENOENT") {
        reject(
          new Error(
            `Command not found: ${tools.mysqlClient}. Install DB tools or set MYSQL_CLIENT_BIN in .env.`,
          ),
        );
        return;
      }
      reject(err);
    });

    dump.stdout.pipe(restore.stdin);

    let dumpDone = false;
    let restoreDone = false;
    let dumpCode = 0;
    let restoreCode = 0;

    const maybeResolve = () => {
      if (!dumpDone || !restoreDone) {
        return;
      }

      if (dumpCode !== 0) {
        reject(new Error(dumpErr || "mysqldump failed"));
        return;
      }

      if (restoreCode !== 0) {
        reject(new Error(restoreErr || "mysql import failed"));
        return;
      }

      resolve();
    };

    dump.on("close", (code) => {
      dumpDone = true;
      dumpCode = code;
      maybeResolve();
    });

    restore.on("close", (code) => {
      restoreDone = true;
      restoreCode = code;
      maybeResolve();
    });
  });

const cloneDatabaseViaSql = async (sourceConfig, targetConfig) => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: sourceConfig.host,
      port: sourceConfig.port,
      user: sourceConfig.username,
      password: sourceConfig.password || "",
      multipleStatements: true,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${targetConfig.database}\``,
    );

    await connection.query("SET FOREIGN_KEY_CHECKS = 0");

    const [existingTargetTables] = await connection.query(
      "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ? AND table_type = 'BASE TABLE'",
      [targetConfig.database],
    );

    for (const row of existingTargetTables) {
      const tableName = row.TABLE_NAME;
      await connection.query(
        `DROP TABLE IF EXISTS \`${targetConfig.database}\`.\`${tableName}\``,
      );
    }

    const [sourceTables] = await connection.query(
      "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ? AND table_type = 'BASE TABLE'",
      [sourceConfig.database],
    );

    for (const row of sourceTables) {
      const tableName = row.TABLE_NAME;
      await connection.query(
        `CREATE TABLE \`${targetConfig.database}\`.\`${tableName}\` LIKE \`${sourceConfig.database}\`.\`${tableName}\``,
      );
      await connection.query(
        `INSERT INTO \`${targetConfig.database}\`.\`${tableName}\` SELECT * FROM \`${sourceConfig.database}\`.\`${tableName}\``,
      );
    }

    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const bulkInsertRows = async (targetConnection, targetDb, tableName, rows) => {
  if (!rows || !rows.length) {
    return;
  }

  const columns = Object.keys(rows[0]);
  if (!columns.length) {
    return;
  }

  const batchSize = 500;
  const columnSql = columns.map((col) => quoteIdentifier(col)).join(", ");

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const values = [];
    const placeholders = batch
      .map((row) => {
        const rowPlaceholders = columns.map((col) => {
          values.push(row[col]);
          return "?";
        });
        return `(${rowPlaceholders.join(",")})`;
      })
      .join(",");

    const insertSql =
      `INSERT INTO ${quoteIdentifier(targetDb)}.${quoteIdentifier(tableName)} ` +
      `(${columnSql}) VALUES ${placeholders}`;

    await targetConnection.query(insertSql, values);
  }
};

const cloneDatabaseViaNode = async (sourceConfig, targetConfig) => {
  let sourceConnection;
  let targetConnection;
  try {
    sourceConnection = await mysql.createConnection({
      host: sourceConfig.host,
      port: sourceConfig.port,
      user: sourceConfig.username,
      password: sourceConfig.password || "",
      multipleStatements: true,
    });

    targetConnection = await mysql.createConnection({
      host: targetConfig.host,
      port: targetConfig.port,
      user: targetConfig.username,
      password: targetConfig.password || "",
      multipleStatements: true,
    });

    await targetConnection.query(
      `CREATE DATABASE IF NOT EXISTS ${quoteIdentifier(targetConfig.database)}`,
    );
    await targetConnection.query("SET FOREIGN_KEY_CHECKS = 0");

    const [existingTargetTables] = await targetConnection.query(
      "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ? AND table_type = 'BASE TABLE'",
      [targetConfig.database],
    );

    for (const row of existingTargetTables) {
      const tableName = row.TABLE_NAME;
      await targetConnection.query(
        `DROP TABLE IF EXISTS ${quoteIdentifier(targetConfig.database)}.${quoteIdentifier(tableName)}`,
      );
    }

    const [sourceTables] = await sourceConnection.query(
      "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ? AND table_type = 'BASE TABLE' ORDER BY TABLE_NAME",
      [sourceConfig.database],
    );

    for (const row of sourceTables) {
      const tableName = row.TABLE_NAME;

      const [createRows] = await sourceConnection.query(
        `SHOW CREATE TABLE ${quoteIdentifier(sourceConfig.database)}.${quoteIdentifier(tableName)}`,
      );
      const createSql = createRows[0] && createRows[0]["Create Table"];
      if (!createSql) {
        continue;
      }

      await targetConnection.query(
        `USE ${quoteIdentifier(targetConfig.database)}`,
      );
      await targetConnection.query(createSql);

      const [rowsData] = await sourceConnection.query(
        `SELECT * FROM ${quoteIdentifier(sourceConfig.database)}.${quoteIdentifier(tableName)}`,
      );
      await bulkInsertRows(
        targetConnection,
        targetConfig.database,
        tableName,
        rowsData,
      );
    }

    await targetConnection.query("SET FOREIGN_KEY_CHECKS = 1");
  } finally {
    if (sourceConnection) {
      await sourceConnection.end();
    }
    if (targetConnection) {
      await targetConnection.end();
    }
  }
};

/**
 * Copy production DB into development & test DBs
 * @param {*} req
 * @param {*} res
 */
exports.syncProdToDevAndTest = async (req, res) => {
  try {
    let tools = null;
    try {
      tools = getMySqlTools();
    } catch (error) {
      tools = null;
    }
    const sourceConfig = dbConfigs.production;
    const updateArg = `${req.query.update || ""}`.trim().toUpperCase();

    const targetMap = {
      DEV: "development",
      DEVELOPMENT: "development",
      TEST: "test",
    };

    let targetEnvs = ["development", "test"];
    if (updateArg && updateArg !== "ALL") {
      const requested = updateArg
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const invalid = requested.filter((item) => !targetMap[item]);
      if (invalid.length) {
        return res
          .status(errorCodes.default)
          .send(
            formatErrorResponse(
              `Invalid update target: ${invalid.join(", ")}. Use DEV, TEST or ALL.`,
            ),
          );
      }

      targetEnvs = [...new Set(requested.map((item) => targetMap[item]))];
    }

    if (!sourceConfig || !sourceConfig.database) {
      return res
        .status(errorCodes.default)
        .send(formatErrorResponse("Production DB config not found."));
    }

    const results = [];
    for (const envName of targetEnvs) {
      const targetConfig = dbConfigs[envName];
      if (!targetConfig || !targetConfig.database) {
        results.push({
          environment: envName,
          synced: false,
          message: "Target DB config not found.",
        });
        continue;
      }

      const isSameDb =
        `${sourceConfig.host}` === `${targetConfig.host}` &&
        `${sourceConfig.port}` === `${targetConfig.port}` &&
        `${sourceConfig.database}` === `${targetConfig.database}`;

      if (isSameDb) {
        results.push({
          environment: envName,
          synced: false,
          message: "Skipped: source and target DB are same.",
        });
        continue;
      }

      if (tools) {
        await createDatabaseIfNotExists(targetConfig, tools.mysqlClient);
        await cloneDatabase(sourceConfig, targetConfig, tools);
      } else {
        if (isSameMySqlServer(sourceConfig, targetConfig)) {
          await cloneDatabaseViaSql(sourceConfig, targetConfig);
        } else {
          await cloneDatabaseViaNode(sourceConfig, targetConfig);
        }
      }

      results.push({
        environment: envName,
        synced: true,
        database: targetConfig.database,
      });
    }

    return res.send(
      formatResponse(
        {
          source: sourceConfig.database,
          update: updateArg || "ALL",
          targets: results,
        },
        "Production database sync completed.",
      ),
    );
  } catch (error) {
    console.log(error);
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse(error.toString()));
  }
};
