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

module.exports = {
    getOrderCartData
}