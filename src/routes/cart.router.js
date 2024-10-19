import { Router } from "express";
import productModel from '../models/product.models.js'
import cartModel from '../models/cart.models.js'


const routerCart = Router();

routerCart.get('/', async (req, res) => {
    try {
        // Obtén el carrito y poblalo para incluir los detalles de los productos
        let carritoActual = await cartModel.findById("671306187129263c6caab6c7").populate('juegos.juego');
        console.log(carritoActual.juegos)
        res.render('cart', { products: carritoActual.juegos });
    } catch (error) {
        console.error(error); // Muestra el error en la consola para facilitar la depuración
        return res.render('error', { error: 'Error al obtener productos' });
    }
});


// posteo correctamente un carrito desde POSTMAN
routerCart.post('/', async (req, res) => {
    try {
        const nuevoCarrito = await cartModel.create(req.body)
        return res.status(201).json({ message: 'Carrito creado con éxito', carrito: nuevoCarrito });
   }
    catch (error) {
        return res.render('error', { error: 'Error al Crear carrito' });
    }
});


//agregar un producto con id al carrito actual
routerCart.post('/:id', async (req, res) => {
    try {
        // Usar req.params.id para obtener el ID del producto
        let productoAAgregar = await productModel.findById(req.params.id);
        if (!productoAAgregar) {
            return res.status(404).send({
                message: 'Producto NO encontrado'
            });
        }
        
        // Asegúrate de usar el ID correcto para encontrar el carrito
        let carritoActual = await cartModel.findById("671306187129263c6caab6c7").populate('juegos.juego');

        carritoActual.juegos.push(productoAAgregar);
        await carritoActual.save();  // Asegúrate de esperar la promesa aquí
        
        res.redirect('/cart') // ni bien termina, me devuelve (en este caso a producs)
    } catch (error) {
        console.error(error);  // Registra el error para depuración
        return res.status(500).render('error', { error: 'Error al crear el carrito' });
    }
});


//--------------Deteles
//DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
routerCart.delete('/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params; // Tomamos los parámetros cid y pid

    try {
        // Buscamos el carrito por su ID
        const carritoBuscado = await cartModel.findById(cid);
        
        if (!carritoBuscado) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Filtramos el array de productos para eliminar el producto específico
        carritoBuscado.products = carritoBuscado.products.filter(product => product._id.toString() !== pid);

        // Guardamos los cambios en el carrito
        await carritoBuscado.save();

        return res.status(200).json({ message: 'Producto eliminado del carrito', carrito: carritoBuscado });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});







//DELETE api/carts/:cid deberá eliminar todos los productos del carrito 

//DELETE api/carts/:cid deberá eliminar todos los productos del carrito 

//DELETE api/carts/:cid deberá eliminar todos los productos del carrito 

routerCart.delete('/cart/:cid', async (req, res) => {
    const { cid } = req.params; // Obtener el ID del carrito de los parámetros
    try {
        const carritoBuscado = await cartModel.findById(cid);
        if (!carritoBuscado) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Eliminar todos los productos del carrito
        carritoBuscado.juegos = []; // Limpiar el array de juegos
        await carritoBuscado.save(); // Guardar cambios en la base de datos

        res.status(200).json({ message: 'Carrito eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
});




export default routerCart;
