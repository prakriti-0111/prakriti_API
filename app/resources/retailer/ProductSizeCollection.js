const { isObject, isEmpty, getFileAbsulatePath } = require("@helpers/helper");
const { filter } = require("lodash");
const {StocksCollection} = require("@resources/retailer/StocksCollection");

const ProductSizeCollection = (data) => {
    if(isObject(data)){
        return getModelObject(data);
    }else{
        let arr = [];
        for(let i = 0; i < data.length; i++){
            arr.push(getModelObject(data[i]));
        }
        return arr;
    }
}

const getModelObject = (data) => {
    let all_stocks = StocksCollection(data.stocks);
    let stocks = [];
   
    if((!isEmpty(data)) && (!isEmpty(data.product_sizes))){
      let product_id = data.product_sizes.product_id;
      let size_id = data.product_sizes.size_id;

      stocks = filter(all_stocks, function(o) { return o.product_id == product_id && o.size_id == size_id; });
    }

   
    return {
        id: data.id,
        name: data.name,
        stocks: stocks,
    }
  
}

module.exports = {
    ProductSizeCollection
}
