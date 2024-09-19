import { Router } from "express";
import ProductsManager from "./ProductsManager.js";
import CartManager from "./CartManager.js";

const router = Router();
const productsManager = new ProductsManager();
const cartManager = new CartManager();
let carts = [];

// creo el producto y lo agrego a la lista
router.post('/', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        //validar producto
        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).send({ status: 'error', message: 'Datos inválidos' });
        }
        //verificamos si el producto existe
        const productos = await productsManager.leerProducto();
        const producto  = productos.find(p => p.id === productId)
        if(!producto){
            return res.status(400).send({ status: 'error', message: 'Producto no encontrado' });
        }
       //Si el producto existe, ahora creo el carrito y le agrego el producto
        await cartManager.createCart(); //crea el carrito
        const  carritos = await cartManager.getCart();   
        const newCart = carritos[carritos.length - 1] // obtengo el ultimo carrito. (recien creado)
        await cartManager.addProduct(newCart.id, productId, quantity);
        res.status(201).send({ status: 'success', message: 'Carrito creado con exito y el producto fue agregado' })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: "Error al crear  el carrito y agregar un  producto" });
    }
})

// La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
router.get('/:cid', async (req, res) => {
    try {
        const carritoID = parseInt(req.params.cid); // Asegúrate de convertir a número
        const carritos = await cartManager.getCart(); 
        const carritoIndex = carritos.findIndex(carrito => carrito.id === carritoID);
        
        if (carritoIndex === -1) {
            return res.status(404).send({ status: "error", error: "Cart not found" });
        }
        res.send(carritos[carritoIndex]);
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: "Error al buscar el carrito" });
    }
});

// post
// dado un carrito y un producto, obtengo ese producto
router.post('/:cid/product/:pid', (req, res) => {
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

