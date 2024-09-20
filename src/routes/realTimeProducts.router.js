import express from 'express';


import ProductsManager from "./ProductsManager.js";


const router = express.Router(); // esta parte nbo me quedo claro si lo neesito
const productsManager = new ProductsManager();



router.get('/', async (req, res) => {
    try{

        const productos = await productsManager.leerProducto();

        res.render('realTimeProducts', {
            style: 'style.css',
            title: "Listado de productos",
            products: productos
        }); // De momento solo renderizamos la vista, no pasamos objetos

    }
    catch(error){
        console.log(error);
        res.status(500).send('Error al cargar los productos')
    }

   
});

export default router;