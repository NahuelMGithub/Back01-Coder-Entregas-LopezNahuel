import mongoose from "mongoose";
  
const {Schema} = mongoose;

const cartsCollection = 'carrito'

const cartSchema = new Schema({
        title: String,
        description: String,
      })
      
const  cartModel = mongoose.model(cartsCollection, cartSchema ) //aca le dice el nombre de la coleccion y la estructura (schema)

export default cartModel
