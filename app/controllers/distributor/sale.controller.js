const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const moment = require('moment');
const {isEmpty, getDateFromToWhere, priceFormat, displayAmount, addLog, weightFormat} = require("@helpers/helper");
const {updateOrCreate, removeMaterialFromStock} = require("@library/common");
const { getPaginationOptions } = require('@helpers/paginator')
const {SaleCollection} = require("@resources/superadmin/SaleCollection");
const { PurityCollection } = require("@resources/superadmin/PurityCollection");
const { Op } = require("sequelize");
const sequelize = db.sequelize;
const ProductModel = db.products;
const UserModel = db.users;
const CategoryModel = db.categories;
const PurityModel = db.purities;
const UnitModel = db.units;
const MaterialModel = db.materials;
const SizeModel = db.sizes;
const StockModel = db.stocks;
const StockMaterialModel = db.stock_materials;
const SaleModel = db.sales;
const SaleProductModel = db.sale_products;
const SaleProductMaterialModel = db.sale_product_materials;
const stockHistoryModel = db.stock_raw_material_histories;
const orderModel = db.orders;

/**
 * Retrieve all sales
 * 
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, user_id, search, date_from, date_to } = req.query;
  let conditions = {sale_by: req.userId}
  if(!isEmpty(user_id)){
    conditions.user_id = user_id;
  }
  if(!isEmpty(search)){
    conditions.invoice_number = {[Op.like]: `%${search}%` };
  }
  conditions = {...conditions, ...getDateFromToWhere(date_from, date_to, 'invoice_date')}

  const paginatorOptions = getPaginationOptions(page, limit);
  SaleModel.findAndCountAll({ 
    order:[['id', 'DESC']],
    where: conditions,
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    include: [
      {
        model: SaleProductModel,
        as: 'saleProducts',
        include: [
          {
            model: ProductModel,
            as: 'product',
          },
          {
            model: SizeModel,
            as: 'size',
          },
          {
            model: SaleProductMaterialModel,
            as: 'saleMaterials',
            include: [
              {
                model: MaterialModel,
                as: 'material'
              }
            ]
          }
        ]
      },
      {
        model: UserModel,
        as: 'user',
      }
    ]
  }).then(async (data) => {
    let result = {
      items: SaleCollection(data.rows),
      total: data.count,
    }
    res.send(formatResponse(result, 'Sales List'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });
};



/**
 * Store sale
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  let data = req.body;

  if (!isEmpty(data.invoice_number)) {
    let sdata = await SaleModel.findOne({
      where: { invoice_number: data.invoice_number },
    });
    if (sdata) {
      /* return res
        .status(errorCodes.default)
        .send(formatErrorResponse("Invoice number is exists.")); */
        /* create new invoice nummber */
        let sale = await SaleModel.findOne({
          attributes: ["id"],
          order: [["id", "DESC"]],
        });
        data.invoice_number = "RV-S-" + (sale ? sale.id + 1 : 1);
    }
  }

  try {
    //const trans = await sequelize.transaction(async (t) => {

      //insert into sale table
      let invoice_number = data.invoice_number || null;
      let saleObj = {
        user_id: data.user_id,
        order_id: data.order_id || null,
        sale_by: req.userId,
        invoice_number: invoice_number,
        invoice_date: moment(data.invoice_date).format('YYYY-MM-DD'),
        notes: data.notes,
        payment_mode: data.payment_mode,
        transaction_no: data.transaction_no,
        report_qty: data.report_qty,
        report_charge: data.report_charge_amount,
        report_tax_percentage: reportCharge[0].tax,
        total_amount: priceFormat(data.total_amount),
        cgst_tax: priceFormat(data.cgst_tax),
        sgst_tax: priceFormat(data.sgst_tax),
        igst_tax: priceFormat(data.igst_tax),
        discount: priceFormat(data.discount),
        paid_amount: priceFormat(data.paid_amount),
        taxable_amount: priceFormat(data.taxable_amount),
        total_payable: priceFormat(data.total_payable),
        due_amount: priceFormat(data.due_amount),
        due_date: moment(data.due_date).format('YYYY-MM-DD'),
        settlement_date: moment(data.settlement_date).format('YYYY-MM-DD'),
      };
      let sale = await SaleModel.create(saleObj);

      //insert into sale product table
      for(let i = 0; i < data.products.length; i++){
        let thisItem = data.products[i];
        let thisObj = {
          sale_id: sale.id,
          stock_id: thisItem.stock_id,
          product_id: thisItem.product_id,
          size_id: thisItem.size_id,
          certificate_no: thisItem.certificate_no,
          total_weight: weightFormat(thisItem.total_weight),
          sub_price: priceFormat(thisItem.sub_price),
          making_charge: priceFormat(thisItem.making_charge),
          rep: priceFormat(thisItem.rep),
          tax: priceFormat(thisItem.tax),
          total: priceFormat(thisItem.total),
          total_discount: priceFormat(thisItem.total_discount)
        }
        let saleProduct = await SaleProductModel.create(thisObj);

        let product = await ProductModel.findByPk(thisItem.product_id);

        //remove stock from superadmin
        if(product.type != "material"){
          await StockModel.destroy({ where: { id: thisItem.stock_id}});
        }

        //insert into sale product materials
        let batch_id = null;
        for(let x = 0; x < thisItem.materials.length; x++){
          let thisMObj = {
            sale_id: sale.id,
            sale_product_id: saleProduct.id,
            material_id: thisItem.materials[x].material_id,
            weight: weightFormat(thisItem.materials[x].weight),
            quantity: thisItem.materials[x].quantity,
            purity_id: thisItem.materials[x].purity_id,
            unit_id: thisItem.materials[x].unit_id,
            rate: thisItem.materials[x].rate,
            amount: thisItem.materials[x].amount,
            discount_amount: thisItem.materials[x].discount_amount,
            discount_percent: thisItem.materials[x].discount_percent
          }
          await SaleProductMaterialModel.create(thisMObj);

          /**
           * remove from stock materials
           */
          if(product.type == "material"){
            let stockMaterial = await StockMaterialModel.findOne({where: {material_id: thisItem.materials[x].material_id, stock_id: thisItem.stock_id}});
            if(stockMaterial){
              await StockMaterialModel.update({
                weight: weightFormat(parseFloat(stockMaterial.weight) - weightFormat(thisItem.materials[x].weight)),
                quantity: (parseInt(stockMaterial.quantity) - parseInt(thisItem.materials[x].quantity))
              },{where: {id: stockMaterial.id}});

              if((parseFloat(stockMaterial.quantity) - parseFloat(thisItem.materials[x].quantity)) <= 0){
                await StockModel.destroy({ where: { id: thisItem.stock_id}});
              }else{
                let stock = await StockModel.findOne({where: {id: thisItem.stock_id}});
                if(stock){
                  await StockModel.update({
                    quantity: (parseInt(stockMaterial.quantity) - parseInt(thisItem.materials[x].quantity)),
                    total_weight: (parseFloat(stock.total_weight) - weightFormat(thisItem.total_weight)),
                  },{where: {id: thisItem.stock_id}});
                }
              }

            }
            
          }

        }

        /**
        * START - add to admin stock
        */
        let stock = null;
        if(product.type == "material"){
          let quantity = 0;
          for(let x = 0; x < thisItem.materials.length; x++){
            quantity += thisItem.materials[x].quantity ? parseInt(thisItem.materials[x].quantity) : 0;
          }
          let result = await updateOrCreate(StockModel, {product_id: thisItem.product_id, user_id: data.user_id}, {product_id: thisItem.product_id, quantity: quantity, user_id: data.user_id, total_weight: thisItem.total_weight}, null, ['quantity', 'total_weight']);
          stock = result.item;
        }else{
          stock = await StockModel.create({
            product_id: thisItem.product_id,
            size_id: thisItem.size_id,
            certificate_no: thisItem.certificate_no,
            quantity: 1,
            user_id: data.user_id,
            sale_id: sale.id,
            total_weight: thisItem.total_weight
          });
        }

        //insert into stock materials
        let batch_id2 = null;
        for(let x = 0; x < thisItem.materials.length; x++){

          /**
          * add to stock materials
          */
          if(product.type == "material"){
            let stockMaterial = await StockMaterialModel.findOne({where: {stock_id: stock.id, material_id: thisItem.materials[x].material_id}});
            if(stockMaterial){
              await StockMaterialModel.update({
                weight: weightFormat(parseFloat(stockMaterial.weight) + weightFormat(thisItem.materials[x].weight)),
                quantity: (parseFloat(stockMaterial.quantity) + parseFloat(thisItem.materials[x].quantity)),
                purity_id: thisItem.materials[x].purity_id,
                unit_id: thisItem.materials[x].unit_id
              },{where: {id: stockMaterial.id}});
            }else{
              await StockMaterialModel.create({
                stock_id: stock.id, 
                material_id: thisItem.materials[x].material_id,
                weight: weightFormat(thisItem.materials[x].weight),
                quantity: thisItem.materials[x].quantity,
                purity_id: thisItem.materials[x].purity_id,
                unit_id: thisItem.materials[x].unit_id
              });
            }
          }else{
            await StockMaterialModel.create({
              stock_id: stock.id, 
              material_id: thisItem.materials[x].material_id,
              weight: weightFormat(thisItem.materials[x].weight),
              quantity: thisItem.materials[x].quantity,
              purity_id: thisItem.materials[x].purity_id,
              unit_id: thisItem.materials[x].unit_id
            });
          }

        }
 
        /**
        * END - add to admin stock
        */


      }

      //update invoice no if not sent
      if(isEmpty(invoice_number)){
        invoice_number = 'RV-S-' + sale.id;
        await SaleModel.update({
          invoice_number: invoice_number
        },{where: {id: sale.id}});
      }

      //complete order
      if(!isEmpty(data.order_id)){
        await orderModel.update({
          status: 'delivered'
        },{where: {id: data.order_id}});
      }

      res.send(formatResponse([], "Sale successfully!"));
    //});
  } catch (error) {
    addLog("error: " + error.toString())
    return res.status(errorCodes.default).send(formatErrorResponse('Sale does not success due to some error'));
  }

};


/**
 * View Sale
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.view = async (req, res) => {
  let sale = await SaleModel.findOne({ where: { id: req.params.id, sale_by: req.userId },
    include: [
      {
        model: SaleProductModel,
        as: 'saleProducts',
        include: [
          {
            model: ProductModel,
            as: 'product',
            include: [
              {
                model: CategoryModel,
                as: 'category'
              }
            ]
          },
          {
            model: SizeModel,
            as: 'size',
          },
          {
            model: SaleProductMaterialModel,
            as: 'saleMaterials',
            include: [
              {
                model: MaterialModel,
                as: 'material'
              },
              {
                model: PurityModel,
                as: 'purity'
              },
              {
                model: UnitModel,
                as: 'unit'
              }
            ]
          }
        ]
      },
      {
        model: UserModel,
        as: 'user',
      }
    ]
  });
  if (!sale) {
    return res.status(errorCodes.default).send(formatErrorResponse('Sale not found'));
  }
  res.send(formatResponse(SaleCollection(sale), "Sale details"));
};


  
/**
 * delete sale
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  let sale = await SaleModel.findOne({ 
    where: { id: req.params.id },
    include: [
      {
        model: SaleProductModel,
        as: 'saleProducts',
        include: [
          {
            model: ProductModel,
            as: 'product',
          },
          {
            model: SizeModel,
            as: 'size',
          },
          {
            model: SaleProductMaterialModel,
            as: 'saleMaterials',
            include: [
              {
                model: MaterialModel,
                as: 'material'
              }
            ]
          }
        ]
      },
    ]
  });
  if (!sale) {
    return res.status(errorCodes.default).send(formatErrorResponse('Data not found'));
  }

  try {
    let sale_id = req.params.id;
    //const trans = await sequelize.transaction(async (t) => {

      /**
       * Add to superadmin stock
       */
      for(let i = 0; i < sale.saleProducts.length; i++){
        let product = sale.saleProducts[i].product;
        if(product){
          if(product.type != "material"){
            await StockModel.update( { deletedAt: null }, { where: {deletedAt: {ne: null}, id: sale.saleProducts[i].stock_id}, paranoid: false  });
            await StockMaterialModel.update( { deletedAt: null }, { where: {deletedAt: {ne: null}, stock_id: sale.saleProducts[i].stock_id}, paranoid: false  });
          }else{
            let result = await updateOrCreate(StockModel, {product_id: product.id, user_id: req.userId}, {product_id: product.id, user_id: req.userId}, null);
            let stock = result.item;
            let totalQnty = 0;
            if(result.created){
              for(let x = 0; x < sale.saleProducts[i].saleMaterials.length; i++){
                let thisItem = sale.saleProducts[i].saleMaterials[x];
                await StockMaterialModel.create({
                  stock_id: stock.id, 
                  material_id: thisItem.material_id,
                  weight: weightFormat(thisItem.weight),
                  quantity: thisItem.quantity
                });
                totalQnty += parseInt(thisItem.quantity);
              }
            }else{
              for(let x = 0; x < sale.saleProducts[i].saleMaterials.length; x++){
                let thisItem = sale.saleProducts[i].saleMaterials[x];
                let stockMaterial = await StockMaterialModel.findOne({where: {stock_id: stock.id, material_id: thisItem.material_id}});
                if(stockMaterial){
                  await StockMaterialModel.update({
                    weight: weightFormat(parseFloat(stockMaterial.weight) + parseFloat(thisItem.weight)),
                    quantity: (parseFloat(stockMaterial.quantity) + parseFloat(thisItem.quantity))
                  },{where: {id: stockMaterial.id}});
                  totalQnty += thisItem.quantity;
                }
              }
            }
            totalQnty += stock.quantity ? parseFloat(stock.quantity) : 0;
            let totalWeight = stock.total_weight ? (parseFloat(stock.total_weight) + parseFloat(sale.saleProducts[i].total_weight)) : parseFloat(sale.saleProducts[i].total_weight);
            await StockModel.update({
              quantity: totalQnty,
              total_weight: weightFormat(totalWeight)
            },{where: {id: stock.id}});
          }
        }
  
      }

      /**
       * Remove from admin stock
       */
      for(let i = 0; i < sale.saleProducts.length; i++){
        let product = sale.saleProducts[i].product;
        if(product){
          if(product.type == "material"){
            let stock2 = await StockModel.findOne({where: {product_id: product.id, user_id: sale.user_id}});
            let quantity = 0;
            for(let mItem of sale.saleProducts[i].saleMaterials){
              let stockM = await StockMaterialModel.findOne({where: {stock_id: stock2.id, material_id: mItem.material_id}});
              if(stockM){
                await StockMaterialModel.update({
                weight: weightFormat(parseFloat(stockM.weight) - parseFloat(mItem.weight)),
                quantity: (parseFloat(stockM.quantity) - parseFloat(mItem.quantity))
                },{where: {id: stockM.id}});
                quantity += mItem.quantity ? parseInt(mItem.quantity) : 0;
              }
            }
            if(stock2.quantity == quantity){
                await StockModel.destroy({ where: { id: stock2.id}});
            }else{
              await StockModel.update({
              quantity: quantity,
              total_weight: (parseFloat(stock2.total_weight) - parseFloat(sale.saleProducts[i].total_weight))
              },{where: {id: stock2.id}});
            }
          }else{
            await StockModel.destroy({ where: { sale_id: sale.id}});
            
          }
        }

      }
      

      await SaleProductModel.destroy({ where: { sale_id: sale_id}});
      await SaleProductMaterialModel.destroy({ where: { sale_id: sale_id}});
      await SaleModel.destroy({ where: { id: sale_id}});

      res.send(formatResponse([], "Sale deleted successfully!"));
    //});
  } catch (error) {
    return res.status(errorCodes.default).send(formatErrorResponse('Sale does not delete due to some error'));
  }
}


/**
 * Download Invoice
 * 
 * @param {*} req
 * @param {*} res 
 */
 exports.downloadInvoice = async (req, res) => {
  let sale = await SaleModel.findOne({ where: { id: req.params.id, sale_by: req.userId },
    include: [
      {
        model: SaleProductModel,
        as: 'saleProducts',
        include: [
          {
            model: ProductModel,
            as: 'product',
            include: [
              {
                model: CategoryModel,
                as: 'category'
              }
            ]
          },
          {
            model: SizeModel,
            as: 'size',
          },
          {
            model: SaleProductMaterialModel,
            as: 'saleMaterials',
            include: [
              {
                model: MaterialModel,
                as: 'material'
              },
              {
                model: PurityModel,
                as: 'purity'
              },
              {
                model: UnitModel,
                as: 'unit'
              }
            ]
          }
        ]
      },
      {
        model: UserModel,
        as: 'user',
      }
    ]
  });
  if (!sale) {
    return res.status(errorCodes.default).send(formatErrorResponse('Sale not found'));
  }
  let saleData = SaleCollection(sale);

  //const logoUrl = process.env.BASE_URL + "public/images/logo.png";
  const logoUrl = "file://var/www/html/Prakriti/api.prakriti.one/public/images/logo.png";


  let html = `<!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bill</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <style>
  
      </style>
      </head>
      <body style="box-sizing: border-box; padding: 0px; margin: 0px; font-family:
          'Poppins', sans-serif; font-size: 10px;">
          <div class="invoice" style="max-width: 1000px; margin: auto;
              background-color: #f9f9f9; border: 2px solid #000;">
              <table cellpadding="0" cellspacing="0" width="100%">
                  <tbody>
                      <tr>
                          <td>
                              <table cellspacing="0" cellpadding="0" border="0"
                                  align="center" width="100%">
                                  <tr>
                                      <div style="display: table; width: 100%;
                                          border-bottom: 2px solid #000;">
                                          <div style="display: table-cell; width:
                                              33.33%; padding: 4px 8px;"> 
                                          </div>
                                          <div style="display: table-cell; width:
                                              33.33%; padding: 4px 8px;"><h1
                                                  style="font-size: 14px;
                                                  text-align:
                                                  center; margin: 0px;">Tax
                                                  Invoice</h1></div>
                                          <div style="display: table-cell; width:
                                              33.33%; text-align: right; padding:
                                              4px 8px;"></div>
                                      </div>
                                  </tr>
                              </table>
                              <table cellspacing="0" cellpadding="0" border="0"
                                  align="center" width="100%">
  
  
                                  <!-- <div class="underline" style="display: block; width: 100px; height: 3px; background-color: #000; margin: 0 auto 10px"></div> -->
                                  <tr>
                                      <div style="text-align: center; font-size: 22px;">
                                          <!--<img src="https://ratn-admin.newbazar.in/assets/logo.png" style="width:
                                              220px;"> -->
                                              RATN VIHAR
                                      </div>
                                      <h3 style="margin: 0; font-weight: 400;
                                          font-size: 10px;text-align: center">Head
                                          Office P210
                                          Strand Bank Road Brabzar Kolkata 700
                                          011</h3>
                                      <h3 style="margin: 0; font-weight: 400;
                                          font-size: 10px; text-align: center;">
                                          <strong>GST
                                              IN:</strong> 10CIUPK2654L1ZY | 
                                          <strong>Contact:</strong>
                                          9038377730,9038377731</h3>
                                  </tr>
  
                              </table>
                              <table cellspacing="0" cellpadding="0" border="0"
                                  align="center" width="100%">
                                  <tr>
                                      <td><div style="display: table; width: 100%;
                                              border-top: 2px solid #000;
                                              border-bottom: 2px solid #000;">
                                              <div style="width: 65%; display:
                                                  table-cell;
                                                  vertical-align: top;
                                                  border-right: 2px solid #000;
                                                  padding: 12px;">
  
                                                  <h3 style="margin: 0;
                                                      font-weight: 400;
                                                      font-size: 14px;"><span
                                                          style="font-weight:
                                                          600;">${saleData.user_details.company_name}</span>
                                                      </h3>
                                                  <h3 style="margin: 0;
                                                      font-weight: 400;
                                                      font-size: 10px;"> <span
                                                          style="font-weight:
                                                          600;">Name: </span>
                                                          ${saleData.user_name}</h3>
                                                  <h3 style="margin: 0;
                                                      font-weight: 400;
                                                      font-size: 10px;"> <span
                                                          style="font-weight:
                                                          600;">Contact: </span>
                                                          ${saleData.user_mobile}</h3>
                                                  <h3 style="margin: 0;
                                                      font-weight: 400;
                                                      font-size: 10px;"> <span
                                                          style="font-weight:
                                                          600;">Address: </span>
                                                          ${saleData.user_details.address}</span></h3>
                                              </div>
                                              <div style="width: 35%; display:
                                                  table-cell;
                                                  vertical-align: top;
                                                  text-align:
                                                  right; padding: 12px;">
                                                  <h3 style="margin: 0;
                                                      font-weight: 400;
                                                      font-size: 10px;">
                                                      <span
                                                      style="font-weight:
                                                      600;">Invoice
                                                      Date: </span> 
                                                      ${saleData.invoice_date}</h3>
                                                  <h3 style="margin: 0;
                                                      font-weight: 400;
                                                      font-size: 10px;">
                                                      <span
                                                      style="font-weight:
                                                      600;">Invoice
                                                      No: </span> ${saleData.invoice_number}
                                          </h3>
                                                  <h3 style="margin: 0;
                                                      font-weight: 400;
                                                      font-size: 10px;">
                                                      <span
                                                      style="font-weight:
                                                      600;">User Id: </span>  
                                                      RV${saleData.user_details.id}</h3>
                                              </div>
                                          </div></td>
                                  </tr>
  
                              </table>
                              <table cellspacing="0" cellpadding="5" border="0"
                                  align="center" width="100%">
                                  <thead>
                                      <tr style="background-color: #000;">
                                          <th style="text-align: left; color:
                                              #fff; border: 1px solid #000;">SL#</th>
                                          <th style="text-align: left; color:
                                              #fff;">Product Name</th>
                                          <th style="text-align: left; color:
                                              #fff;">Size</th>
                                          <th style="text-align: left; color:
                                              #fff;">Product Id</th>
                                          <th style="text-align: left; color:
                                              #fff;">Matl Cost</th>
                                          <th style="text-align: left; color:
                                              #fff;">Tag Price</th>
                                          <th style="text-align: left; color:
                                              #fff;">Disc</th>
                                          <th style="text-align: left; color:
                                              #fff;">Total</th>
                                      </tr>
                                  </thead>
                                  <tbody>`;
                                  for(let i = 0; i < saleData.products.length; i++){
                                      html += `<tr style="background-color: #ddd;">
                                          <td style="border: 1px solid #000;">
                                              ${i+1}
                                          </td>
                                          <td style="border: 1px solid #000;">
                                          ${saleData.products[i].product_name}
                                          </td>
                                          <td style="border: 1px solid #000;">
                                          ${saleData.products[i].size_name}
                                          </td>
                                          <td colspan="5" style="border: 1px solid
                                              #000;">
                                              ${saleData.products[i].product_code}
                                          </td>
                                      </tr><tr style="background-color: #fff;
                                            vertical-align: top;">`;
                                      html += `<td colspan="3" style="border: 1px solid
                                      #000;">`;
                                      for(let x = 0; x < saleData.products[i].materials.length; x++){
                                        html += `<div> <span>${saleData.products[i].materials[x].material_name}</span> <span>${saleData.products[i].materials[x].weight}${saleData.products[i].materials[x].unit_name}</span> X <span>${saleData.products[i].materials[x].rate}</span> = <span>${saleData.products[i].materials[x].amount}</span></div>`;
                                            
                                      }
                                      html += `</td>`;
                                      html += `<td style="border: 1px solid #000;">`;
                                      for(let x = 0; x < saleData.products[i].materials.length; x++){
                                        html += `<div>`;
                                        if(isEmpty(saleData.products[i].materials[x].discount_amount)){
                                          html += `-`;
                                        }else{
                                          html += `<span>Discount@${saleData.products[i].materials[x].discount_amount}%</span>
                                          <span>${saleData.products[i].materials[x].discount_amount_display}</span>`;
                                        }
                                        html += `</div>`;
                                      }
                                                
                                      html += `</td><td style="border: 1px solid #000;">`;
                                      for(let x = 0; x < saleData.products[i].materials.length; x++){
                                        html += `<div> <span>${priceFormat(saleData.products[i].materials[x].rate - saleData.products[i].materials[x].discount_amount)} </span> @${saleData.products[i].materials[x].discount_amount}% =
                                        <span>${saleData.products[i].materials[x].rate}</span></div>`;
                                      }
                                      html += `      
                                            </td style="border: 1px solid #000;">
                                            <td style="border: 1px solid #000;">
                                              ${displayAmount(saleData.products[i].making_charge + saleData.products[i].sub_price)}
                                            </td>
                                            <td style="border: 1px solid #000;">
                                            ${saleData.products[i].total_discount_display}
                                            </td>
                                            <td style="border: 1px solid #000;">
                                            ${saleData.products[i].total_display}
                                            </td></tr>`;
                                      }
                                      html += `<tr style="background-color: #ddd;
                                          vertical-align: top;">
                                          <td colspan="5"
                                              style="background-color:#fff;
                                              border:none;">
  
                                          </td>
                                          <td style="border: 1px solid #000;">
                                              <div>
                                                  <h4 style="margin: 0;
                                                      text-align: center;"> Tag
                                                      Price <span>${saleData.total_amount}</span></h4>
                                              </div>
                                          </td>
                                          <td style="border: 1px solid #000;">
                                              <div>
                                                  <h4 style="margin: 0;
                                                      text-align: center;">
                                                      Discount <span>${saleData.discount}%</span></h4>
                                              </div>
                                          </td>
                                          <td style="border: 1px solid #000;">
                                              <div>
                                                  <h4 style="margin: 0;
                                                      text-align: center;"> Gross
                                                      Amt <span>${saleData.total_payable}</span></h4>
                                              </div>
                                          </td>
  
                                      </tr>
                                  </tbody>
                              </table>
                              <br>
                              <table cellspacing="0" cellpadding="0" border="0"
                                  align="center" width="100%">
                                  <tr>
                                      <td style="padding: 12px;">
                                          <div style="display: table; width:
                                              100%;">`;
                                              if(!isEmpty(saleData.notes)){
                                              html += `<div style="width: 25%; padding-right: 1%;
                                                  vertical-align: top;">
                                                  <table cellspacing="0"
                                                      cellpadding="5"
                                                      border="1"
                                                      align="center" width="100%">
                                                      <tr>
                                                          <th>Remark</th>
                                                      </tr>
                                                      <tr>
                                                          <td>${saleData.notes}</td>
                                                      </tr>
                                                  </table>
                                                </div>`;
                                              }
                                              html += `<!--<div style="width: 50%; display:
                                                  table-cell; padding-right: 1%;
                                                  vertical-align: top;">
                                                  <table cellspacing="0"
                                                      cellpadding="5"
                                                      border="1"
                                                      align="center" width="100%">
                                                      <tr style="background-color:
                                                          #000;
                                                          color: #fff;">
                                                          <th>SL</th>
                                                          <th>PayDate</th>
                                                          <th>Mode of Payment</th>
                                                          <th>Amount</th>
                                                      </tr>
                                                      <tr style="background-color:
                                                          #ddd;">
                                                          <td>01</td>
                                                          <td>01/12/2022</td>
                                                          <td>NEFT765/9UYT </td>
                                                          <td>5000</td>
                                                      </tr>
                                                      <tr>
                                                          <td>02</td>
                                                          <td>01/12/2022</td>
                                                          <td>NEFT765/9UYT </td>
                                                          <td>5000</td>
                                                      </tr>
                                                      <tr style="background-color:
                                                          #ddd;">
                                                          <td>03</td>
                                                          <td>01/12/2022</td>
                                                          <td>NEFT765/9UYT </td>
                                                          <td>5000</td>
                                                      </tr>
                                                  </table>
                                              </div>
                                              <div style="width: 25%; display:
                                                  table-cell; vertical-align:
                                                  top;">
                                                  <table cellspacing="0"
                                                      cellpadding="5"
                                                      border="1"
                                                      align="center" width="100%">
                                                      <tr>
                                                          <td>
                                                              <div style="display:
                                                                  table;
                                                                  width: 100%;">
                                                                  <div
                                                                      style="display:
                                                                      table-cell;
                                                                      width:
                                                                      50%;">Sub
                                                                      Total</div>
                                                                  <div
                                                                      style="display:
                                                                      table-cell;
                                                                      width:
                                                                      50%;"> 23002</div>
                                                              </div>
                                                          </td>
  
                                                      </tr>
                                                      <tr>
                                                          <td>
                                                              <div style="display:
                                                                  table;
                                                                  width: 100%;">
                                                                  <div
                                                                      style="display:
                                                                      table-cell;
                                                                      width:
                                                                      50%;">CGST</div>
                                                                  <div
                                                                      style="display:
                                                                      table-cell;
                                                                      width:
                                                                      50%;"> 230</div>
                                                              </div>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td>
                                                              <div style="display:
                                                                  table;
                                                                  width: 100%;">
                                                                  <div
                                                                      style="display:
                                                                      table-cell;
                                                                      width:
                                                                      50%;">SGST</div>
                                                                  <div
                                                                      style="display:
                                                                      table-cell;
                                                                      width:
                                                                      50%;"> 230</div>
                                                              </div>
                                                          </td>
                                                      </tr>
  
  
                                                  </table>
                                              </div>-->
                                          </div>
                                      </td>
                                  </tr>
                              </table>
  
                              <table cellspacing="0" cellpadding="0" border="0"
                                  align="center" width="100%">
                                  <tbody>
                                      <tr>
                                          <hr style="border: 1px solid #000">
                                      </tr>
                                  </tbody>
                              </table>
  
                              <table cellspacing="0" cellpadding="0" border="0"
                                  align="center" width="100%">
                                  <div style="display: table; width: 100%;">
                                      <div style="display: table-cell; width:
                                          70%;">
                                          <h5 style="margin: 0px; padding: 5px
                                              12px; font-size: 14px; font-weight:
                                              600; text-transform: uppercase;">Notice</h5>
                                          <ul style="margin-bottom: 12px;">
                                              <li>Goods once sold will be taken
                                                  back with condition</li>
                                              <li>Minimum product value of Rs
                                                  5000/- above</li>
                                              <li>Returning Less than 25-30% of
                                                  billing amount</li>
                                              <li>Damage charge as per making cost
                                                  only</li>
                                              <li>Sale product return within 7
                                                  days from bill date</li>
                                              <li>All disputes are subject to
                                                  Patna Juridiction only</li>
                                          </ul>
                                      </div>
                                      <div style="display: table-cell; width:
                                          30%;">
                                          <!-- <div>
                                              <h4 style="margin-bottom: 10px; text-align: center;">Return %</h4>
                                              <input type="text" style="display: block; margin: auto; height: 38px;">
                                          </div>
                                          <div>
                                              <h4 style="margin-top: 10px; margin-bottom: 10px; text-align: center;">Customer Signature</h4>
                                              <input type="text" style="display: block; margin: auto; height: 38px;">
                                              
                                          </div> -->
                                      </div>
  
                                  </div>
                              </table>
                              <table cellspacing="0" cellpadding="0" border="0"
                                  align="center" width="100%">
                                  <tr>
                                      <td>
                                          <div style="display: table; width: 100%; border-top: 2px solid #000; border-bottom: 2px solid #000;">
                                              <div style="display: table-cell; width:
                                                  50%;">
                                                  <h2 style="margin: 0; font-size: 10px; text-align: center; padding-top: 14px;">Customer Signature</h2>
                                                  </div>
                                                  <div style="display: table-cell; width:
                                                  50%;">
                                              <h2 style="margin: 0; font-size: 10px; text-align: center; padding-top: 30px; padding-bottom: 4px;">For Prakriti</h2>    
                                              </div>
                                          </div>
                                      </td>
                                  </tr>
                                  
                              </table>
                              <h3 style="text-align: right; margin-bottom: 0;
                                  color: #333; font-weight: 400; font-size:
                                  10px; padding-right: 12px; ">Comprised bill
                                  valid with signature and stamp only</h3>
                              <h4 style="text-align: center; margin-bottom: 8px; margin-top: 10px;">Thank
                                  You! Visit Again.</h4>
  
                          </td>
                      </tr>
  
                  </tbody>
              </table>
          </div>
      </body>
  </html>`;

  var options = { 
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
        contents: ''
    },
    footer: {
        height: "28mm",
        contents: {
            first: '',
            2: '', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: ''
        }
    }
  };

  let file_path = "public/invoices/"+saleData.invoice_number+".pdf";

  var document = {
    html: html,
    data: {
      
    },
    path: './'+file_path,
    type: "",
  };
  pdf.create(document, options)
  .then((resp) => {
    res.send(formatResponse({
      file_name: saleData.invoice_number+".pdf",
      url: getFileAbsulatePathPDF(file_path),
      image_url: logoUrl
    }, "Invoice pdf"));
  })
  .catch((error) => {
    console.error(error);
  });
}

/**
 * Download Invoice
 *
 * @param {*} req
 * @param {*} res
 */
exports.downloadInvoiceInfo = async (req, res) => {
  let userID = isManager(req) ? req.userId : await getWorkingUserID(req);
  let sale = await SaleModel.findOne({
    //as: "sales",
    where: { id: req.params.id, sale_by: userID },
    include: [
      {
        model: SaleProductModel,
        as: "saleProducts",
        separate: true,
        include: [
          {
            model: ProductModel,
            as: "product",
            include: [
              {
                model: CategoryModel,
                as: "category",
              },
              {
                model: SubCategoryModel,
                as: "sub_category",
              },
              {
                model: taxSlabModel,
                as: "tax",
              },
            ],
          },
          {
            model: SizeModel,
            as: "size",
          },
          /* {
            model: StockModel,
            as: "stock",
            where: {
              user_id: sequelize.col('sales.user_id')
            } 
          },  */
          {
            model: SaleProductMaterialModel,
            as: "saleMaterials",
            separate: true,
            include: [
              {
                model: MaterialModel,
                as: "material",
              },
              {
                model: PurityModel,
                as: "purity",
              },
              {
                model: UnitModel,
                as: "unit",
              },
            ],
          },
        ],
      },
      {
        model: PurchaseModel,
        as: "purchase",
      },
      {
        model: StockModel,
        as: "saleStocks",
        where: {
          purchase_id: sequelize.col("purchase.id"),
        },
        required: false,
      },
      {
        model: UserModel,
        as: "user",
      },
      {
        model: UserModel,
        as: "saleBy",
      },
    ],
  });
  if (!sale) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("Sale not found"));
  }

  let saleData = SaleCollection(sale);

  let payments = await PaymentModel.findAll({
    where: {
      table_type: "sale",
      table_id: req.params.id,
    },
    include: [
      {
        model: UserModel,
        as: "user",
      },
    ],
  });
  payments = await PaymentCollection(payments);

  /* 18k gold purity value */
  let purity18K = await PurityModel.findOne({  
    where: {
      id: 1, //18K
    },  
  });

  purity18K = await PurityCollection(purity18K);

  //compactLog("payments : ",payments);
  const cwd = process.cwd();
  // const logoUrl = `file://${cwd}/public/images/logo.png`;
  const logoUrl = `public/images/logo.png`;
  // const logoUrl = process.env.BASE_URL + "public/images/logo.png";

  const bitmap = fs.readFileSync(logoUrl);
  const logo = bitmap.toString("base64");

  let footerhtml = `
              <div class="invoice" style="width: 100%; margin: 0; padding: 15px; position: absolute; left:0px; bottom: 0px; background-color: #f9f9f9;">
                  <hr/>
                  <table cellpadding="0" cellspacing="1"  style="margin:auto; width:100%" >
                      <tbody>
                          <tr>
                              <td>
                                <table cellspacing="0" cellpadding="0"
                                    border="0"
                                    align="center" width="90%">
                                    <div style="display: table; width:
                                        100%; font-size: 11px;">
                                        <div style="display: table-cell;
                                            width: 65%;">
                                            <h5 style="margin: 0px;
                                                font-size: 11px;
                                                font-weight:
                                                600; text-transform:
                                                uppercase;">NOTE</h5>
                                            <ul style="margin: 0;
                                                padding: 0px;
                                                list-style: none;">
                                                <span style="margin: 0;
                                                    text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400; ">*
                                                    Goods once sold will
                                                    be taken back with
                                                    condition</span>

                                                <li style="margin: 0;
                                                    text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400;
                                                    list-style-type:
                                                    disc; margin-left:
                                                    35px;">Returning
                                                    minimum product
                                                    value of Rs 5000/-
                                                    above</li>
                                                <li style="margin: 0;
                                                    text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400;
                                                    list-style-type:
                                                    disc; margin-left:
                                                    35px;">Returning
                                                    product taken back
                                                    Less than 20-30% of
                                                    my billing amount</li>
                                                <li style="margin: 0;
                                                    text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400;
                                                    list-style-type:
                                                    disc; margin-left:
                                                    35px;">If any Damage
                                                    charge as per making
                                                    cost only</li>
                                                <li style="margin: 0;
                                                    text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400;
                                                    list-style-type:
                                                    disc; margin-left:
                                                    35px;">No Charges
                                                    taken on Sale
                                                    product returning
                                                    within 7 days from
                                                    bill date</li>
                                                <li style="margin: 0;
                                                    text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400;
                                                    list-style-type:
                                                    disc; margin-left:
                                                    35px;">All disputes
                                                    are subject to Patna
                                                    Juridiction only</li>
                                                <li style="margin: 0;
                                                    text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400;
                                                    list-style-type:
                                                    disc; margin-left:
                                                    35px;">Charges may
                                                    be appling cancel of
                                                    order product making
                                                    only</li>

                                            </ul>
                                        </div>
                                        <div style="display: table-cell;
                                            width: 35%;">
                                            <div style="display: flex;
                                                justify-content:space-between;">
                                                <!---<div>
                                                    <h4 style="margin:
                                                        0px;
                                                        text-align:
                                                        center;
                                                        font-size:
                                                        12px;">Customer
                                                        Signature</h4>
                                                    <input type="text"
                                                        style="display:
                                                        block;
                                                        margin: auto;
                                                        height:
                                                        36px; min-width:
                                                        142px; ">

                                                </div> -->
                                                <!-- <div style="display:flex ; align-items: center;">
                                                    <h4 style="margin-right:
                                                        5px;
                                                        text-align:
                                                        center;
                                                        font-size:
                                                        8px;">Returning%
                                                    </h4>
                                                    <div
                                                        style="position:
                                                        relative;">
                                                        <input
                                                            type="text"
                                                            style="display:
                                                            block;
                                                            margin:
                                                            auto;
                                                            height:
                                                            16px;
                                                            min-width:
                                                            24px; width:64px; ">
                                                        <div
                                                            style="position:
                                                            absolute;
                                                            right:
                                                            12px; top:
                                                            4px;
                                                            font-size:
                                                            10px;">%</div>
                                                    </div>
                                                </div> -->
                                            </div> 
                                            <div style="margin-top:5px">
                                                <p style="font-size:
                                                    11px; margin: 0;
                                                    line-height: 1.2; ">
                                                    Company Name - ${saleData.user_details.company_name}</p>
                                                <p style="font-size:
                                                    11px; margin: 0;
                                                    line-height: 1.2; ">
                                                      Ac. No - ${saleData.user_details.bank_account_no}</p>
                                                <p style="font-size:
                                                    11px; margin: 0;
                                                    line-height: 1.2; ">
                                                    IFSC Code -
                                                    ${saleData.user_details.bank_ifsc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </table>
                              </td>
                        </tr>
                    </tbody>
                </table>
            </div>
          `;

  let html = `
      <!DOCTYPE html>
      <html lang="en">
          <head>
              <meta charset="UTF-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Bill</title>
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin  />
              <style>
              html {
                -webkit-print-color-adjust: exact;
              }
              </style>
          </head>
          <body style="box-sizing: border-box; padding: 0px; margin: 0px; font-family:
              'Poppins', sans-serif;">
              <div class="invoice" style="max-width: 1000px; margin: auto; padding:
                  15px;
                  background-color: #f9f9f9;">
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tbody>
                        <tr>
                            <td>
                              <table cellspacing="0" cellpadding="0" border="0"
                                  align="center" width="100%">
                                  <h1 style="font-size: 14px; text-align:
                                      center; margin-bottom: 5px; font-weight:
                                      300;">SALE TAX INVOICE</h1>
                              </table>
                              <table cellspacing="0" cellpadding="0" border="0"
                                  align="center" width="100%">
                                  <div style="display: table; width: 100%;">
                                      <div style="width: 65%; display: table-cell;
                                          vertical-align: bottom;">
                                          <img src="data:image/png;base64,${logo}" style="width:
                                              220px; margin-left: 10px;" />
                                          <h3 style="margin: 0; font-weight: 400;
                                              font-size: 12px;">Corporate Office -
                                              P210 Strand Bank Road Brabzar
                                              Kolkata 700 011</h3>

                                      </div>
                                      <div style="width: 35%; display: table-cell;
                                          vertical-align: middle; text-align:
                                          left;">
                                          <h3 style="margin: 0;">
                                              <span style="font-size: 16px;
                                                  font-weight: 600;">Prakriti
                                                  Patna</span></h3>
                                          <h3 style="margin: 0; font-weight: 400;
                                              font-size: 14px;">GST No -
                                              <span style="font-weight: 600;">10CIUPK2654L1ZY</span></h3>
                                          <h3 style="margin: 0; font-weight: 400;
                                              font-size: 12px;">User Id - <span>${saleData.sale_by_name}</span></h3>
                                          <h3 style="margin: 0; font-weight: 400;
                                              font-size: 12px;">Address - G100
                                              RBI CPC Colony Kankarbagh Patna
                                              Bihar 800 020</h3>
                                          <h3 style="font-weight: 600; font-size:
                                              12px; margin: 0;">
                                              support@Prakriti.com, +91 98744
                                              45878
                                          </h3>
                                      </div>
                                  </div>
                              </table>
                              <table cellspacing="0" cellpadding="5" border="0"
                                  align="center" width="100%">
                                  <tbody>
                                      <tr>
                                          <hr style="border: 1px solid #1E2757" />
                                      </tr>
                                  </tbody>
                              </table>
                              <table cellspacing="0" cellpadding="5" border="0"
                                      align="center" width="100%">
                                  <thead>
                                      
                                  </thead>
                                  <tbody>
                                      <tr>
                                          <td style="padding: 0;">
                                              <div class="comp-part-one">
                                                  <ul style="margin: 0;
                                                      padding: 0; list-style:
                                                      none; display: flex;
                                                      gap: 15px;
                                                      justify-content:
                                                      space-between;">
                                                      <li><span
                                                              style="font-weight:
                                                              400; font-size:
                                                              12px; margin:
                                                              0;">Company -</span>
                                                          <span
                                                              style="font-weight:
                                                              600; font-size:
                                                              12px; margin:
                                                              0;">${saleData.user_details.company_name}</span></li>
                                                      <li><span
                                                              style="font-weight:
                                                              400; font-size:
                                                              12px; margin:
                                                              0;">GST IN</span>
                                                          <span
                                                              style="font-weight:
                                                              600; font-size:
                                                              12px; margin:
                                                              0;">${saleData.user_details.gst}</span></li>
                                                      <li><span
                                                              style="font-weight:
                                                              400; font-size:
                                                              12px; margin:
                                                              0;">Cont -
                                                          </span>
                                                          <span
                                                              style="font-weight:
                                                              600; font-size:
                                                              12px; margin:
                                                              0;">${saleData.user_mobile}</span></li>
                                                      <li><span
                                                              style="font-weight:
                                                              400; font-size:
                                                              12px; margin:
                                                              0;">Invoice Date
                                                              -
                                                          </span> <span
                                                              style="font-weight:
                                                              600; font-size:
                                                              12px; margin:
                                                              0;">${saleData.invoice_date}</span></li>
                                                              
                                                  </ul>
                                              </div>
                                              <div class="comp-part-two">
                                                  <ul style="margin: 0;
                                                      padding: 0; list-style:
                                                      none; display: flex;
                                                      gap: 15px;
                                                      justify-content:
                                                      space-between;">
                                                      <li><span
                                                              style="font-weight:
                                                              400; font-size:
                                                              12px; margin:
                                                              0;">Address -</span>
                                                          <span
                                                              style="font-weight:
                                                              500; font-size:
                                                              12px; margin:
                                                              0;">${saleData.user_details.address}</span></li>
                                                      
                                                      <li><span
                                                              style="font-weight:
                                                              400; font-size:
                                                              12px; margin:
                                                              0;">Invoice No -
                                                          </span> <span
                                                              style="font-weight:
                                                              600; font-size:
                                                              12px; margin:
                                                              0;">${saleData.invoice_number}</span></li>
                                                  </ul>
                                                  <ul style="margin: 0;
                                                      padding: 0;margin-left:52px; list-style:
                                                      none; display: flex;
                                                      gap: 15px;
                                                      ">
                                                    <li><span
                                                              style="font-weight:
                                                              400; font-size:
                                                              12px; margin:
                                                              0;">City -</span>
                                                          <span
                                                              style="font-weight:
                                                              500; font-size:
                                                              12px; margin:
                                                              0;">${saleData.user_details.city}</span></li>
                                                      <li><span
                                                              style="font-weight:
                                                              400; font-size:
                                                              12px; margin:
                                                              0;">Pin -
                                                          </span>
                                                          <span
                                                              style="font-weight:
                                                              500; font-size:
                                                              12px; margin:
                                                              0;">${saleData.user_details.pincode}</span></li>
                                                  </ul>
                                              </div>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>`;
  if (saleData.subCatItems.length == 0) {
    html += `<table cellspacing="0" cellpadding="5"  style="margin-top:10px"
                                border="0"
                                align="center" width="100%">
                                <thead style="background-color: #1E2757;">
                                    <tr style="background-color: #1E2757;">
                                        <th style="text-align: left; color:
                                            #fff; border: 1px solid #1E2757;
                                            font-size: 12px; font-weight:
                                            400;background-color: #1E2757;">#</th>
                                        <th style="text-align: left; color:
                                            #fff; font-size: 12px;
                                            font-weight: 400; width:
                                            250px;">Product Name</th>
                                        <th style="text-align: left; color:
                                            #fff; font-size: 12px;
                                            font-weight: 400; width: 50px;">Size</th>
                                        <th style="text-align: left; color:
                                            #fff; font-size: 12px;
                                            font-weight: 400; width: 150px;">Product Id</th>
                                        <th style="text-align: left; color:
                                            #fff; font-size: 12px;
                                            font-weight: 400;">Mtrl</th>
                                        <th style="text-align: left; color:
                                            #fff; font-size: 12px;
                                            font-weight: 400; width: 70px">Making Etc</th>
                                        <th style="text-align: left; color:
                                            #fff; font-size: 12px;
                                            font-weight: 400;">Tag Price</th>
                                        <th style="text-align: left; color:
                                            #fff; font-size: 12px;
                                            font-weight: 400;">Dist Amt</th>
                                        <th style="text-align: left; color:
                                            #fff; font-size: 12px;
                                            font-weight: 400;">Sub-Tot</th>
                                        <th style="text-align: left; color:
                                            #fff; font-size: 12px;
                                            font-weight: 400;">Tax%</th>
                                        <th style="text-align: left; color:
                                            #fff; font-size: 12px;
                                            font-weight: 400;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>`;
    for (let i = 0; i < saleData.products.length; i++) {
      let bgTrColor = i % 2 == 0 ? "#C1BDBD" : "#C4BEED";
      html += `<tr style="background-color: ${bgTrColor}">
                                        <td style="text-align: left;
                                            font-size: 11px;
                                            font-weight: 400;">
                                            ${i + 1}
                                        </td>
                                        <td style="text-align: left;
                                            font-size: 11px;
                                            font-weight: 400;font-size: 10px;">
                                            ${
                                              saleData.products[i].product_name
                                            } - ${
        saleData.products[i].product_code
      }
                                        </td>
                                        <td style="text-align: left;
                                            font-size: 11px;
                                            font-weight: 400;">
                                            ${saleData.products[i].size_name}
                                        </td>
                                        <td colspan="8" style="text-align:
                                            left; font-size: 11px;
                                            font-weight: 400;">
                                            ${
                                              saleData.products[i]
                                                .certificate_no
                                            }
                                        </td>

                                    </tr>
                                    <tr style="background-color: #fff;
                                        vertical-align: top;">
                                        <td colspan="3"
                                            style="border-bottom: 1px solid
                                            #1E2757; width: 300px; text-align: left;">
                                            <div style="max-width: 300px; text-align: left;">`;
      for (let x = 0; x < saleData.products[i].materials.length; x++) {
        saleData.products[i].materials[x].amount == "₹0.00"
          ? null
          : (html += `<div style="display: flex;
                                                    flex-wrap: wrap;
                                                    justify-content: center;
                                                    margin: 0 -5px; text-align: left;">
                                                    <div style="flex-basis:
                                                        calc(69% - 10px);
                                                        margin: 0 5px
                                                        0px; line-height:
                                                        1;text-align: left;">
                                                        <span
                                                            style="text-align:
                                                            left;font-size:
                                                            10px;
                                                            font-weight:
                                                            400;text-align: left;">${saleData.products[i].materials[x].material_name} ${saleData.products[i].materials[x].weight} ${saleData.products[i].materials[x].unit_name}x${saleData.products[i].materials[x].rate}
                                                        </span>

                                                    </div>

                                                    <div
                                                        style="flex-basis:
                                                        calc(31% -
                                                        10px);
                                                        margin: 0 5px
                                                        0px; line-height:
                                                        1;">
                                                        <span
                                                            style="text-align:
                                                            left; font-size:
                                                            10px;
                                                            font-weight:
                                                            400;"> = ${saleData.products[i].materials[x].amount}</span>
                                                    </div>

                                                </div>`);
      }

      html += `</div>


                                            </td>
                                            <td style="border-bottom:
                                                1px solid #1E2757;">`;
      for (let x = 0; x < saleData.products[i].materials.length; x++) {
        html += `<div>`;
        if (isEmpty(saleData.products[i].materials[x].discount_amount)) {
          saleData.products[i].materials[x].amount == "₹0.00"
            ? null
            : (html += `-`);
        } else {
          html += `<span
                                                        style="text-align:
                                                        left; font-size:
                                                        10px;
                                                        font-weight:
                                                        400;">@${removeBlankZero(
                                                          saleData.products[i]
                                                            .materials[x]
                                                            .discount_percent
                                                        )}% ${
            saleData.products[i].materials[x].discount_amount_display
          }</span> 
                                    <!--<span
                                                        style="text-align:
                                                        left; font-size:
                                                        10px;
                                                        font-weight:
                                                        400;">${
                                                          saleData.products[i]
                                                            .materials[x]
                                                            .discount_amount_display
                                                        }</span>-->`;
        }
        html += `</div>`;
      }
      html += `</td>
                                            <td style="text-align: left;
                                                font-size: 10px;
                                                font-weight: 400;
                                                border-bottom: 1px solid
                                                #1E2757;">`;
      for (let x = 0; x < saleData.products[i].materials.length; x++) {
        saleData.products[i].materials[x].amount == "₹0.00"
          ? null
          : (html += `<div>${saleData.products[i].materials[x].material_cost}</div>`);
      }
      html += `</td>
                                            <td style="text-align: left;
                                                font-size: 10px;
                                                font-weight: 400;
                                                border-bottom: 1px solid
                                                #1E2757;">
                                                ${saleData.products[i].making_charge}@${saleData.products[i].making_charge_discount}% = ${saleData.products[i].total_making_charge_discount}
                                            </td>

                                            <td style="text-align:
                                                left;font-size: 10px;
                                                font-weight: 600;
                                                border-bottom: 1px solid
                                                #1E2757;">
                                                ${saleData.products[i].sub_price}
                                            </td>
                                            <td style="text-align:
                                                left;font-size: 10px;
                                                font-weight: 600;
                                                border-bottom: 1px solid
                                                #1E2757;">
                                                ${saleData.products[i].total_discount_display}
                                            </td>
                                            <td style="text-align:
                                                left;font-size: 10px;
                                                font-weight: 400;
                                                border-bottom: 1px solid
                                                #1E2757;">
                                                ${saleData.products[i].sub_total}
                                            </td>
                                            <td style="text-align:
                                                left;font-size: 10px;
                                                font-weight: 400;
                                                border-bottom: 1px solid
                                                #1E2757;">
                                                ${saleData.products[i].tax}
                                            </td>
                                            <td style="text-align:
                                                left;font-size: 10px;
                                                font-weight: 600;
                                                border-bottom: 1px solid
                                                #1E2757;">
                                                ${saleData.products[i].total_display}
                                            </td>

                                        </tr>`;
      }
      html += `<tr style="
                                            vertical-align: top;">
                                            <td colspan="6"
                                                style="
                                                border:none;">

                                            </td>
                                            <!-- <td style="">
                                                <div>
                                                    <h4 style="margin:
                                                        0;
                                                        text-align:
                                                        left; font-size:
                                                        12px;
                                                        font-weight:
                                                        600; display:
                                                        ;">
                                                        Total
                                                        Save <div>139000</div></h4>
                                                </div>
                                            </td> -->
                                            
                                            
                                            

                                        </tr>

                                        <!-- <tr style="
                                            vertical-align: top;">
                                            <td colspan="8"
                                                style="
                                                border:none; padding: 0;">
                                            </td>
                                          
                                            
                                            
                                            <td colspan="3" style="margin: 0;
                                                text-align: left;
                                                font-size: 12px;
                                                font-weight: 600; padding: 4px;">
                                                <div>
                                                    <h4 style="margin:
                                                        0;
                                                        text-align:
                                                        right; font-size:
                                                        12px;
                                                        font-weight:
                                                        600;">
                                                        Total <span style=""> <input type="text" value="139000" style="max-width: 80px;"></span></h4>
                                                </div>
                                            </td>

                                        </tr>
                                        <tr style="
                                            vertical-align: top;">
                                            <td colspan="8"
                                                style="
                                                border:none; padding: 0;">

                                            </td> 
                                            <td colspan="3" style="margin: 0;
                                                text-align: left;
                                                font-size: 12px;
                                                font-weight: 600; padding: 4px;">
                                                <div>
                                                    <h4 style="margin:
                                                        0;
                                                        text-align:
                                                        right; font-size:
                                                        12px;
                                                        font-weight:
                                                        600;">
                                                        Total <span style=""> <input type="text" value="139000" style="max-width: 80px;"></span></h4>
                                                </div>
                                            </td>

                                        </tr> -->
                                    </tbody>
                                </table>`;
  } else {
    html += `<table cellspacing="0" cellpadding="5"  style="margin-top:10px"
                                      border="0"
                                      align="center" width="100%">
                              <thead style="background-color: #1E2757;">
                                  <tr style="background-color: #1E2757;">
                                      <th style="text-align: left; color:
                                          #fff; border: 1px solid #1E2757;
                                          font-size: 12px; font-weight:
                                          400;background-color: #1E2757; width: 50px;">SL</th>
                                      <th style="text-align: left; color:
                                          #fff; font-size: 12px;
                                          font-weight: 400; width:
                                          150px;">Product Name</th>
                                      <th style="text-align: left; color:
                                          #fff; font-size: 12px;
                                          font-weight: 400; width: 50px;">QTY</th>
                                      <th style="text-align: left; color:
                                          #fff; font-size: 12px;
                                          font-weight: 400; width: 50px;">HSN</th>
                                      <th style="text-align: left; color:
                                          #fff; font-size: 12px;
                                          font-weight: 400; width: 150px;"">Material</th>
                                      <th style="text-align: left; color:
                                          #fff; font-size: 12px;
                                          font-weight: 400; width: 50px">WT</th>
                                      <th style="text-align: left; color:
                                          #fff; font-size: 12px;
                                          font-weight: 400; width: 50px"">Unit</th>
                                      <th style="text-align: left; color:
                                          #fff; font-size: 12px;
                                          font-weight: 400; width: 50px"">Rate</th>
                                      <th style="text-align: left; color:
                                          #fff; font-size: 12px;
                                          font-weight: 400; width: 50px"">Tax@</th>
                                      <th style="text-align: left; color:
                                          #fff; font-size: 12px;
                                          font-weight: 400; width: 50px"">Taxable Amt.</th>
                                  </tr>
                              </thead>
                              <tbody>`;
    let fine_metals = 0;
    for (let i = 0; i < saleData.subCatItems.length; i++) {
      saleData.subCatItems[i].material
        .map((itm) => {
          if(itm.id == 1){
            fine_metals += parseFloat(itm.weight);
          } 
        });

      let materialNames = saleData.subCatItems[i].material
        .map((itm) => itm.name)
        .join("<br/ >");
      let materialWts = saleData.subCatItems[i].material
        .map((itm) => itm.weight.toFixed(2))
        .join("<br/ >");
      let materialUnits = saleData.subCatItems[i].material
        .map((itm) => itm.unit)
        .join("<br/ >");
      let materialRates = saleData.subCatItems[i].material
        .map((itm) => itm.rate.toFixed(2))
        .join("<br/ >");
      let materialCosts = saleData.subCatItems[i].material
        .map((itm) => itm.material_cost.toFixed(2))
        .join("<br/ >");
      let bgTrColor = i % 2 == 0 ? "#C1BDBD" : "#C4BEED";

      html += `<tr style="background-color: ${bgTrColor};">
                                      <td style="text-align: left;
                                          font-size: 14px;
                                          font-weight: 400;">
                                          ${i + 1}
                                      </td>
                                      <td style="text-align: left;
                                          font-size: 14px;
                                          font-weight: 400;">
                                          ${saleData.subCatItems[i].name}
                                      </td>
                                      <td style="text-align: left;
                                          font-size: 14px;
                                          font-weight: 400;">
                                          ${saleData.subCatItems[i].qty}
                                      </td>
                                      <td style="text-align:
                                          left; font-size: 14px;
                                          font-weight: 400;">
                                          ${
                                            saleData.subCatItems[i].hsn
                                              ? saleData.subCatItems[i].hsn
                                              : ""
                                          }
                                      </td>
                                      <td style="text-align:
                                          left; font-size: 14px;
                                          font-weight: 400;">
                                          ${materialNames}
                                      </td>
                                      <td style="text-align:
                                          left; font-size: 14px;
                                          font-weight: 400;">
                                          ${materialWts}
                                      </td>
                                      <td style="text-align:
                                          left; font-size: 14px;
                                          font-weight: 400;">
                                          ${materialUnits}
                                      </td>
                                      <td style="text-align:
                                          left; font-size: 14px;
                                          font-weight: 400;">
                                          ${materialRates}
                                      </td>
                                      <td style="text-align:
                                          left; font-size: 14px;
                                          font-weight: 400;">
                                          ${saleData.subCatItems[i].tax}
                                      </td>
                                      <td style="text-align:
                                          left; font-size: 14px;
                                          font-weight: 400;">
                                          ${saleData.subCatItems[
                                            i
                                          ].taxableAmount.toFixed(2)}
                                      </td>

                                    </tr>`;
    }
    let receive_metal = 0;
    let metalExists = true;
    payments.map((itm) => {
      if(itm.payment_mode.toLowerCase() == "metal" && itm.weight != null){
        metalExists = true;
        receive_metal += parseFloat(itm.weight);
      }
    });

    compactLog("fine_metals before : ", fine_metals);
    compactLog("fine_metals 24k value : ", ((parseFloat(fine_metals)*parseFloat(purity18K.value))/100));
    /* convert gold to 24k from 18k */
    if(purity18K && purity18K.value != null){
      fine_metals = (parseFloat(fine_metals)*parseFloat(purity18K.value))/100;
    }
    let rest_metal = fine_metals - receive_metal;

    let totalReportCharge = parseInt(saleData.report_qty)*parseFloat(saleData.report_charge);
    let taxOnReportCharge = (totalReportCharge*parseFloat(saleData.report_tax_percentage))/100;
    let afterTaxTotalReportCharge = totalReportCharge + taxOnReportCharge;
    
    html += `<tr style="
                                      vertical-align: top;">
                                      <td colspan="6"
                                          style="
                                          border:none;">

                                      </td>
                                  </tr>`;
                                  if(saleData.report_qty > 0){
                                    html += `<tr style="
                                        vertical-align: top;
                                        background-color: #0A8AB8;
                                        font-size: 12px; 
                                        font-weight:400;
                                        color:#ffffff;
                                        ">
                                        <td colspan="2"></td>
                                        <td colspan="3">Rate</td>
                                        <td colspan="2">Total</td>
                                        <td colspan="1">Tax(%)</td>
                                        <td colspan="1">Tax</td>
                                        <td colspan="2">Total</td>
                                        
                                    </tr>`;
                                    html += `<tr style="
                                        vertical-align: top;
                                        font-size: 14px; 
                                        font-weight:400;
                                        ">
                                        <td colspan="2" style="background-color: #C1BDBD;">Report Charges : </td>
                                        <td colspan="3" style="background-color: #C1BDBD;">${saleData.report_qty} Pics x ${saleData.report_charge.toFixed(2)} = </td>
                                        <td colspan="2" style="background-color: #C1BDBD;">${totalReportCharge.toFixed(2)}</td>
                                        <td colspan="1" style="background-color: #C1BDBD;">${saleData.report_tax_percentage.toFixed(2)}</td>
                                        <td colspan="1" style="background-color: #C1BDBD;">${taxOnReportCharge.toFixed(2)}</td>
                                        <td colspan="2" style="background-color: #C1BDBD;">${afterTaxTotalReportCharge.toFixed(2)}</td>
                                        
                                    </tr>`;
                                  }
                                  html += `<tr style="
                                      vertical-align: top;">
                                      <td colspan="6"
                                          style="
                                          border:none;">

                                      </td>
                                  </tr>`;
                          if(metalExists){
                            html += `<tr style="
                                      vertical-align: top;">
                                      <td colspan="2" style="background-color: #0A8AB8; border-bottom: 1px solid #fff; font-size: 12px; font-weight:400; color:#ffffff;">Fine Metals : </td>
                                      <td colspan="2" style="background-color: #C1BDBD; border-bottom: 1px solid #fff; font-size: 14px; font-weight:400;">${fine_metals.toFixed(2)} GM</td>
                                      <td colspan="8" style="background-color: #C1BDBD; border-bottom: 1px solid #fff; font-size: 14px; font-weight:400;"></td>
                                  </tr>`;
                          }
                          if(metalExists){
                            html += `<tr style="
                                      vertical-align: top;">
                                      <td colspan="2" style="background-color: #0A8AB8; border-bottom: 1px solid #fff; font-size: 12px; font-weight:400; color:#ffffff;">Receive Fine Metal : </td>
                                      <td colspan="2" style="background-color: #C1BDBD; border-bottom: 1px solid #fff; font-size: 14px; font-weight:400;">${receive_metal.toFixed(2)} GM</td>
                                      <td colspan="8" style="background-color: #C1BDBD; border-bottom: 1px solid #fff; font-size: 14px; font-weight:400;"></td>
                                  </tr>`;
                          }
                          if(metalExists){
                            html += `<tr style="
                                      vertical-align: top;">
                                      <td colspan="2" style="background-color: #0A8AB8; border-bottom: 1px solid #fff; font-size: 12px; font-weight:400; color:#ffffff;">Rest : </td>
                                      <td colspan="2" style="background-color: #C1BDBD; border-bottom: 1px solid #fff; font-size: 14px; font-weight:400;">${rest_metal.toFixed(2)} GM</td>
                                      <td colspan="8" style="background-color: #C1BDBD; border-bottom: 1px solid #fff; font-size: 14px; font-weight:400;"></td>
                                  </tr>`;
                          }
                                          
                            html += ` </tbody>
                          </table>`;
  }

  html += `
                        <div class="table-footer-area" style="display: table; width:
                            100%; position:absolute ; bottom: 400px">
                            <hr/>
                          </div>
                          <div

                            class="table-footer-area"
                            style="display: table; width:
                            100%; position:absolute ;bottom:${
                              payments.length == 0
                                ? 180
                                : payments.length == 1
                                ? 180
                                : payments.length == 2
                                ? 180
                                : payments.length == 3
                                ? 180
                                : payments.length == 4
                                ? 180
                                : payments.length == 5
                                ? 180
                                : 180
                            }px">
                            
                            <div style="display:
                                table-cell; width:
                                74%">
                                <div style="
                                    display: block;
                                    justify-content: flex-end;
                                    gap: 10px; 
                                    width: 80%;
                                    position:absolute; 
                                    bottom:${
                                      payments.length == 0
                                        ? 100
                                        : payments.length == 1
                                        ? 130
                                        : payments.length == 2
                                        ? 120
                                        : payments.length == 3
                                        ? 110
                                        : payments.length == 4
                                        ? 95
                                        : payments.length == 5
                                        ? 80
                                        : 180
                                    }px;
                                ">
                                    `;
  if (payments.length) {
    html += `<table cellspacing="0"
                                        cellpadding="3"
                                        rules="rows"
                                        align="left"
                                        width="80%"
                                        style=" margin-right:40px;">
                                        <tr
                                            style="background-color:
                                            #1E2757;
                                            color: #fff;">
                                            <th
                                                style="font-weight:
                                                400; font-size: 12px; text-align: left;">SL</th>
                                            <th
                                                style="font-weight:
                                                400; font-size: 12px; text-align: left;">PayDate</th>
                                            <th
                                                style="font-weight:
                                                400; font-size: 12px; text-align: left;"> Mode</th>
                                            <th
                                                style="font-weight:
                                                400; font-size: 12px; text-align: left;"> Note</th>
                                            <th
                                                style="font-weight:
                                                400; font-size: 12px; text-align: left;">Amount</th>
                                            `;
    for (let i = 0; i < payments.length; i++) {
      html += `<tr
                                            style=" ">
                                            <td
                                                style="border-right:
                                                none; font-size: 12px;">${
                                                  i + 1
                                                }</td>
                                            <td
                                                style="border-right:
                                                none; font-size: 12px;">${
                                                  payments[i].payment_date
                                                }</td>
                                            
                                            <td
                                                style="border-right:
                                                none; font-size: 12px;">${
                                                  payments[i].payment_mode
                                                }</td>
                                            <td
                                                style="border-right:
                                                none; font-size: 12px;">${
                                                  payments[i].notes
                                                }</td>
                                            <td
                                                style="border-right:
                                                none; font-size: 12px;">${
                                                  payments[i].payment_mode.toLowerCase() == "metal" && payments[i].weight != null?payments[i].weight:payments[i].amount
                                                }</td>
                                        </tr>`;
    }
    html += `</table>`;
  }
  html += `</div>
                            </div>
                            <div style="display:
                                table-cell;
                                width:26%;
                                position:absolute ;
                                bottom: 50px
                                "
                                >
                                <div style="display: inline-table;
                                    justify-content: flex-end;
                                    ">
                                    <div>
                                        <h4 style="margin:
                                            0;
                                            text-align:
                                            right;
                                            font-size:
                                            12px;
                                            font-weight:
                                            400; margin-bottom:
                                            5px;margin-right:10px ;">
                                            Total <span
                                                style="">
                                                <input
                                                    type="text"
                                                    value="${saleData.taxable_amount}"
                                                    style="max-width:
                                                    80px;font-Weight:600"></span></h4>
                                    </div>`;
  if (saleData.is_same_state_trnx && saleData.cgst_tax) {
    html += `<div>
                                                          <h4 style="margin:
                                                              0;
                                                              text-align:
                                                              right;
                                                              font-size:
                                                              12px;
                                                              font-weight:
                                                              400; margin-bottom:
                                                              5px;margin-right:10px ;">
                                                              CGST Amt <span
                                                                  style="">
                                                                  <input
                                                                      type="text"
                                                                      value="${saleData.cgst_tax_display}"
                                                                      style="max-width:
                                                                      80px;"></span></h4>
                                                      </div>`;
  }
  if (saleData.is_same_state_trnx && saleData.sgst_tax) {
    html += `<div>
                                                          <h4 style="margin:
                                                              0;
                                                              text-align:
                                                              right;
                                                              font-size:
                                                              12px;
                                                              font-weight:
                                                              400; margin-bottom:
                                                              5px;margin-right:10px ;">
                                                              SGST Amt <span
                                                                  style="">
                                                                  <input
                                                                      type="text"
                                                                      value="${saleData.sgst_tax_display}"
                                                                      style="max-width:
                                                                      80px;"></span></h4>
                                                      </div>`;
  }
  if (!saleData.is_same_state_trnx && saleData.igst_tax) {
    html += `<div>
                                                          <h4 style="margin:
                                                              0;
                                                              text-align:
                                                              right;
                                                              font-size:
                                                              12px;
                                                              font-weight:
                                                              400; margin-bottom:
                                                              5px;margin-right:10px ;">
                                                              IGST Amt <span
                                                                  style="">
                                                                  <input
                                                                      type="text"
                                                                      value="${saleData.igst_tax_display}"
                                                                      style="max-width:
                                                                      80px;"></span></h4>
                                                      </div>`;
  }
  html += `<div>
                                        
                                    </div>
                                    <div>
                                        <h4 style="margin:
                                            0;
                                            text-align:
                                            right;
                                            font-size:
                                            12px;
                                            font-weight:
                                            400; margin-bottom:
                                            5px;margin-right:10px ;">
                                            Sub Total <span
                                                style=""
                                                
                                                >
                                                <input
                                                    type="text"
                                                    value="${saleData.total_amount}"
                                                    style="max-width:
                                                    80px;"></span></h4>
                                    </div>
                                    <div>
                                        <h4 style="margin:
                                            0;
                                            text-align:
                                            right;
                                            font-size:
                                            12px;
                                            font-weight:
                                            400; margin-bottom:
                                            5px;margin-right:10px ;">
                                            Cash Dist <span
                                                style="">
                                                <input
                                                    type="text"
                                                    value="${saleData.discount}"
                                                    style="max-width:
                                                    80px;"></span></h4>
                                    </div>
                                    <div>
                                        <h4 style="margin:
                                            0;
                                            text-align:
                                            right;
                                            font-size:
                                            12px;
                                            font-weight:
                                            600; margin-bottom:
                                            5px;margin-right:10px ;">
                                            Total Payable <span
                                                style="">
                                                <input
                                                    type="text"
                                                    value="${saleData.bill_amount}"
                                                    style="max-width:
                                                    80px;font-Weight:600"></span></h4>
                                    </div>
                                </div>
                            </div>
                            <div
                              class="table-footer-area"
                              style="display: table; width:
                              100%; position:absolute; bottom:-30px; left: 0px;">
                              <div style="display:
                                  table-cell; width:
                                  74%">
                                  <div style="display: inline-flex;
                                      justify-content: flex-end;
                                      gap: 10px;">
                                      <div>
                                          <h4 style="margin:
                                              0;
                                              text-align:
                                              left;
                                              font-size:
                                              12px;
                                              font-weight:
                                              400; margin-bottom:
                                              5px;">
                                              Due Date : 
                                              <span
                                                  style="">
                                                  <input
                                                      type="text"
                                                      value="${saleData.due_date}"
                                                      style="max-width:
                                                      80px;"></span>
                                              </h4>
                                      </div>
                                      <div>
                                          <h4 style="margin:
                                              0;
                                              text-align:
                                              left;
                                              font-size:
                                              12px;
                                              font-weight:
                                              400; margin-bottom:
                                              5px;">
                                              Settlement Date : 
                                              <span
                                                  style="">
                                                  <input
                                                      type="text"
                                                      value="${saleData.settlement_date}"
                                                      style="max-width:
                                                      80px;"></span>
                                              </h4>
                                      </div>
                                  </div>
                              </div>
                              <div style="display:
                                  table-cell; width:
                                  26%">
                                  <div style="display: inline-table;
                                      justify-content: flex-end;
                                      ">
                                      <div>
                                          <h4 style="margin:
                                              0;
                                              text-align:
                                              right;
                                              font-size:
                                              12px;
                                              font-weight:
                                              400; margin-bottom:
                                              5px;margin-right:10px ;">
                                              Paid Amount <span
                                                  style="">
                                                  <input
                                                      type="text"
                                                      value="${saleData.paid_amount}"
                                                      style="max-width:
                                                      80px;"></span></h4>
                                      </div>`;
  if (saleData.return_amount) {
    html += `<div>
                                          <h4 style="margin:
                                              0;
                                              text-align:
                                              right;
                                              font-size:
                                              12px;
                                              font-weight:
                                              400; margin-bottom:
                                              5px;margin-right:10px ;">
                                              Return Amount <span
                                                  style="">
                                                  <input
                                                      type="text"
                                                      value="${
                                                        saleData.return_amount
                                                          ? saleData.return_amount
                                                          : "0.00"
                                                      }"
                                                      style="max-width:
                                                      80px;"></span></h4>
                                      </div>`;
  }

  html += `<div>
                                          <h4 style="margin:
                                              0;
                                              text-align:
                                              right;
                                              font-size:
                                              12px;
                                              font-weight:
                                              400; margin-bottom:
                                              5px;margin-right:10px ;">
                                              Rest Due Amt <span
                                                  style="">
                                                  <input
                                                      type="text"
                                                      value="${saleData.due_amount_display}"
                                                      style="max-width:
                                                      80px;"></span></h4>
                                      </div>
                                  </div>
                                </div>
                              </div>
                          </div>
                          ${footerhtml}
                        </td>
                    </tr>
                </tbody>
              </table>
          </div>
      </body>
  </html>
  `;

  try {
    let file_path = "public/invoices/" + saleData.invoice_number + "_info.pdf";
    const options = { format: "A4" };

    (async () => {
      const file = { content: html };

      // Generate PDF
      const pdfBuffer = await html_to_pdf.generatePdf(file, options);

      // Save PDF to file
      fs.writeFileSync(file_path, pdfBuffer);
      compactLog("PDF generated successfully!");

      res.send(
        formatResponse(
          {
            file_name: saleData.invoice_number + "_info.pdf",
            url: getFileAbsulatePathPDF(file_path),
            html,
            sale,
            saleData,
            payments,
          },
          "Invoice pdf"
        )
      );
    })();
  } catch (error) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse(error.toString()));
  }
};

exports.downloadInvoiceItems = async (req, res) => {
  let userID = isManager(req) ? req.userId : await getWorkingUserID(req);
  let sale = await SaleModel.findOne({
    where: { id: req.params.id, sale_by: userID },
    include: [
      {
        model: SaleProductModel,
        as: "saleProducts",
        separate: true,
        include: [
          {
            model: ProductModel,
            as: "product",
            include: [
              {
                model: CategoryModel,
                as: "category",
              },
              {
                model: SubCategoryModel,
                as: "sub_category",
              },
              {
                model: taxSlabModel,
                as: "tax",
              }
            ],
          },
          {
            model: SizeModel,
            as: "size",
          },
          {
            model: SaleProductMaterialModel,
            as: "saleMaterials",
            separate: true,
            include: [
              {
                model: MaterialModel,
                as: "material",
              },
              {
                model: PurityModel,
                as: "purity",
              },
              {
                model: UnitModel,
                as: "unit",
              },
            ],
          },
        ],
      },
      {
        model: UserModel,
        as: "user",
      },
      {
        model: UserModel,
        as: "saleBy",
      },
    ],
  });
  if (!sale) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("Sale not found"));
  }
  let saleData = SaleCollection(sale);

  let payments = await PaymentModel.findAll({
    where: {
      table_type: "sale",
      table_id: req.params.id,
    },
    include: [
      {
        model: UserModel,
        as: "user",
      },
    ],
  });
  payments = await PaymentCollection(payments);
  const cwd = process.cwd();
  // const logoUrl = `file://${cwd}/public/images/logo.png`;
  const logoUrl = `public/images/logo.png`;
  // const logoUrl = process.env.BASE_URL + "public/images/logo.png";

  const bitmap = fs.readFileSync(logoUrl);
  const logo = bitmap.toString("base64");

  let footerhtml = `
              <div class="invoice" style="width: 96%; margin: 0px; background-color: #f9f9f9;">
                  <hr/>
                  <table cellpadding="0" cellspacing="1"  style="margin:auto; width:100%" >
                      <tbody>
                          <tr>
                              <td><table cellspacing="0" cellpadding="0"
                                    border="0"
                                    align="center" width="90%">
                                    <div style="display: table; width:
                                        100%; font-size: 11px;">
                                        <div style="display: table-cell;
                                            width: 65%;">
                                            <h5 style="margin: 0px;
                                                font-size: 11px;
                                                font-weight:
                                                600; text-transform:
                                                uppercase;">NOTE</h5>
                                            <ul style="margin: 0;
                                                padding: 0px;
                                                list-style: none;">
                                                <span style="margin: 0;
                                                    text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400; ">*
                                                    Goods once sold will
                                                    be taken back with
                                                    condition</span>

                                                <li style="margin: 0;
                                                    text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400;
                                                    list-style-type:
                                                    disc; margin-left:
                                                    35px;">Returning
                                                    minimum product
                                                    value of Rs 5000/-
                                                    above</li>
                                                <li style="margin: 0;
                                                    text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400;
                                                    list-style-type:
                                                    disc; margin-left:
                                                    35px;">Returning
                                                    product taken back
                                                    Less than 20-30% of
                                                    my billing amount</li>
                                                <li style="margin: 0;
                                                    text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400;
                                                    list-style-type:
                                                    disc; margin-left:
                                                    35px;">If any Damage
                                                    charge as per making
                                                    cost only</li>
                                                <li style="margin: 0;
                                                    text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400;
                                                    list-style-type:
                                                    disc; margin-left:
                                                    35px;">No Charges
                                                    taken on Sale
                                                    product returning
                                                    within 7 days from
                                                    bill date</li>
                                                <li style="margin: 0;
                                                    text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400;
                                                    list-style-type:
                                                    disc; margin-left:
                                                    35px;">All disputes
                                                    are subject to Patna
                                                    Juridiction only</li>
                                                <li style="margin: 0;
                                                    text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400;
                                                    list-style-type:
                                                    disc; margin-left:
                                                    35px;">Charges may
                                                    be appling cancel of
                                                    order product making
                                                    only</li>

                                            </ul>
                                        </div>
                                        <div style="display: table-cell;
                                            width: 35%;">
                                            <div style="display: flex;
                                                gap: 10px;
                                                justify-content:
                                                space-between;">
                                                <div>
                                                    <h4 style="margin:
                                                        0px;
                                                        text-align:
                                                        center;
                                                        font-size:
                                                        11px;">Customer
                                                        Signature</h4>
                                                    <input type="text"
                                                        style="display:
                                                        block;
                                                        margin: auto;
                                                        height:
                                                        36px; min-width:
                                                        142px; ">

                                                </div>
                                                <div >
                                                    <h4 style="
                                                    margin: 0px 5px 0px 0px;
                                                        text-align:
                                                        center;
                                                        font-size:
                                                        11px;">Returning%
                                                    </h4>
                                                    <div
                                                        style="position:
                                                        relative;">
                                                        <input
                                                          type="text"
                                                          style="display:
                                                          block;
                                                          margin: auto;
                                                          height:
                                                          36px; min-width:
                                                          142px; ">
                                                        <div
                                                            style="position:
                                                            absolute;
                                                            right:
                                                            12px; top:
                                                            10px;
                                                            font-size:
                                                            11px;">%</div>
                                                    </div>
                                                </div>

                                            </div> 
                                            <div style="margin-top:5px">
                                                <p style="
                                                  font-size: 11px; 
                                                  margin: 0;
                                                    line-height: 1.2; ">
                                                    Company Name - ${saleData.user_details.company_name}</p>
                                                <p style="font-size:
                                                    11px; margin: 0;
                                                    line-height: 1.2; ">
                                                      Ac. No - ${saleData.user_details.bank_account_no}</p>
                                                <p style="font-size:
                                                    11px; margin: 0;
                                                    line-height: 1.2; ">
                                                    IFSC Code -
                                                    ${saleData.user_details.bank_ifsc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </table></td>
                        </tr>
                    </tbody>
                </table>
            </div>
          `;

  let totalSave = 0.00;
  let totalTagPrice = 0.00;
  for (let i = 0; i < saleData.products.length; i++) {
    totalSave += saleData.products[i].total_discount;
    totalTagPrice += saleData.products[i].subtotal_price;
  }

  let totalSaveDisplay = displayAmount(totalSave);
  let totalTagPriceDisplay = displayAmount(totalTagPrice);
  

  let html = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bill</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <style>
            html {
              -webkit-print-color-adjust: exact;
            }
            </style>
        </head>
        <body style="box-sizing: border-box; padding: 0px; margin: 0px; font-family:
            'Poppins', sans-serif;">
            <div class="invoice" style="width: 96%; margin: 15px;  background-color: #f9f9f9;">
                <table cellpadding="0" cellspacing="0" width="100%">
                    <tbody>
                        <tr>
                            <td>
                                <table cellspacing="0" cellpadding="0" border="0"
                                    align="center" width="100%">
                                    <h1 style="font-size: 14px; text-align:
                                        center; margin-bottom: 5px; font-weight:
                                        300;">SALE LIST INVOICE</h1>
                                </table>
                                <table cellspacing="0" cellpadding="0" border="0"
                                    align="center" width="100%">
                                    <div style="display: table; width: 100%;">
                                        <div style="width: 65%; display: table-cell;
                                            vertical-align: bottom;">
                                            <img src="data:image/png;base64,${logo}" style="width:
                                                220px; margin-left: 10px;">
                                            <h3 style="margin: 0; font-weight: 400;
                                                font-size: 12px;">Corporate Office -
                                                P210 Strand Bank Road Brabzar
                                                Kolkata 700 011</h3>
    
                                        </div>
                                        <div style="width: 35%; display: table-cell;
                                            vertical-align: middle; text-align:
                                            left;">
                                            <h3 style="margin: 0;">
                                                <span style="font-size: 16px;
                                                    font-weight: 600;">Prakriti
                                                    Patna</span></h3>
                                            <h3 style="margin: 0; font-weight: 400;
                                                font-size: 14px;">GST No -
                                                <span style="font-weight: 600;">10CIUPK2654L1ZY</span></h3>
                                            <h3 style="margin: 0; font-weight: 400;
                                                font-size: 12px;">User Id - <span>${saleData.sale_by_name}</span></h3>
                                            <h3 style="margin: 0; font-weight: 400;
                                                font-size: 12px;">Address - G100
                                                RBI CPC Colony Kankarbagh Patna
                                                Bihar 800 020</h3>
                                            <h3 style="font-weight: 600; font-size:
                                                12px; margin: 0;">
                                                support@Prakriti.com, +91 98744
                                                45878
                                            </h3>
                                        </div>
                                    </div>
                                </table>
                                <table cellspacing="0" cellpadding="0" border="0"
                                    align="center" width="100%">
                                    <tbody>
                                        <tr>
                                            <hr style="border: 1px solid #1E2757; width:97%">
                                        </tr>
                                    </tbody>
                                </table>
  
                                <table cellspacing="0" cellpadding="5" border="0"
                                    align="center" width="100%">
                                    <thead>
                                        <!-- <tr style="background-color: #000;">
                                            <th style="text-align: left; color:
                                                #fff;">Company: Ratn Alankar
                                                Jewellers</th>
                                            <th style="text-align: left; color:
                                                #fff;">Name: Mukund Singhaindi</th>
                                            <th style="text-align: left; color:
                                                #fff;">Cont: 91919191919</th>
                                            <th style="text-align: left; color:
                                                #fff;">City: Muzaffarpur</th>
                                        </tr>-->
                                    </thead> 
                                        <tbody>
                                            <!-- <tr style="background-color: #fff;">
                                            <td style="">
                                                <span style="font-weight: 600;"> GST
                                                    IN ${saleData.user_details.gst} </span>
                                            </td>
                                            <td style="">
                                                Ad:
                                            </td>
                                            <td style="">
    
                                            </td>
                                            <td style="">
                                                Pin Code: 800 020
                                            </td>
                                        </tr> -->
                                            <tr>
                                                <td style="padding: 0;">
                                                    <div class="comp-part-one">
                                                        <ul style="margin: 0;
                                                            padding: 0; list-style:
                                                            none; display: flex;
                                                            gap: 15px;
                                                            justify-content:
                                                            space-between;">
                                                            <li><span
                                                                    style="font-weight:
                                                                    400; font-size:
                                                                    12px; margin:
                                                                    0;">Company -</span>
                                                                <span
                                                                    style="font-weight:
                                                                    600; font-size:
                                                                    12px; margin:
                                                                    0;">${saleData.user_details.company_name}</span></li>
                                                            <li><span
                                                                    style="font-weight:
                                                                    400; font-size:
                                                                    12px; margin:
                                                                    0;">GST IN</span>
                                                                <span
                                                                    style="font-weight:
                                                                    600; font-size:
                                                                    12px; margin:
                                                                    0;">${saleData.user_details.gst}</span></li>
                                                            <li><span
                                                                    style="font-weight:
                                                                    400; font-size:
                                                                    12px; margin:
                                                                    0;">Cont -
                                                                </span>
                                                                <span
                                                                    style="font-weight:
                                                                    600; font-size:
                                                                    12px; margin:
                                                                    0;">${saleData.user_mobile}</span></li>
                                                            <li><span
                                                                    style="font-weight:
                                                                    400; font-size:
                                                                    12px; margin:
                                                                    0;">Invoice Date
                                                                    -
                                                                </span> <span
                                                                    style="font-weight:
                                                                    600; font-size:
                                                                    12px; margin:
                                                                    0;">${saleData.invoice_date}</span></li>
                                                                    
                                                        </ul>
                                                    </div>
                                                    <div class="comp-part-two">
                                                        <ul style="margin: 0;
                                                            padding: 0; list-style:
                                                            none; display: flex;
                                                            gap: 15px;
                                                            justify-content:
                                                            space-between;">
                                                            <li><span
                                                                    style="font-weight:
                                                                    400; font-size:
                                                                    12px; margin:
                                                                    0;">Address -</span>
                                                                <span
                                                                    style="font-weight:
                                                                    500; font-size:
                                                                    12px; margin:
                                                                    0;">${saleData.user_details.address}</span></li>
                                                            <li><span
                                                                    style="font-weight:
                                                                    400; font-size:
                                                                    12px; margin:
                                                                    0;">City -</span>
                                                                <span
                                                                    style="font-weight:
                                                                    500; font-size:
                                                                    12px; margin:
                                                                    0;">${saleData.user_details.city}</span></li>
                                                            <li><span
                                                                    style="font-weight:
                                                                    400; font-size:
                                                                    12px; margin:
                                                                    0;">Pin -
                                                                </span>
                                                                <span
                                                                    style="font-weight:
                                                                    500; font-size:
                                                                    12px; margin:
                                                                    0;">${saleData.user_details.pincode}</span></li>
                                                            <li><span
                                                                    style="font-weight:
                                                                    400; font-size:
                                                                    12px; margin:
                                                                    0;">Invoice No -
                                                                </span> <span
                                                                    style="font-weight:
                                                                    600; font-size:
                                                                    12px; margin:
                                                                    0;">${saleData.invoice_number}</span></li>
                                                        </ul>
                                                        <!--ul style="margin: 0;
                                                            padding: 0;margin-left:52px; list-style:
                                                            none; display: flex;
                                                            gap: 15px;
                                                           ">
                                                         <li><span
                                                                    style="font-weight:
                                                                    400; font-size:
                                                                    12px; margin:
                                                                    0;">City -</span>
                                                                <span
                                                                    style="font-weight:
                                                                    500; font-size:
                                                                    12px; margin:
                                                                    0;">${saleData.user_details.city}</span></li>
                                                            <li><span
                                                                    style="font-weight:
                                                                    400; font-size:
                                                                    12px; margin:
                                                                    0;">Pin -
                                                                </span>
                                                                <span
                                                                    style="font-weight:
                                                                    500; font-size:
                                                                    12px; margin:
                                                                    0;">${saleData.user_details.pincode}</span></li>
                                                                    </ul-->
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                
                                    <table cellspacing="0" cellpadding="5"  style="margin-top:10px"
                                        border="0"
                                        align="center" width="100%">
                                        <thead style="">
                                            <tr style="background-color: #000000;">
                                                <th style="text-align: left; color:
                                                    #fff; border: 1px solid #000000;
                                                    font-size: 12px; font-weight:
                                                    400; width: 25px;">#</th>
                                                <th style="text-align: left; color:
                                                    #fff; font-size: 12px;
                                                    font-weight: 100; width:
                                                    125px;">Product Name</th>
                                                <th style="text-align: left; color:
                                                    #fff; font-size: 12px;
                                                    font-weight: 400; width: 50px;">Size</th>
                                                <th style="text-align: left; color:
                                                    #fff; font-size: 12px;
                                                    font-weight: 400; width: 90px;">Product Id</th>
                                                <th style="text-align: left; color:
                                                    #fff; font-size: 12px;
                                                    font-weight: 400;width: 40px;">Mtrl</th>
                                                <th style="text-align: left; color:
                                                  #fff; font-size: 12px;
                                                  font-weight: 400; width: 130px">Making Etc</th>
                                                <th style="text-align: left; color:
                                                    #fff; font-size: 12px;
                                                    font-weight: 400;width: 90px;">Tag Price</th>
                                                <th style="text-align: left; color:
                                                    #fff; font-size: 12px;
                                                    font-weight: 400;width: 90px;">Dist Amt</th>
                                                <th style="text-align: left; color:
                                                    #fff; font-size: 12px;
                                                    font-weight: 400;width: 90px;">Sub-Tot</th>
                                                <th style="text-align: left; color:
                                                    #fff; font-size: 12px;
                                                    font-weight: 400;width: 40px;">Tax%</th>
                                                <th style="text-align: left; color:
                                                    #fff; font-size: 12px;
                                                    font-weight: 400;width: 50px;">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;
                                        for (let i = 0; i < saleData.products.length; i++) {
                                          let bgTrColor = i%2==0?"#1E2757":"#1E2757";
                                          html += `<tr style="background-color: ${bgTrColor}; color:#FFFFFF;">
                                                <td style="text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400; width: 25px;">
                                                    ${i<10?'0'+(i + 1):(i+1)}
                                                </td>
                                                <td style="text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400;font-size: 10px; width:125px;">
                                                    ${
                                                      saleData.products[i]
                                                        .product_name
                                                    } - ${
                                                      saleData.products[i].product_code?saleData.products[i].product_code:""}
                                                </td>
                                                <td style="text-align: left;
                                                    font-size: 11px;
                                                    font-weight: 400; width: 60px; ">
                                                    ${
                                                      saleData.products[i]
                                                        .size_name
                                                    }
                                                </td>
                                                <td style="text-align:
                                                      left; font-size: 11px;
                                                      font-weight: 400; width: 90px;">
                                                      ${
                                                        saleData.products[i]
                                                          .certificate_no
                                                      }
                                                </td>
                                                <td colspan="7" style="text-align:
                                                      left; font-size: 11px;
                                                      font-weight: 400;">Gross Weight-
                                                      ${
                                                        saleData.products[i]
                                                          .total_weight
                                                      }
                                                </td>
    
                                            </tr>
                                            <tr style="vertical-align: top; background-color: #FFFFFF;">
                                                <td colspan="2" style="border-bottom: 1px solid #1E2757; padding:0;">
                                                    
                                            `;
                                            for (let x = 0; x < saleData.products[i].materials.length; x++) {
                                              saleData.products[i].materials[x].amount == "₹0.00"
                                              ? null
                                              : (
                                                html += `<div style="display: flex;
                                                    margin: 5px 5px 0px 5px; text-align: left; width:150px;">
                                                    <div style="
                                                        line-height:1; text-align: left;">
                                                        <span
                                                            style="
                                                            font-size:10px;
                                                            font-weight:400;">${saleData.products[i].materials[x].material_name} ${saleData.products[i].materials[x].pakka_weight?removeCurrencyAndDecimalFromPrice(saleData.products[i].materials[x].pakka_weight):removeCurrencyAndDecimalFromPrice(saleData.products[i].materials[x].weight)} ${saleData.products[i].materials[x].unit_name} x ${removeCurrencyAndDecimalFromPrice(saleData.products[i].materials[x].rate)}
                                                        </span>
                                                        <!-- span
                                                            style="
                                                            font-size:10px;
                                                            font-weight:400;"> = ${saleData.products[i].materials[x].amount}</span -->
                                                    </div>
  
                                                    <!--div
                                                        style="flex-basis:
                                                        calc(31% -
                                                        10px);
                                                        margin: 0 5px
                                                        0px; line-height:
                                                        1;">
                                                        <span
                                                            style="text-align:
                                                            left; font-size:
                                                            10px;
                                                            font-weight:
                                                            400;"> = ${saleData.products[i].materials[x].amount}</span>
                                                    </div-->
  
                                                </div>`
                                              );
                                            }
                                            html += `
                                                </td>
                                                <td style="border-bottom:1px solid #1E2757;">`;
                                                for (let x = 0; x < saleData.products[i].materials.length; x++) {
                                                  saleData.products[i].materials[x].amount == "₹0.00"
                                                  ? null
                                                  : (
                                                    html += `<div style="display: flex;
                                                        width:50px;
                                                        margin: 0px 5px 0px 0px; text-align: left;">
                                                        <div style="
                                                            line-height:1; text-align: left;">
                                                            <span
                                                                style="
                                                                font-size:10px;
                                                                font-weight:400;"> = ${removeCurrencyAndDecimalFromPrice(saleData.products[i].materials[x].amount)}</span>
                                                        </div>
                                                    </div>`
                                                  );
                                                }
                                            html += `
                                                </td>
                                                <td style="border-bottom:1px solid #1E2757;">`;
                                            for (let x = 0; x < saleData.products[i].materials.length; x++) {
                                              html += `<div style="width:90px;">`;
                                              if (isEmpty(saleData.products[i].materials[x].discount_amount)) {
                                                saleData.products[i].materials[x].amount == "₹0.00"
                                                  ? null
                                                  : (html += `-`);
                                              } else {
                                                html += `<span style="text-align:left; font-size:10px;font-weight:400;">
                                                    Disc@${removeBlankZero(removeCurrencyAndDecimalFromPrice(saleData.products[i].materials[x].discount_percent))}% ${removeCurrencyAndDecimalFromPrice(saleData.products[i].materials[x].discount_amount_display)}
                                                  </span> 
                                                  <!--<span style="text-align:left; font-size:10px; font-weight:400;">${saleData.products[i].materials[x].discount_amount_display}</span>-->`;
                                              }
                                              html += `</div>`;
                                            }
                                            html += `
                                                </td>
                                                <td style="border-bottom: 1px solid #1E2757;">`;
                                            for (let x = 0; x < saleData.products[i].materials.length; x++) {
                                              saleData.products[i].materials[x].amount == "₹0.00"
                                                ? null
                                                : (html += `<div style="text-align: left; font-size: 10px; font-weight: 400;
                                                        margin-top: 5px; 
                                                        width: 40px
                                                        line-height:1;">${removeCurrencyAndDecimalFromPrice(saleData.products[i].materials[x].material_cost)}</div>`);
                                            }
                                            html += `
                                                </td>
                                                <td style="text-align: left;
                                                    padding-top: 10px;
                                                    font-size: 10px;
                                                    font-weight: 400;
                                                    width: 130px;
                                                    border-bottom: 1px solid
                                                    #1E2757;">
                                                    ${removeCurrencyAndDecimalFromPrice(saleData.products[i].making_charge)}@${removeBlankZero(removeCurrencyAndDecimalFromPrice(saleData.products[i].making_charge_discount))}%=${removeBlankZero(removeCurrencyAndDecimalFromPrice(saleData.products[i].total_making_charge_discount))}
                                                </td>
  
                                                <td style="text-align:left;
                                                    padding-top: 10px;
                                                    font-size: 10px;
                                                    font-weight: 600;
                                                    width: 70px;
                                                    border-bottom: 1px solid
                                                    #1E2757;">
                                                    ${removeCurrencyAndDecimalFromPrice(saleData.products[i].sub_price)}
                                                </td>
                                                <td style="text-align:left;
                                                    padding-top: 10px;
                                                    font-size: 10px;
                                                    font-weight: 600;
                                                    width: 70px;
                                                    border-bottom: 1px solid
                                                    #1E2757;">
                                                    ${removeCurrencyAndDecimalFromPrice(saleData.products[i].total_discount_display)}
                                                </td>
                                                <td style="text-align:left;
                                                    padding-top: 10px;
                                                    font-size: 10px;
                                                    font-weight: 400;
                                                    width: 70px;
                                                    border-bottom: 1px solid
                                                    #1E2757;">
                                                    ${removeCurrencyAndDecimalFromPrice(saleData.products[i].sub_total)}
                                                </td>
                                                <td style="text-align:left;
                                                    padding-top: 10px;
                                                    font-size: 10px;
                                                    font-weight: 400;
                                                    width: 40px;
                                                    border-bottom: 1px solid
                                                    #1E2757;">
                                                    ${removeCurrencyAndDecimalFromPrice(saleData.products[i].tax)}
                                                </td>
                                                <td style="text-align:left;
                                                    padding-top: 10px;
                                                    font-size: 10px;
                                                    font-weight: 600;
                                                    width: 50px;
                                                    border-bottom: 1px solid
                                                    #1E2757;">
                                                    ${removeCurrencyAndDecimalFromPrice(saleData.products[i].total_display)}
                                                </td>
  
                                            </tr>`;
                                        }
                                  html += `<tr style="
                                                vertical-align: top;">
                                                <td colspan="6"
                                                    style="
                                                    border:none;">
  
                                                </td>
                                                <td style="">
                                                    <div style="padding-top:5px;">
                                                        <h4 style="margin:
                                                            0;
                                                            text-align:
                                                            left; font-size:
                                                            12px;
                                                            font-weight:
                                                            600; display:
                                                            ;">
                                                            <div>${removeCurrencyAndDecimalFromPrice(totalTagPriceDisplay)}</div></h4>
                                                    </div>
                                                </td>
                                                
                                                <td style="">
                                                    <div style="padding-top:5px;">
                                                        <h4 style="margin:
                                                            0;
                                                            text-align:
                                                            left; font-size:
                                                            12px;
                                                            font-weight:
                                                            600; display:
                                                            ;">
                                                            <div>${removeCurrencyAndDecimalFromPrice(totalSaveDisplay)}</div></h4>
                                                    </div>
                                                </td>
                                                <td colspan="3">
                                                    <div style="float:left; margin-left: -15px; padding-top:5px;">
                                                        <h4 style="
                                                        margin:0;
                                                        text-align: right;
                                                        font-size: 12px;
                                                        font-weight: 400;
                                                        ">
                                                            <div>Sub-Total </div></h4>
                                                    </div>
                                                    <div style="float:left; margin-left:5px;">
                                                        <h4 style="
                                                          margin:0;
                                                          text-align:right;
                                                          font-size: 12px;
                                                          font-weight: 400;
                                                        ">
                                                            <div><input
                                                                type="text"
                                                                value="${removeCurrencyAndDecimalFromPrice(saleData?.taxable_amount)}"
                                                                style="width:
                                                                80px;"></div></h4>
                                                    </div>
                                                </td>
                                            </tr>`;
  
  if(saleData.is_same_state_trnx){ 
  html += `                                 <tr style="
                                              vertical-align: top;">
                                              <td colspan="8"
                                                  style="
                                                  border:none; padding: 0;">
                                              </td>
                                              <td colspan="3">
                                                  <div style="float:left; margin-left: -15px; padding-top:5px;">
                                                      <h4 style="
                                                      margin:0;
                                                      text-align: right;
                                                      font-size: 12px;
                                                      font-weight: 400;
                                                      ">
                                                          <div>CGST Amt </div></h4>
                                                  </div>
                                                  <div style="float:left; margin-left:5px;">
                                                      <h4 style="
                                                        margin:0;
                                                        text-align:right;
                                                        font-size: 12px;
                                                        font-weight: 400;
                                                      ">
                                                          <div><input
                                                              type="text"
                                                              value="${removeCurrencyAndDecimalFromPrice(saleData?.cgst_tax)}"
                                                              style="width:
                                                              80px;"></div></h4>
                                                  </div>
                                              </td>
                                            </tr>
                                            <tr style="
                                              vertical-align: top;">
                                              <td colspan="8"
                                                  style="
                                                  border:none; padding: 0;">
                                              </td>
                                              <td colspan="3">
                                                  <div style="float:left; margin-left: -15px; padding-top:5px;">
                                                      <h4 style="
                                                      margin:0;
                                                      text-align: right;
                                                      font-size: 12px;
                                                      font-weight: 400;
                                                      ">
                                                          <div>SGST Amt </div></h4>
                                                  </div>
                                                  <div style="float:left; margin-left:5px;">
                                                      <h4 style="
                                                        margin:0;
                                                        text-align:right;
                                                        font-size: 12px;
                                                        font-weight: 400;
                                                      ">
                                                          <div><input
                                                              type="text"
                                                              value="${removeCurrencyAndDecimalFromPrice(saleData?.sgst_tax)}"
                                                              style="width:
                                                              80px;"></div></h4>
                                                  </div>
                                              </td>
                                            </tr>`;
  } else {
  html += `                                 <tr style="
                                              vertical-align: top;">
                                              <td colspan="8"
                                                  style="
                                                  border:none; padding: 0;">
                                              </td>
                                              <td colspan="3">
                                                  <div style="float:left; margin-left: -15px; padding-top:5px;">
                                                      <h4 style="
                                                      margin:0;
                                                      text-align: right;
                                                      font-size: 12px;
                                                      font-weight: 400;
                                                      ">
                                                          <div>IGST Amt </div></h4>
                                                  </div>
                                                  <div style="float:left; margin-left:5px;">
                                                      <h4 style="
                                                        margin:0;
                                                        text-align:right;
                                                        font-size: 12px;
                                                        font-weight: 400;
                                                      ">
                                                          <div><input
                                                              type="text"
                                                              value="${removeCurrencyAndDecimalFromPrice(saleData?.igst_tax)}"
                                                              style="width:
                                                              80px;"></div></h4>
                                                  </div>
                                              </td>
                                            </tr>`;
  }
  
  html += `                                 <tr style="
                                              vertical-align: top;">
                                              <td colspan="8"
                                                  style="
                                                  border:none; padding: 0;">
                                              </td>
                                              <td colspan="3">
                                                  <div style="float:left; margin-left: -15px; padding-top:5px;">
                                                      <h4 style="
                                                      margin:0;
                                                      text-align: right;
                                                      font-size: 12px;
                                                      font-weight: 400;
                                                      ">
                                                          <div>Total Amt </div></h4>
                                                  </div>
                                                  <div style="float:left; margin-left:5px;">
                                                      <h4 style="
                                                        margin:0;
                                                        text-align:right;
                                                        font-size: 12px;
                                                        font-weight: 400;
                                                      ">
                                                          <div><input
                                                              type="text"
                                                              value="${removeCurrencyAndDecimalFromPrice(saleData?.total_amount)}"
                                                              style="width:
                                                              80px;"></div></h4>
                                                  </div>
                                              </td>
                                          </tr>
                                          <tr style="
                                              vertical-align: top;">
                                              <td colspan="8"
                                                  style="
                                                  border:none; padding: 0;">
                                              </td>
                                              <td colspan="3">
                                                  <div style="float:left; margin-left: -15px; padding-top:5px;">
                                                      <h4 style="
                                                      margin:0;
                                                      text-align: right;
                                                      font-size: 12px;
                                                      font-weight: 400;
                                                      ">
                                                          <div>Cash Dist </div></h4>
                                                  </div>
                                                  <div style="float:left; margin-left:5px;">
                                                      <h4 style="
                                                        margin:0;
                                                        text-align:right;
                                                        font-size: 12px;
                                                        font-weight: 400;
                                                      ">
                                                          <div><input
                                                              type="text"
                                                              value="${removeCurrencyAndDecimalFromPrice(saleData?.discount)}"
                                                              style="width:
                                                              80px;"></div></h4>
                                                  </div>
                                              </td>
                                          </tr>
                                          <tr style="
                                              vertical-align: top;">
                                              <td colspan="8"
                                                  style="
                                                  border:none; padding: 0;">
                                              </td>
                                              <td colspan="3">
                                                  <div style="float:left; margin-left: -38px; padding-top:5px;">
                                                      <h4 style="
                                                      margin:0;
                                                      text-align: right;
                                                      font-size: 12px;
                                                      font-weight: 400;
                                                      ">
                                                          <div>Total Payable </div></h4>
                                                  </div>
                                                  <div style="float:left; margin-left:5px;">
                                                      <h4 style="
                                                        margin:0;
                                                        text-align:right;
                                                        font-size: 12px;
                                                        font-weight: 400;
                                                      ">
                                                          <div><input
                                                              type="text"
                                                              value="${removeCurrencyAndDecimalFromPrice(saleData?.total_payable)}"
                                                              style="width:
                                                              80px;"></div></h4>
                                                  </div>
                                              </td>
                                          </tr>
                                          <tr style="
                                              vertical-align: top;">
                                              <td colspan="8"
                                                  style="
                                                  border:none; padding: 0;">
                                              </td>
                                              <td colspan="3">
                                                  <div style="float:left; margin-left: -48px; padding-top:5px;">
                                                      <h4 style="
                                                      margin:0;
                                                      text-align: right;
                                                      font-size: 12px;
                                                      font-weight: 400;
                                                      ">
                                                          <div>Payment Mode </div></h4>
                                                  </div>
                                                  <div style="float:left; margin-left:5px;">
                                                      <h4 style="
                                                        margin:0;
                                                        text-align:right;
                                                        font-size: 12px;
                                                        font-weight: 400;
                                                      ">
                                                          <div><input
                                                              type="text"
                                                              value="${saleData?.payment_mode}"
                                                              style="width:
                                                              80px;"></div></h4>
                                                  </div>
                                              </td>
                                          </tr>
                                          <tr style="
                                              vertical-align: top;">
                                              <td colspan="8"
                                                  style="
                                                  border:none; padding: 0;">
                                                  <div style="float:left; ">
                                                      <h4 style="
                                                        margin:0;
                                                        text-align:left;
                                                        font-size: 12px;
                                                        font-weight: 400;
                                                      ">
                                                          <div><input
                                                              type="text"
                                                              value="${saleData?.due_date}"
                                                              style="width:
                                                              120px;"></div></h4>
                                                  </div>
                                                  <div style="float:left; margin-left:5px; padding-top:5px;">
                                                      <h4 style="
                                                      margin:0;
                                                      text-align: left;
                                                      font-size: 12px;
                                                      font-weight: 400;
                                                      ">
                                                          <div>Due Date </div></h4>
                                                  </div>
                                              </td>
                                              <td colspan="3">
                                                  <div style="float:left; margin-left: -35px; padding-top:5px;">
                                                      <h4 style="
                                                      margin:0;
                                                      text-align: right;
                                                      font-size: 12px;
                                                      font-weight: 400;
                                                      ">
                                                          <div>Paid Amount </div></h4>
                                                  </div>
                                                  <div style="float:left; margin-left:5px;">
                                                      <h4 style="
                                                        margin:0;
                                                        text-align:right;
                                                        font-size: 12px;
                                                        font-weight: 400;
                                                      ">
                                                          <div><input
                                                              type="text"
                                                              value="${removeCurrencyAndDecimalFromPrice(saleData?.paid_amount_display)}"
                                                              style="width:
                                                              80px;"></div></h4>
                                                  </div>
                                              </td>
                                          </tr>
                                          <tr style="
                                              vertical-align: top;">
                                              <td colspan="8"
                                                  style="
                                                  border:none; padding-top: 5px;">
                                                  <div style="float:left; margin-left:-5px;">
                                                      <h4 style="
                                                        margin:0;
                                                        text-align:left;
                                                        font-size: 12px;
                                                        font-weight: 400;
                                                      ">
                                                          <div><input
                                                              type="text"
                                                              value=""
                                                              style="width:
                                                              120px;"></div></h4>
                                                  </div>
                                                  <div style="float:left; margin-left:5px; padding-top:5px;">
                                                      <h4 style="
                                                      margin:0;
                                                      text-align: left;
                                                      font-size: 12px;
                                                      font-weight: 400;
                                                      ">
                                                          <div>Settlement Date </div></h4>
                                                  </div>
                                              </td>
                                              <td colspan="3">
                                                  <div style="float:left; margin-left: -65px; padding-top:5px;">
                                                      <h4 style="
                                                      margin:0;
                                                      text-align: right;
                                                      font-size: 12px;
                                                      font-weight: 400;
                                                      ">
                                                          <div>Rest Due Amount </div></h4>
                                                  </div>
                                                  <div style="float:left; margin-left:5px;">
                                                      <h4 style="
                                                        margin:0;
                                                        text-align:right;
                                                        font-size: 12px;
                                                        font-weight: 400;
                                                      ">
                                                          <div><input
                                                              type="text"
                                                              value="${removeCurrencyAndDecimalFromPrice(saleData?.due_amount_display)}"
                                                              style="width:
                                                              80px;"></div></h4>
                                                  </div>
                                              </td>
                                          </tr>`;
                                      
                                        html += ` <tr style="
                                                      vertical-align: top;">
                                                      
                                                      <td colspan="11"
                                                            style="
                                                            border:none; padding: 0;">
                                                            ${footerhtml}
                                                        </td>
                                                        
    
                                                    </tr>
                                                </tbody>
                                            </table>
  
                                            
                                            <!-- Footer -->
                                            
                                            
                                        </td>
                                    </tr>
    
                                </tbody>
                            </table>
                        </div>
                    </body>
                </html>`;
  /*let footerhtml_old = `<!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bill</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          
          <style>
          html {
            -webkit-print-color-adjust: exact;
          }
          </style>
      </head>
      <body style="box-sizing: border-box; padding: 0px; margin: 0px; font-family:
          'Poppins', sans-serif;"><div class="invoice" style="max-width: 800px; margin:auto; padding:
              5px;
              background-color: #f9f9f9;">
              <hr/>
              <table cellpadding="0" cellspacing="1" width="550px" style="margin:auto;" >
                  <tbody>
                      <tr>
                          <td><table cellspacing="0" cellpadding="0"
                                              border="0"
                                              align="center" width="90%">
                                              <div style="display: table; width:
                                                  100%; font-size: 8px;">
                                                  <div style="display: table-cell;
                                                      width: 65%;">
                                                      <h5 style="margin: 0px;
                                                          font-size: 8px;
                                                          font-weight:
                                                          600; text-transform:
                                                          uppercase;">NOTE</h5>
                                                      <ul style="margin: 0;
                                                          padding: 0px;
                                                          list-style: none;">
                                                          <span style="margin: 0;
                                                              text-align: left;
                                                              font-size: 7px;
                                                              font-weight: 400; ">*
                                                              Goods once sold will
                                                              be taken back with
                                                              condition</span>
  
                                                          <li style="margin: 0;
                                                              text-align: left;
                                                              font-size: 7px;
                                                              font-weight: 400;
                                                              list-style-type:
                                                              disc; margin-left:
                                                              35px;">Returning
                                                              minimum product
                                                              value of Rs 5000/-
                                                              above</li>
                                                          <li style="margin: 0;
                                                              text-align: left;
                                                              font-size: 7px;
                                                              font-weight: 400;
                                                              list-style-type:
                                                              disc; margin-left:
                                                              35px;">Returning
                                                              product taken back
                                                              Less than 20-30% of
                                                              my billing amount</li>
                                                          <li style="margin: 0;
                                                              text-align: left;
                                                              font-size: 7px;
                                                              font-weight: 400;
                                                              list-style-type:
                                                              disc; margin-left:
                                                              35px;">If any Damage
                                                              charge as per making
                                                              cost only</li>
                                                          <li style="margin: 0;
                                                              text-align: left;
                                                              font-size: 7px;
                                                              font-weight: 400;
                                                              list-style-type:
                                                              disc; margin-left:
                                                              35px;">No Charges
                                                              taken on Sale
                                                              product returning
                                                              within 7 days from
                                                              bill date</li>
                                                          <li style="margin: 0;
                                                              text-align: left;
                                                              font-size: 7px;
                                                              font-weight: 400;
                                                              list-style-type:
                                                              disc; margin-left:
                                                              35px;">All disputes
                                                              are subject to Patna
                                                              Juridiction only</li>
                                                          <li style="margin: 0;
                                                              text-align: left;
                                                              font-size: 7px;
                                                              font-weight: 400;
                                                              list-style-type:
                                                              disc; margin-left:
                                                              35px;">Charges may
                                                              be appling cancel of
                                                              order product making
                                                              only</li>
  
                                                      </ul>
                                                  </div>
                                                  <div style="display: table-cell;
                                                      width: 35%;">
                                                      <div style="display: flex;
                                                          gap: 10px;
                                                          justify-content:
                                                          space-between;">
                                                          <!---<div>
                                                              <h4 style="margin:
                                                                  0px;
                                                                  text-align:
                                                                  center;
                                                                  font-size:
                                                                  12px;">Customer
                                                                  Signature</h4>
                                                              <input type="text"
                                                                  style="display:
                                                                  block;
                                                                  margin: auto;
                                                                  height:
                                                                  36px; min-width:
                                                                  142px; ">
  
                                                          </div> -->
                                                         <!-- <div style="display:flex ; align-items: center;">
                                                              <h4 style="margin-right:
                                                                  5px;
                                                                  text-align:
                                                                  center;
                                                                  font-size:
                                                                  8px;">Returning%
                                                              </h4>
                                                              <div
                                                                  style="position:
                                                                  relative;">
                                                                  <input
                                                                      type="text"
                                                                      style="display:
                                                                      block;
                                                                      margin:
                                                                      auto;
                                                                      height:
                                                                      16px;
                                                                      min-width:
                                                                      24px; width:64px; ">
                                                                  <div
                                                                      style="position:
                                                                      absolute;
                                                                      right:
                                                                      12px; top:
                                                                      4px;
                                                                      font-size:
                                                                      10px;">%</div>
                                                              </div>
                                                          </div>
  
                                                      </div> -->
                                                      <div style="margin-top:5px">
                                                          <p style="font-size:
                                                              8px; margin: 0;
                                                              line-height: 1.2; ">
                                                              Company Name - ${saleData.user_details.company_name}</p>
                                                          <p style="font-size:
                                                              8px; margin: 0;
                                                              line-height: 1.2; ">
                                                              ${saleData.user_details.company_name},<br/>
                                                               Ac. No - ${saleData.user_details.bank_account_no}</p>
                                                          <p style="font-size:
                                                              8px; margin: 0;
                                                              line-height: 1.2; ">
                                                              IFSC Code -
                                                              ${saleData.user_details.bank_ifsc}</p>
                                                      </div>
                                                  </div>
                                              </div>
                                          </table></td>
                                  </tr>
                              </tbody>
                          </table>
                      </div></body>
                      </html>`;*/

    

  /*var options = {
    format: "A4",
    orientation: "portrait",
    border: "1mm",
    header: {
        height: "0mm",
        contents: ''
    },
    footer: {
        height: "10mm",
        contents: {
            first: '',
            2: '', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: ''
        }
    }
  };

  let file_path = "public/invoices/"+saleData.invoice_number+".pdf";

  var document = {
    html: html,
    data: {

    },
    path: './'+file_path,
    type: "",
  };
  pdf.create(document, options)
  .then((resp) => {
    res.send(formatResponse({
      file_name: saleData.invoice_number+".pdf",
      url: getFileAbsulatePath(file_path),
      image_url: logoUrl
    }, "Invoice pdf"));
  })
  .catch((error) => {
    addLog("pdf error: " + error.toString());
    console.error(error);
  });*/

  /* -------------- commented by Soumalya Nandy ------------ */
  /*var browser;

  try {
    let file_path = "public/invoices/" + saleData.invoice_number + ".pdf";
    //! browser instance for the linux
    // Create a browser instance
    if (env != "production") {
      browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser",
        args: ["--no-sandbox"],
      });
    } else {
      browser = await puppeteer.launch({
        ignoreDefaultArgs: ["--disable-extensions"],
      });
    }

    //this is test commit
    // Create a new page
    const page = await browser.newPage();

    //Get HTML content from HTML file
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType("screen");

    // Downlaod the PDF
    const pdf = await page.pdf({
      path: file_path,
      //margin: { top: '0px', right: '0px', bottom: '300px', left: '0px' },
      //printBackground: true,
      format: "A4",
      displayHeaderFooter: true,
      footerTemplate: footerhtml,
      margin: {
        top: "0px",
        right: "0px",
        bottom: "100px",
        left: "0px",
      },
    });

    // Close the browser instance
    await browser.close();*/
    /* -------------- commented by Soumalya Nandy ------------ */

  try{
    let file_path = "public/invoices/" + saleData.invoice_number + "_lists.pdf";
    const options = { format: 'A4' };

    (async () => {
        const file = { content: html };
    
        // Generate PDF
        const pdfBuffer = await html_to_pdf.generatePdf(file, options);
        
        // Save PDF to file
        fs.writeFileSync(file_path, pdfBuffer);
        compactLog('PDF generated successfully!');

        res.send(
          formatResponse(
            {
              file_name: saleData.invoice_number + "_lists.pdf",
              url: getFileAbsulatePathPDF(file_path),
              html : html,
              saleData,
              payments,
            },
            "Invoice pdf"
          )
        );
    })();
    
    /*const doc = new jsPDF();
    doc.html(html, {
        callback: (pdf) => {
            pdf.save(file_path);
            compactLog('PDF generated successfully!');

            res.send(
              formatResponse(
                {
                  file_name: saleData.invoice_number + ".pdf",
                  url: getFileAbsulatePath(file_path),
                  saleData,
                  payments,
                },
                "Invoice pdf"
              )
            );
        },
    });*/

    
  } catch (error) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse(error.toString()));
  }
};