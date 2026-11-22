const { Op } = require("sequelize");
const db = require("@models");
const { orderHandlingAdminId, canStockAddCart, getRoleId, getSuperAdminId } = require("@library/common");

/* how a user is named in stock requests: the company name, else the person */
const userLabel = (u) => (u ? String(u.company_name || "").trim() || u.name || "" : "");
const userLabelById = async (id) =>
  id ? userLabel(await db.users.findByPk(id, { attributes: ["name", "company_name"], paranoid: false, raw: true })) : "";

/*
 * For an order assigned to an SE: which pieces the SE already holds, and which
 * its admin holds and could transfer to it.
 *
 *   - an item with a certificate is that exact piece: with the SE, with the
 *     admin, or elsewhere (another holder, or sold)
 *   - an item without one is matched by product, like "sale proceed" does:
 *     the SE's own pieces first, then the admin's, up to the item's quantity
 *
 * Returns { seId, adminId, items, requestableStockIds }.
 */
const orderStockPlan = async (order) => {
  const seId = order.sales_executive_id || null;
  const adminId = seId ? await orderHandlingAdminId(order) : null;
  const products = await db.order_products.findAll({
    where: { order_id: order.id },
    include: [{ model: db.products, as: "product", attributes: ["id", "name", "type"] }],
    order: [["id", "ASC"]],
  });

  const items = [];
  const requestable = [];
  const taken = new Set();
  for (const op of products) {
    const name = op.product ? op.product.name : "";
    if (op.certificate_no) {
      const piece = await db.stocks.findOne({
        attributes: ["id", "user_id"],
        where: { certificate_no: op.certificate_no },
        include: [{ model: db.users, as: "user", attributes: ["name", "company_name"] }],
      });
      let status = "elsewhere";
      const adminStockIds = [];
      if (piece && piece.user_id == seId) status = "with_se";
      else if (piece && adminId && piece.user_id == adminId) {
        status = "with_admin";
        adminStockIds.push(piece.id);
        requestable.push(piece.id);
      }
      items.push({
        order_product_id: op.id,
        product_name: name,
        certificate_no: op.certificate_no,
        status,
        quantity: 1,
        admin_stock_ids: adminStockIds,
        // who has it when it's neither the SE's nor its admin's (empty: sold)
        holder_name: status === "elsewhere" && piece && piece.user ? userLabel(piece.user) : "",
      });
      continue;
    }

    /* no certificate: any pieces of the product, the SE's first */
    const need = parseInt(op.quantity, 10) || 1;
    const pick = async (ownerId, max) => {
      if (!ownerId || max <= 0) return [];
      const rows = await db.stocks.findAll({
        attributes: ["id"],
        where: { user_id: ownerId, product_id: op.product_id, id: { [Op.notIn]: [...taken, 0] } },
        order: [["id", "ASC"]],
        raw: true,
      });
      const ids = [];
      for (const r of rows) {
        if (ids.length >= max) break;
        if (await canStockAddCart(r.id, op.product ? op.product.type : null, ownerId)) ids.push(r.id);
      }
      ids.forEach((id) => taken.add(id));
      return ids;
    };
    const fromSe = await pick(seId, need);
    const fromAdmin = await pick(adminId, need - fromSe.length);
    requestable.push(...fromAdmin);
    const status =
      fromSe.length >= need ? "with_se" : fromSe.length + fromAdmin.length >= need ? "with_admin" : "elsewhere";
    items.push({ order_product_id: op.id, product_name: name, certificate_no: "", status, quantity: need, admin_stock_ids: fromAdmin });
  }

  return { seId, adminId, items, requestableStockIds: requestable };
};

/* the admin above a user (an SE, a distributor under an SE...), or null */
const adminAbove = async (userId) => {
  let user = await db.users.findByPk(userId, { attributes: ["id", "name", "company_name", "role_id", "parent_id"], raw: true });
  for (let hops = 0; user && hops < 4; hops++) {
    if (user.role_id == getRoleId("admin")) return user;
    if (!user.parent_id) return null;
    user = await db.users.findByPk(user.parent_id, { attributes: ["id", "name", "company_name", "role_id", "parent_id"], raw: true });
  }
  return null;
};

/*
 * Who else holds an order item's piece(s), with how many each holds, and who a
 * stock request for them goes to (`request_to`):
 *   - an admin or the super admin: themselves
 *   - an SE (or distributor) of the requester's own team: that SE
 *   - an SE of another admin's team: that admin, who then asks its SE
 *   - an SE with no admin above it: the super admin
 *   - an item with a certificate: that piece's holder (1)
 *   - without one: every holder of that product's pieces, counted
 * Returns [{ user_id, name, role, count, stock_ids, request_to, requestable }].
 */
const itemHolders = async (orderProduct, requesterId) => {
  const where = orderProduct.certificate_no
    ? { certificate_no: orderProduct.certificate_no }
    : { product_id: orderProduct.product_id };
  const rows = await db.stocks.findAll({
    attributes: ["id", "user_id"],
    where,
    include: [{ model: db.users, as: "user", attributes: ["id", "name", "company_name", "role_id"], required: true }],
  });
  const roleOf = {
    [getRoleId("admin")]: "admin",
    [getRoleId("superadmin")]: "super_admin",
    [getRoleId("sales_executive")]: "sales_executive",
    [getRoleId("distributor")]: "distributor",
  };
  const byHolder = new Map();
  for (const r of rows) {
    if (r.user_id == requesterId) continue;
    let h = byHolder.get(r.user_id);
    if (!h) {
      const role = roleOf[r.user.role_id] || "other";
      let to = { user_id: r.user_id, name: userLabel(r.user), role };
      if (role !== "admin" && role !== "super_admin") {
        const admin = await adminAbove(r.user_id);
        if (admin && admin.id != requesterId) to = { user_id: admin.id, name: userLabel(admin), role: "admin" };
        else if (!admin) {
          const superId = await getSuperAdminId();
          to = { user_id: superId, name: (await userLabelById(superId)) || "Super Admin", role: "super_admin" };
        }
      }
      const requestable = to.user_id != requesterId;
      h = { user_id: r.user_id, name: userLabel(r.user), role, count: 0, stock_ids: [], request_to: requestable ? to : null, requestable };
    }
    h.count++;
    h.stock_ids.push(r.id);
    byHolder.set(r.user_id, h);
  }
  return [...byHolder.values()];
};

/* the pieces of an order line a user holds right now */
const piecesHeldBy = (line, userId, options = {}) =>
  db.stocks.findAll({
    where: line.certificate_no
      ? { certificate_no: line.certificate_no, user_id: userId }
      : { product_id: line.product_id, user_id: userId },
    order: [["id", "ASC"]],
    limit: line.certificate_no ? 1 : parseInt(line.quantity, 10) || 1,
    ...options,
  });

/*
 * Where an order line's piece is and how it got there:
 *   - path:  every holder of the piece by certificate, oldest first (deleted
 *            stock rows are the earlier holders), repeats in a row merged
 *   - now_with: who holds it now ("" when sold / not in stock)
 *   - steps: each stock request on the order for this line, oldest first -
 *            asker, holder, and its state: requested / forwarded (the one
 *            asked passed it on to someone else) / ready (the one asked holds
 *            it now, not yet in its cart) / in_cart (the holder put
 *            it in its cart) / transferred (it left the holder) / received
 *            (the asker has it)
 * `requests` are the order's stock_transfer_requests with asker + holder.
 */
const itemTracking = async (line, requests) => {
  let path = [];
  let nowWithId = null;
  if (line.certificate_no) {
    const rows = await db.stocks.findAll({
      attributes: ["id", "user_id", "deletedAt"],
      where: { certificate_no: line.certificate_no },
      include: [{ model: db.users, as: "user", attributes: ["id", "name", "company_name"], paranoid: false }],
      paranoid: false,
      order: [["id", "ASC"]],
    });
    for (const r of rows) {
      const name = r.user ? userLabel(r.user) : "";
      if (!path.length || path[path.length - 1].user_id != r.user_id) path.push({ user_id: r.user_id, name });
    }
    const live = rows.filter((r) => !r.deletedAt).pop();
    nowWithId = live ? live.user_id : null;
  }
  const nowWith = nowWithId ? (path.filter((p) => p.user_id == nowWithId).pop() || {}).name || "" : "";
  const hops = requests.filter((r) => r.order_product_ids.includes(line.id));
  const steps = hops
    .map((r) => {
      /* the asker holding the piece completes its hop, however it got there
         (e.g. the admin's SE handed it straight to the order's SE) */
      let state = "requested";
      if (nowWithId && nowWithId == r.sales_executive_id) state = "received";
      else if (r.status == "added_to_cart") state = nowWithId == r.admin_id ? "in_cart" : "transferred";
      /* the one asked has it now - ready for them to transfer */
      else if (nowWithId && nowWithId == r.admin_id) state = "ready";
      /* the one asked passed it on (asked someone else for this item) */
      else if (hops.some((x) => x.id > r.id && x.sales_executive_id == r.admin_id)) state = "forwarded";
      return {
        from: r.salesExecutive ? userLabel(r.salesExecutive) : "",
        to: r.holder ? userLabel(r.holder) : "",
        state,
        at: r.updatedAt,
      };
    });
  return { path: path.slice(-6), now_with: nowWith, steps };
};

/*
 * A request marked added_to_cart whose pieces were taken back out of the
 * holder's cart (and the holder still has them, so nothing was sold) is
 * pending again - its Add to Cart comes back. Fixed on read, so every way of
 * emptying the cart is covered. Returns the requests, updated in place.
 */
const healRequests = async (requests) => {
  for (const r of requests) {
    if (r.status != "added_to_cart" || !r.stock_ids.length) continue;
    const inCart = await db.carts.count({ where: { user_id: r.admin_id, stock_id: r.stock_ids } });
    if (inCart) continue;
    const held = await db.stocks.count({ where: { id: r.stock_ids, user_id: r.admin_id } });
    if (held) await r.update({ status: "pending" });
  }
  return requests;
};

/* the order's stock requests with asker and holder names, for itemTracking() */
const orderRequests = async (orderId) =>
  healRequests(await db.stock_transfer_requests.findAll({
    where: { order_id: orderId },
    include: [
      { model: db.users, as: "salesExecutive", attributes: ["id", "name", "company_name"], paranoid: false },
      { model: db.users, as: "holder", attributes: ["id", "name", "company_name"], paranoid: false },
    ],
    order: [["id", "ASC"]],
  }));

module.exports = { userLabel, userLabelById, orderStockPlan, itemHolders, adminAbove, piecesHeldBy, itemTracking, orderRequests, healRequests };
