import { Router } from "express";
import productModel from '../models/product.models.js'


import { uploader } from '../utilsMulter.js';
const routerProduct = Router();

//Post para poner mis productos (juegos de mesa)
routerProduct.post('/', uploader.single('thumbnails'),  async (req, res) => {
    try {
        const nuevoProducto = new productModel(req.body) // aca uso el Schema que cree en productModel
        console.log('el producto es: ', nuevoProducto)
/*          if (req.file) {
            nuevoProducto.thumbnails = req.file.path;  
        }
     else {
        console.log('No se subió ningún archivo.');
    }  */
       

        await nuevoProducto.save();
        res.render('product', { product: nuevoProducto.toObject() });
        console.log('el producto es: ', nuevoProducto)
    }
    catch (error) {
        return res.render('error', { error: 'Error al Crear un producto' })
    }
})

//Obtengo  Products 
routerProduct.get('/', async (req, res) => {
    try {
        let todosLosProductos = await productModel.find({});

        res.render('allProducts', { products: todosLosProductos.map(producto => producto.toObject()) });
    }
    catch (error) {
        return res.render('error', { error: 'Error al obtener productos' })

    }
})

// Buscar un producto por ID
routerProduct.get('/:id', async (req, res) => {
    try {
        let productoBuscado = await productModel.findById(req.params.id);
        if (!productoBuscado) {
            return res.render('error', { error: 'Producto No encontrado' })

        }
        res.render('product', { product: productoBuscado.toObject() })
    }
    catch (error) {
        return res.render('error', { error: 'Error al buscar un producto' })
    }
})

// editar un producto por ID
routerProduct.put('/:id', async (req, res) => {
    try {
        let producto = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!producto) {
            return res.status(404).send({
                message: 'Producto NO encontrado'
            })
        }
        res.send(producto)
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: "Error al obtener productos" });
    }
})

// Eliminar un producto por ID
routerProduct.delete('/:id', async (req, res) => {
    try {
        let producto = await productModel.findByIdAndDelete(req.params.id);
        if (!producto) {
            res.render('error', { error: 'Error al Eliminar un producto' })
        }
        res.redirect('/products') // ni bien termina, me devuelve (en este caso a producs)
    }
    catch (error) {
        return res.render('error', { error: 'Error al Eliminar un producto' })
    }
})

export default routerProduct;

