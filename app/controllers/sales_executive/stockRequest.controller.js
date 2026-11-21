const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { canStockAddCart, getUserColumnValue, canManageOrder, getRoleId, orderHandlingAdminId } = require("@library/common");
const { userLabel, userLabelById, orderStockPlan, itemHolders, adminAbove, piecesHeldBy, itemTracking, orderRequests, healRequests } = require("@library/stockRequest");
const { getPaginationOptions } = require("@helpers/paginator");
const { statusDisplay, formatDateTime } = require("@helpers/helper");
const { getStockMaterials, insertIntoCart } = require("@library/orderCart");
const orderModel = db.orders;
const RequestModel = db.stock_transfer_requests;

/*
 * A request is "asker -> holder": sales_executive_id is whoever asked (the
 * order's SE asking its admin, or that admin asking another admin / the super
 * admin), admin_id is who is asked and holds the pieces.
 */
const latestAskedBy = (orderId, askerId) =>
  RequestModel.findOne({ where: { order_id: orderId, sales_executive_id: askerId }, order: [["id", "DESC"]] });

const requestJson = (r) =>
  r
    ? { id: r.id, status: r.status, items: r.order_product_ids.length, pieces: r.stock_ids.length, created_at: r.createdAt }
    : null;

/* items of the order the SE does not hold - the ones it may ask for */
const missing = (plan) => plan.items.filter((i) => i.status != "with_se");

/**
 * SE: where each item's piece is (with the SE, with its admin, elsewhere),
 * which items it already asked for, and its latest request.
 */
const availability = async (req, res) => {
  const order = await orderModel.findOne({ where: { id: req.params.id, sales_executive_id: req.userId } });
  if (!order) {
    return res.status(errorCodes.default).send(formatErrorResponse("Order not found."));
  }
  const plan = await orderStockPlan(order);
  const request = await latestAskedBy(order.id, req.userId);
  const asked = new Set(request && request.status == "pending" ? request.order_product_ids : []);
  const requests = await orderRequests(order.id);
  const items = [];
  for (const i of plan.items) {
    const line = { id: i.order_product_id, certificate_no: i.certificate_no };
    items.push({ ...i, requested: asked.has(i.order_product_id), tracking: await itemTracking(line, requests) });
  }
  res.send(formatResponse({
    items,
    can_request: items.some((i) => i.status != "with_se" && !i.requested),
    request: requestJson(request),
  }));
};

/**
 * SE: ask its admin for the selected items it does not hold (body:
 * order_product_ids). Added to its pending request on the order if any.
 */
const store = async (req, res) => {
  const order = await orderModel.findOne({ where: { id: req.params.id, sales_executive_id: req.userId } });
  if (!order) {
    return res.status(errorCodes.default).send(formatErrorResponse("Order not found."));
  }
  const plan = await orderStockPlan(order);
  if (!plan.adminId) {
    return res.status(errorCodes.default).send(formatErrorResponse("No admin found for you to request from."));
  }
  const wanted = (Array.isArray(req.body.order_product_ids) ? req.body.order_product_ids : []).map((x) => parseInt(x, 10));
  const chosen = missing(plan).filter((i) => wanted.includes(i.order_product_id));
  if (!chosen.length) {
    return res.status(errorCodes.default).send(formatErrorResponse("Select the items you need."));
  }

  const pending = await RequestModel.findOne({
    where: { order_id: order.id, sales_executive_id: req.userId, admin_id: plan.adminId, status: "pending" },
  });
  const ids = [...new Set([...(pending ? pending.order_product_ids : []), ...chosen.map((i) => i.order_product_id)])];
  const stockIds = plan.items.filter((i) => ids.includes(i.order_product_id)).flatMap((i) => i.admin_stock_ids || []);
  if (pending) {
    await pending.update({ order_product_ids: ids, stock_ids: stockIds });
  } else {
    await RequestModel.create({
      order_id: order.id,
      sales_executive_id: req.userId,
      admin_id: plan.adminId,
      order_product_ids: ids,
      stock_ids: stockIds,
      status: "pending",
    });
  }
  res.send(formatResponse("", `${chosen.length} item(s) requested from your admin.`));
};

/**
 * Whoever was asked on an order (the handling admin by its SE, another admin,
 * the super admin): the latest request to it - each requested item, whether
 * it holds it, who else holds it and who to ask for it (`request_to`), and
 * what it already asked them for.
 */
const adminView = async (req, res) => {
  const order = await orderModel.findByPk(req.params.id);
  const requests = order
    ? await healRequests(await RequestModel.findAll({ where: { order_id: order.id, admin_id: req.userId }, order: [["id", "DESC"]] }))
    : [];
  const request = requests.find((r) => r.status == "pending") || requests[0];
  if (!request) return res.send(formatResponse(null));

  const lines = await db.order_products.findAll({
    where: { id: request.order_product_ids },
    include: [{ model: db.products, as: "product", attributes: ["name"] }],
    order: [["id", "ASC"]],
  });
  const askedOn = await RequestModel.findAll({
    where: { order_id: order.id, sales_executive_id: req.userId },
    include: [{ model: db.users, as: "holder", attributes: ["id", "name", "company_name"] }],
  });

  const onOrder = await orderRequests(order.id);
  const items = [];
  for (const line of lines) {
    items.push({
      tracking: await itemTracking(line, onOrder),
      order_product_id: line.id,
      product_name: line.product ? line.product.name : "",
      certificate_no: line.certificate_no || "",
      with_you: (await piecesHeldBy(line, req.userId, { attributes: ["id"] })).length > 0,
      holders: (await itemHolders(line, req.userId)).map(({ stock_ids, ...h }) => h),
      asked: askedOn
        .filter((r) => r.order_product_ids.includes(line.id))
        .map((r) => ({ holder_name: userLabel(r.holder), status: r.status })),
    });
  }
  const askerName = await userLabelById(request.sales_executive_id);
  res.send(formatResponse({
    ...requestJson(request),
    sales_executive_id: request.sales_executive_id,
    sales_executive_name: askerName,
    requested_by_name: askerName,
    requested_items: items,
  }));
};

/**
 * Pass a request on (body: holder_id = a `request_to` of the items' holders,
 * order_product_ids): the order's handling admin, or anyone with a pending
 * request on the order, asks an SE of its team, another admin (for that
 * admin's own or its SEs' pieces) or the super admin. Only the selected items
 * that target can supply are asked for; merged into a pending request to it.
 */
const requestFromHolder = async (req, res) => {
  const order = await orderModel.findByPk(req.params.id);
  const askedHere = order
    ? await RequestModel.count({ where: { order_id: order.id, admin_id: req.userId, status: "pending" } })
    : 0;
  if (!order || !(askedHere || (await canManageOrder(req, order)))) {
    return res.status(errorCodes.default).send(formatErrorResponse("This order is not yours to handle."));
  }
  const holderId = parseInt(req.body.holder_id, 10);
  if (!holderId || holderId == req.userId) {
    return res.status(errorCodes.default).send(formatErrorResponse("Choose who to request from."));
  }
  const wanted = (Array.isArray(req.body.order_product_ids) ? req.body.order_product_ids : []).map((x) => parseInt(x, 10));
  const lines = await db.order_products.findAll({ where: { order_id: order.id, id: wanted }, raw: true });
  const chosen = [];
  const stockIds = [];
  for (const line of lines) {
    const via = (await itemHolders(line, req.userId)).filter((h) => h.request_to && h.request_to.user_id == holderId);
    if (via.length) {
      chosen.push(line.id);
      stockIds.push(...via.flatMap((h) => h.stock_ids));
    }
  }
  if (!chosen.length) {
    return res.status(errorCodes.default).send(formatErrorResponse("They can supply none of the selected items."));
  }

  const pending = await RequestModel.findOne({
    where: { order_id: order.id, sales_executive_id: req.userId, admin_id: holderId, status: "pending" },
  });
  if (pending) {
    await pending.update({
      order_product_ids: [...new Set([...pending.order_product_ids, ...chosen])],
      stock_ids: [...new Set([...pending.stock_ids, ...stockIds])],
    });
  } else {
    await RequestModel.create({
      order_id: order.id,
      sales_executive_id: req.userId,
      admin_id: holderId,
      order_product_ids: chosen,
      stock_ids: stockIds,
      status: "pending",
    });
  }
  const name = (await userLabelById(holderId)) || "them";
  res.send(formatResponse("", `${chosen.length} item(s) requested from ${name}.`));
};

/*
 * Who the pieces of a request go to: the asker - except an SE asked by its own
 * admin for that admin's order, which hands them straight to the order's SE.
 */
const deliverTo = async (request, holderId) => {
  const order = await orderModel.findByPk(request.order_id);
  const admin = await adminAbove(holderId);
  if (
    order && order.sales_executive_id && order.sales_executive_id != holderId &&
    admin && admin.id == request.sales_executive_id && (await orderHandlingAdminId(order)) == admin.id
  ) {
    return order.sales_executive_id;
  }
  return request.sales_executive_id;
};

/**
 * Whoever was asked (an SE, an admin, the super admin): put the requested
 * pieces it holds right now into its cart, to transfer (sale / assign) them to
 * deliverTo() from the sale screen.
 */
const addToCart = async (req, res) => {
  const request = await RequestModel.findOne({ where: { id: req.params.id, admin_id: req.userId } });
  if (request) await healRequests([request]);
  if (!request || request.status != "pending") {
    return res.status(errorCodes.default).send(formatErrorResponse("No pending stock request found."));
  }
  const lines = await db.order_products.findAll({ where: { id: request.order_product_ids }, raw: true });
  const pieces = [];
  for (const line of lines) {
    const mine = await piecesHeldBy(line, req.userId, {
      include: [
        { model: db.stock_materials, as: "stockMaterials", separate: true },
        { model: db.products, as: "product", attributes: ["id", "type"] },
      ],
    });
    pieces.push(...mine);
  }
  let added = 0;
  const addedIds = [];
  for (const piece of pieces) {
    if (!(await canStockAddCart(piece.id, piece.product ? piece.product.type : null, req.userId))) continue;
    await insertIntoCart({
      user_id: req.userId,
      stock_id: piece.id,
      product_id: piece.product_id,
      size_id: piece.size_id,
      quantity: piece.quantity || 1,
      total_weight: piece.total_weight || null,
      materials: getStockMaterials(piece.stockMaterials || []),
    });
    added++;
    addedIds.push(piece.id);
  }
  if (!added) {
    return res.status(errorCodes.default).send(formatErrorResponse("You do not hold any of the requested pieces right now (or they are already in your cart)."));
  }
  await request.update({ status: "added_to_cart", stock_ids: addedIds });
  const toId = await deliverTo(request, req.userId);
  const toName = (await userLabelById(toId)) || "them";
  res.send(formatResponse(
    { added, requested_by_id: toId },
    `${added} piece(s) added to your cart - transfer them to ${toName} from Sale.`,
  ));
};

/**
 * SE / admin / super admin: the stock requests sent to it, or with
 * ?type=sent the ones it sent, newest first (?status=pending|added_to_cart).
 */
const index = async (req, res) => {
  const { page, limit, status, type } = req.query;
  /* received: asked of me (default); sent: what I asked others for */
  const where = type === "sent" ? { sales_executive_id: req.userId } : { admin_id: req.userId };
  if (status) where.status = status;
  const paginator = getPaginationOptions(page, limit);
  await healRequests(await RequestModel.findAll({ where: { ...where, status: "added_to_cart" } }));
  const data = await RequestModel.findAndCountAll({
    where,
    order: [["id", "DESC"]],
    offset: paginator.offset,
    limit: paginator.limit,
    include: [
      { model: db.users, as: "salesExecutive", attributes: ["id", "name", "company_name", "mobile", "role_id"] },
      { model: db.users, as: "holder", attributes: ["id", "name", "company_name", "mobile", "role_id"] },
      { model: orderModel, as: "order", attributes: ["id", "order_no", "status"] },
    ],
  });
  const lines = await db.order_products.findAll({
    attributes: ["id", "certificate_no"],
    where: { id: [...new Set(data.rows.flatMap((r) => r.order_product_ids)), 0] },
    raw: true,
  });
  const certOf = new Map(lines.map((l) => [l.id, l.certificate_no]));
  const roleName = (u) =>
    !u ? "" : u.role_id == getRoleId("admin") ? "Admin" : u.role_id == getRoleId("superadmin") ? "Super Admin" : "Sales Executive";
  res.send(formatResponse({
    items: data.rows.map((r) => ({
      id: r.id,
      order_id: r.order_id,
      order_no: r.order ? r.order.order_no : "",
      order_status_display: r.order ? statusDisplay(r.order.status) : "",
      requested_by_name: userLabel(r.salesExecutive),
      requested_by_role: roleName(r.salesExecutive),
      requested_by_mobile: r.salesExecutive ? r.salesExecutive.mobile || "" : "",
      requested_to_name: userLabel(r.holder),
      requested_to_role: roleName(r.holder),
      requested_to_mobile: r.holder ? r.holder.mobile || "" : "",
      items: r.order_product_ids.length,
      certificates: r.order_product_ids.map((id) => certOf.get(id)).filter(Boolean).join(", ") || "-",
      pieces: r.stock_ids.length,
      status: r.status,
      status_display: r.status == "pending" ? "Pending" : "Added To Cart",
      requested_at: formatDateTime(r.createdAt, 7),
    })),
    total: data.count,
  }));
};

/* a failing query must answer this request, never take the API process down */
const safe = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (err) {
    console.error("stock request:", err && err.message);
    if (!res.headersSent) {
      res.status(errorCodes.default).send(formatErrorResponse("Stock request is not available right now."));
    }
  }
};

exports.index = safe(index);
exports.availability = safe(availability);
exports.store = safe(store);
exports.adminView = safe(adminView);
exports.addToCart = safe(addToCart);
exports.requestFromHolder = safe(requestFromHolder);
