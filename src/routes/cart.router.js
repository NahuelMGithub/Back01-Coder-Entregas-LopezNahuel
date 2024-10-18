import { Router } from "express";
import productModel from '../models/product.models.js'
import cartModel from '../models/cart.models.js'

const routerCart = Router();

routerCart.get('/', async (req, res) => {
    try {
        // Obtén el carrito y poblalo para incluir los detalles de los productos
        let carritoActual = await cartModel.findById("671286aec75dd0b07040d5a5").populate('juegos.juego');
        
        // Asegúrate de que los productos se estén pasando correctamente
        res.render('cart', { products: carritoActual.juegos });
    } catch (error) {
        console.error(error); // Muestra el error en la consola para facilitar la depuración
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
