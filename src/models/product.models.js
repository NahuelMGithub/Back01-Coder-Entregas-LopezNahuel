import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
  
const {Schema} = mongoose;

const productsCollection = 'productos'

const productSchema = new Schema({
        title: String,
        description: String,
        code: String,
        price: Number,
        status: Boolean,
        stock: Number,
        category: {
          type: String,
          enum : ["EuroGame",
                  "PartyGame",
                  "Estrategia",
                  "Misterio",
                  "Abstracto",
                  "Cooperativo",
                  "Clasico",
                  "Solitario" 
                ], 
          default: "Clasico" 
        },
        thumbnails: String
      })
    
productSchema.plugin(mongoosePaginate);

const  productModel = mongoose.model(productsCollection, productSchema ) //aca le dice el nombre de la coleccion y la estructura (schema)

export default productModel
