import mongoose from "mongoose";
  
const {Schema} = mongoose;

const productsCollection = 'productos'

const productSchema = new Schema({
        title: String,
        description: String,
        code: String,
        price: Number,
        status: Boolean,
        stock: Number,
        category: String,
        thumbnails: String
      })
      
const  productModel = mongoose.model(productsCollection, productSchema ) //aca le dice el nombre de la coleccion y la estructura (schema)

export default productModel
