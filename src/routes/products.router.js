import { Router } from "express";
import { v4 as uuidv4 } from 'uuid';

import ProductsManager from "./ProductsManager.js";


const router = Router();
const productsManager = new ProductsManager();
// Obtener todos los productos

let products = [];




//Obtengo  Products con  limit
router.get('/', async (req, res) => {
    try {
        const productos = await productsManager.leerProducto();
        if (productos.lenght === 0) {
            return res.status(200).json({ message: "No hay productos disponibles" });
        }
        //obtiene el valor del parametro limit de la consulta
        const limit = parseInt(req.query.limit)
        const productosLimitados = limit && !isNaN(limit) ? productos.slice(0, limit) : productos;
        res.status(200).json(productosLimitados)
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: "Error al obtener productos" });
    }
})

// aca hago el get par obtener un producto por su id
router.get('/:pid', async (req, res) => {
    try {
        const productos = await productsManager.leerProducto();
        const prodId = req.params.pid
        const producto = productos.find(producto => producto.id === prodId);
        if (!producto) {
            return res.status(404).send({ status: "error", error: "Product not found" });
        }
        res.send(producto);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: "Error al obtener producto buscado" });
    }

})

// POST al JSON

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status = true, stock, category, thumbnails, } = req.body;

        //validar producto
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }
        // creo el producto y lo agrego a la lista

        await productsManager.crearProducto({
            id: uuidv4(),
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        })
        res.status(201).send({ status: "success", message: "Producto creado" });

    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: "Error al crear producto" });
    }

})




// PUT

router.put('/:pid', async (req, res) => {
    const productoBuscado = req.params.pid;

    const nuevosDatos = req.body;
    try {
        // Llamar al método editarProducto del productManager
        const productoActualizado = await productsManager.editarProducto(productoBuscado, nuevosDatos);

        // Enviar la respuesta con el producto actualizado
        res.json(productoActualizado);
    } catch (error) {
        // Enviar una respuesta de error si algo salió mal
        res.status(404).json({ error: error.message });
    }

})



//DELETE La ruta DELETE /:pid deberá eliminar el producto con el pid indicado. 


router.delete('/:pid', async (req, res) => {
    try {
        const productoIdAEliminar = req.params.pid;
        await productsManager.eliminarProducto(productoIdAEliminar)
        res.status(204).json({ mensaje: 'Producto eliminado' })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: "Error al eliminar producto buscado" });
    }
})

export default router;

