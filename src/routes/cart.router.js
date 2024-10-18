import { Router } from "express";
import productModel from '../models/product.models.js'
import cartModel from '../models/cart.models.js'

const routerCart = Router();

routerCart.get('/', async (req, res) => {
    try {
      
        res.render('cart');

    }
    catch (error) {
        return res.render('error', { error: 'Error al obtener productos' });
    }
});

// posteo correctamente un carrito. 
// habria que modificarlo, para que: tenga population en ese array
routerCart.post('/', async (req, res) => {
    try {
        const nuevoCarrito = await cartModel.create(req.body)
        return res.status(201).json({ message: 'Carrito creado con éxito', carrito: nuevoCarrito });
        console.log('el Carrito es: ', nuevoCarrito)
    }
    catch (error) {
        return res.render('error', { error: 'Error al Crear carrito' });
    }
});


export default routerCart;
