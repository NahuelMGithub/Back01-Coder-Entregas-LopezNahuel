import { Router } from "express";
import productModel from '../models/product.models.js'
import cartModel from '../models/cart.models.js'

const routerCart = Router();

routerCart.get('/', async (req, res) => {
    try {
        // Obtén el carrito y poblalo para incluir los detalles de los productos
        let carritoActual = await cartModel.findById("671286aec75dd0b07040d5a5").populate('juegos.juego');
        console.log(carritoActual)
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

/*

PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body


Esta vez, para el modelo de Carts, en su propiedad products, el id de cada producto generado dentro del array tiene que hacer referencia al modelo de Products.
 Modificar la ruta /:cid para que al traer todos los productos, los traiga completos mediante un “populate”. De esta manera almacenamos sólo el Id, pero al solicitarlo podemos 
 desglosar los productos asociados.

*/

//--------------------



//------------------- PUTS





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

routerCart.delete('/carts/:cid', async (req, res) => {
    const { cid } = req.params; // Obtenemos el parámetro cid

    try {
        // Buscamos el carrito por su ID
        const carritoBuscado = await cartModel.findById(cid);

        if (!carritoBuscado) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Limpiamos la lista de juegos en el carrito
        carritoBuscado.juegos = []; // Simplemente transformo su array a vacio

        // Guardamos los cambios en el carrito
        await carritoBuscado.save();

        return res.status(200).json({ message: 'Todos los juegos han sido eliminados del carrito', carrito: carritoBuscado });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar los juegos del carrito' });
    }
});



export default routerCart;
