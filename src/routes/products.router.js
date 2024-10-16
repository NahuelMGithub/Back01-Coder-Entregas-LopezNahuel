import { Router } from "express";
import productModel from '../models/product.models.js'

const routerProduct = Router();

//Post para poner mis productos (juegos de mesa)
routerProduct.post('/', async (req, res) => {
    try {
        const nuevoProducto = new productModel(req.body) // aca uso el Schema que cree en productModel
        console.log('el producto es: ', nuevoProducto)
        await nuevoProducto.save();
        res.render('product', {product: nuevoProducto})
    }
    catch (error) {
        return res.render('error', {error: 'Error al Crear un producto'})
    }
})


/* routerProduct.post('/products', async (req, res) => {

    try {
        const producto = new productModel(req.body) // aca uso el Schema que cree en productModel
        console.log('el producto es: ', producto)
        await producto.save();
        res.status(201).send(producto)
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ status: 'error', error: "Error al crear producto" });
    }
}) */

//Obtengo  Products 
routerProduct.get('/', async (req, res) => {
    try {
        let productos = await productModel.find({});
        console.log(productos)
        res.send(productos)
        }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: "Error al obtener productos" });
    }
})


routerProduct.get('/:id', async (req, res) => {
    try {
        let productoBuscado = await productModel.findById(req.params.id);
        if(!productoBuscado){
            return res.render('error', {error: 'Producto No encontrado'})
        }
        res.render('product', {product: productoBuscado})
        }
    catch (error) {
        return res.render('error', {error: 'Error al buscar un producto'})
    }
})



routerProduct.put('/:id', async (req, res) => {
    try {
        let producto = await productModel.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true});
        if(!producto){
            return res.status( 404).send({
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


routerProduct.delete('/:id', async (req, res) => {
    try {
        let producto = await productModel.findByIdAndDelete(req.params.id);
        if(!producto){
            return res.status( 404).send({
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

export default routerProduct;

