const { Op } = require("sequelize");
const db = require("@models");
const { getRoleId, getSuperAdminId, getAdminTeamUserIds } = require("@library/common");

/*
 * Frontend stock by the visitor's state: a visitor sees the stock of the
 * admins in their state (and those admins' SEs) plus the super admin's.
 *
 * The state comes from the visitor's IP via geoip-lite (an offline database,
 * so no visitor IP leaves this server). Without the package the filter is off
 * and every stock shows, as before.
 */
let geoip = null;
try {
  geoip = require("geoip-lite");
} catch (e) {
  geoip = null;
}

/* ISO 3166-2:IN codes geoip-lite reports, old and new spellings included */
const IN_REGION_NAMES = {
  AN: "Andaman and Nicobar Islands", AP: "Andhra Pradesh", AR: "Arunachal Pradesh",
  AS: "Assam", BR: "Bihar", CH: "Chandigarh", CT: "Chhattisgarh", CG: "Chhattisgarh",
  DN: "Dadra and Nagar Haveli", DD: "Daman and Diu", DH: "Dadra and Nagar Haveli",
  DL: "Delhi", GA: "Goa", GJ: "Gujarat", HR: "Haryana", HP: "Himachal Pradesh",
  JK: "Jammu and Kashmir", JH: "Jharkhand", KA: "Karnataka", KL: "Kerala",
  LA: "Ladakh", LD: "Lakshadweep", MP: "Madhya Pradesh", MH: "Maharashtra",
  MN: "Manipur", ML: "Meghalaya", MZ: "Mizoram", NL: "Nagaland", OR: "Odisha",
  OD: "Odisha", PY: "Puducherry", PB: "Punjab", RJ: "Rajasthan", SK: "Sikkim",
  TN: "Tamil Nadu", TG: "Telangana", TS: "Telangana", TR: "Tripura",
  UP: "Uttar Pradesh", UT: "Uttarakhand", UK: "Uttarakhand", WB: "West Bengal",
};

/* the states table has spelling variants ("West Bengal ", "Uttrakhand") */
const ALIASES = { uttrakhand: "uttarakhand", orissa: "odisha", pondicherry: "puducherry" };
const normalize = (name) => {
  const key = String(name || "").toLowerCase().replace(/[^a-z]/g, "");
  return ALIASES[key] || key;
};

const clientIp = (req) => {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const ip = forwarded || (req.socket && req.socket.remoteAddress) || req.ip || "";
  return ip.replace(/^::ffff:/, "");
};

/* states table, refreshed every 10 minutes */
let statesCache = { at: 0, byName: new Map() };
const stateIdByName = async (name) => {
  if (Date.now() - statesCache.at > 10 * 60 * 1000) {
    const states = await db.states.findAll({ attributes: ["id", "name"], raw: true });
    statesCache = {
      at: Date.now(),
      byName: new Map(states.map((s) => [normalize(s.name), s.id])),
    };
  }
  return statesCache.byName.get(normalize(name)) || null;
};

/* the visitor's state id; ?state_id= overrides it (testing from localhost) */
const visitorStateId = async (req) => {
  const override = parseInt(req.query && req.query.state_id, 10);
  if (override > 0) return override;
  if (!geoip) return null;
  const geo = geoip.lookup(clientIp(req));
  if (!geo || geo.country !== "IN") return null;
  const name = IN_REGION_NAMES[geo.region];
  return name ? stateIdByName(name) : null;
};

/*
 * Stock owners the visitor may see: the super admin, plus every admin of the
 * visitor's state with its SEs. Admins who turned off "show stock on frontend"
 * (and their SEs) are left out. Returns null when the filter is off (no
 * geoip-lite), meaning every stock shows.
 */
const frontendStockOwnerIds = async (req) => {
  if (!geoip && !(req.query && req.query.state_id)) return null;
  const owners = new Set();
  const superAdmin = await db.users.findOne({
    attributes: ["id", "show_frontend_stock"],
    where: { id: await getSuperAdminId() },
    raw: true,
  });
  if (superAdmin && superAdmin.show_frontend_stock !== 0 && superAdmin.show_frontend_stock !== false) {
    owners.add(superAdmin.id);
  }
  const stateId = await visitorStateId(req);
  if (stateId) {
    const admins = await db.users.findAll({
      attributes: ["id"],
      where: { role_id: getRoleId("admin"), state_id: stateId, show_frontend_stock: true },
      raw: true,
    });
    for (const admin of admins) {
      for (const id of await getAdminTeamUserIds(admin.id)) owners.add(id);
    }
  }
  return [...owners];
};

/* users who turned off "show stock on frontend" */
const hiddenFrontendStockOwnerIds = async () =>
  (
    await db.users.findAll({
      attributes: ["id"],
      where: { show_frontend_stock: false },
      raw: true,
    })
  ).map((u) => u.id);

/*
 * The stocks.user_id condition for what a frontend visitor may see: the state
 * filter when it is on, otherwise everyone but the users who turned it off.
 * Returns null when nothing needs filtering.
 */
const frontendStockOwnerWhere = async (req) => {
  const visible = await frontendStockOwnerIds(req);
  if (visible) return { [Op.in]: visible };
  const hidden = await hiddenFrontendStockOwnerIds();
  return hidden.length ? { [Op.notIn]: hidden } : null;
};

module.exports = {
  frontendStockOwnerIds,
  frontendStockOwnerWhere,
  hiddenFrontendStockOwnerIds,
  visitorStateId,
  clientIp,
};
