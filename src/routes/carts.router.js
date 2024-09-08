import { Router } from "express";
import {v4 as uuidv4 } from 'uuid';

const router = Router();

let carts = [];

//----- ruta POST

router.post('/', (req, res) =>{
    const {products } = req.body;

   //validar producto

    if(!products ){
       return res.status(400).json({ error : 'Datos inválidos'});
   }
 
    // creo el producto y lo agrego a la lista

    const newCart = {
           id: uuidv4(), 
           products
    }

    carts.push(newCart);
    res.status(201).json(newCart);
})

router.get('/:cid', (req, res)=>{
    const carritoID = req.params.cid
    const carritoBuscado = carts.find(carrito => carrito.id === carritoID); 
    if (!carritoBuscado) { 
        return res.status(404).send({ status: "error", error: "Cart not found" });
     } 
     res.send(carritoBuscado);

})


/*

1)  busco el carrito por id
si no existe genero error
si existe, busco producto. 
 si NO existe, agrego el id  y pongo quantity 1
 si existe, mantengo id y quantity=+1
 retorno el    carrito

*/


router.post('/:cid/product/:pid', (req, res) =>{
    const carritoBuscado = req.params.cid;
    const productoBuscado = req.params.pid;

    // Buscar el carrito por su ID
    const carritoIndex = carts.findIndex(carrito => carrito.id === carritoBuscado);

    // Si el carrito no se encuentra, retornar error 404
    if (carritoIndex === -1) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Obtener el carrito actual
    const carritoActual = carts[carritoIndex];

    // Buscar si el producto ya está en el carrito
    const productoEnCarrito = carritoActual.products.find(prod => prod.product === productoBuscado); // no estoy seguro si es prod.product o .id

    if (productoEnCarrito) {
        // Si el producto ya está en el carrito, incrementar su cantidad
        productoEnCarrito.quantity += 1;
    } else {
        // Si el producto no está, agregarlo con cantidad 1
        carritoActual.products.push({
            product: productoBuscado,
            quantity: 1
        });
    }

    // Actualizar el carrito en la lista de carritos
    carts[carritoIndex] = carritoActual;

    

    // Devuelve el carrito actualizado
    res.json(carritoActual);
})

export default router;

