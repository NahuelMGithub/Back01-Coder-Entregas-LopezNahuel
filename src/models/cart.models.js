import mongoose from "mongoose";

const { Schema } = mongoose;

const cartsCollection = 'carritos';

const cartSchema = new Schema({
  cart_name: { type: String, required: true },
  juegos: {
    type: [{
    juego: { type: mongoose.Schema.Types.ObjectId, ref: "productos" }, // Referencia al modelo "productos"
    quantity: { type: Number, required: true, default: 1 } 
  }], default: []
  }
});

cartSchema.pre('find', function(next) {
  
  this.populate('juegos.juego')
  next();
})

const cartModel = mongoose.model(cartsCollection, cartSchema); // Definición del modelo con el nombre de la colección y el schema

export default cartModel;
