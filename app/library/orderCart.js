const db = require("@models");
const { Op, QueryTypes, Sequelize } = require("sequelize");
const { CartCollection } = require("@resources/customer/CartCollection");
const productsModel = db.products;
const materialModel =db.materials
const TaxSlabModel = db.tax_slabs;
const SubCategoryModel = db.sub_categories;
const CategoryModel = db.categories;
const UserPermissionModel = db.user_permissions;
const PaymentModel = db.payments;
const NoticationModel = db.notifiactions;
const cartsModel = db.carts;
const ProductSizeMaterialModel = db.product_size_materials;
const MaterialModel = db.materials;
const SizeModel = db.sizes;
const UserToUserModel = db.user_to_users;
const LoanDetailModel = db.loan_details;
const RetailerReviewModel = db.retailer_reviews;
const RetailerVisitModel = db.retailer_visits;
const WishlistModel = db.wishlists;
const stockHistoryModel = db.stock_raw_material_histories;
const AttendanceModel = db.attendances;
const HolidayModel = db.holidays;
const leaveApplicationModel = db.leave_applications;
const AdvancePaymentModel = db.advance_payments;
const cartMaterialsModel = db.cart_materials;
const DeviceToken = db.device_tokens;
const SettingModel = db.settings;
const StockModel = db.stocks;
const StockMaterialModel = db.stock_materials;
const UserModel = db.users;
const SaleModel = db.sales;
const dbSequelize = db.sequelize;
const MaterialPricePurityModel = db.material_price_purities;
const MaterialPriceModel = db.material_prices;
const PurityModel = db.purities;
const UnitModel = db.units;
const PurchaseModel = db.purchases;
const AddressModel = db.addresses;


const getOrderCartData = async (order_id, order_product_id, role) => {
    let conditions = { order_id: order_id, [Op.or]: [{[Op.and]: [
        { type: { [Op.not]: null }},
        { type: { [Op.ne]: 'sale' }}
     ]}, {type: {[Op.is]: null}}] };
    if (order_product_id) {
        conditions.order_product_id = order_product_id;
    }
    let carts = await cartsModel.findAll({
        where: conditions,
        include: [
            {
                model: cartMaterialsModel,
                as: 'cartMaterial',
                separate: true,
                include: [
                    {
                        model: materialModel,
                        as: 'material'
                    },
                    {
                        model: UnitModel,
                        as: 'unit'
                    },
                    {
                        model: PurityModel,
                        as: 'purity'
                    }
                ]
            },
            {
                model: productsModel,
                as: 'product',
                include: [
                    {
                        model: SubCategoryModel,
                        as: 'sub_category',
                        required: true
                    },
                    {
                        model: TaxSlabModel,
                        as: 'tax',
                    }
                ]
            },
            {
                model: SizeModel,
                as: 'size'
            }
        ]
    });

    carts = await CartCollection(carts, role);
    if(order_product_id){
        return carts.length ? carts[0] : null;
    }else{
        return carts;
    }
}

/* a stock piece's materials, in the shape cart rows take */
const getStockMaterials = (stockMaterials) => {
  let materialItem = [];
  for (let item of stockMaterials) {
    materialItem.push({
      material_id: item.material_id,
      weight: item.weight,
      quantity: item.quantity,
      unit_id: item.unit_id,
      purity_id: item.purity_id
    });
  }
  return materialItem;
}

const insertIntoCart = async (data) => {
  let cart = await cartsModel.create({
    user_id: data.user_id,
    stock_id: data.stock_id,
    product_id: data.product_id,
    size_id: data.size_id,
    quantity: data.quantity,
    total_weight: data.total_weight,
    type: 'sale',
    order_product_id: data.order_product_id
  });
  for (let x = 0; x < data.materials.length; x++) {
    let material = data.materials[x];
    await db.cart_materials.create({
      cart_id: cart.id,
      material_id: material.material_id,
      purity_id: material.purity_id,
      weight: material.weight,
      unit_id: material.unit_id,
      quantity: material.quantity
    });
  }
}

/* order statuses a sale can still complete */
const OPEN_ORDER_STATUSES = ["pending", "accepted", "on_process", "shipped"];

/*
 * Orders whose pieces have all been sold to the order's buyer are delivered -
 * however the sale was made (from the order's Sale, or the plain Sale screen).
 * Pieces are matched by certificate; an order with an uncertified item is left
 * to its own status flow. Pass order ids, or a sale id to check the orders
 * holding the certificates that sale sold.
 * ponytail: one query per order; batch if a sale ever touches many orders.
 */
const deliverSoldOrders = async ({ orderIds = [], saleId = null }) => {
  let ids = [...orderIds];
  if (saleId) {
    const certs = (
      await db.sale_products.findAll({ attributes: ["certificate_no"], where: { sale_id: saleId }, raw: true })
    ).map((r) => r.certificate_no).filter(Boolean);
    if (certs.length) {
      ids.push(...(await db.order_products.findAll({ attributes: ["order_id"], where: { certificate_no: certs }, raw: true })).map((r) => r.order_id));
    }
  }
  ids = [...new Set(ids.filter(Boolean))];
  if (!ids.length) return;
  const orders = await db.orders.findAll({
    attributes: ["id", "user_id", "createdAt"],
    where: { id: ids, status: OPEN_ORDER_STATUSES },
  });
  for (const order of orders) {
    const lines = await db.order_products.findAll({ attributes: ["certificate_no"], where: { order_id: order.id }, raw: true });
    if (!lines.length || lines.some((l) => !l.certificate_no)) continue;
    const saleIds = (
      await db.sales.findAll({
        attributes: ["id"],
        where: { user_id: order.user_id, createdAt: { [Op.gte]: order.createdAt } },
        raw: true,
      })
    ).map((r) => r.id);
    if (!saleIds.length) continue;
    const sold = await db.sale_products.findAll({
      attributes: ["certificate_no"],
      where: { sale_id: saleIds, certificate_no: lines.map((l) => l.certificate_no) },
      raw: true,
    });
    const soldCerts = new Set(sold.map((r) => String(r.certificate_no).toLowerCase()));
    if (lines.every((l) => soldCerts.has(String(l.certificate_no).toLowerCase()))) {
      await db.orders.update({ status: "delivered" }, { where: { id: order.id } });
    }
  }
};

module.exports = {
    deliverSoldOrders,
    getOrderCartData,
    getStockMaterials,
    insertIntoCart
}