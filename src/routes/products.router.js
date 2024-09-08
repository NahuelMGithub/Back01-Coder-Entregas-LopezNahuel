import { Router } from "express";
import {v4 as uuidv4 } from 'uuid';

const router = Router();



/*
Para el manejo de productos, el cual tendrá su router en /api/products/ , configurar las siguientes rutas:




La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar 
o eliminar el id al momento de hacer dicha actualización.
La ruta DELETE /:pid deberá eliminar el producto con el pid indicado. 

*/

// Obtener todos los productos

let products = [];


//  aca hice un get simple, para trabajarlo bien, mirar 7 y after
router.get('/', (req, res)=>{
    res.json(products) 
})


// aca hago el get par obtener un producto por su id

router.get('/:id', (req, res)=>{
    const prodId = req.params.id
    const producto = products.find(producto => producto.id === prodId); 
    if (!producto) { 
        return res.status(404).send({ status: "error", error: "Product not found" });
     } 
     res.send(producto);
})

// POST

router.post('/', (req, res) =>{
     const {title,  description, code, price, status=true, stock, category, thumbnails, } = req.body;

    //validar producto

     if(!title || !description || !code || !price || !stock || !category  ){
        return res.status(400).json({ error : 'Datos inválidos'});
    }
   

     // creo el producto y lo agrego a la lista

     const newProduct = {
            id: uuidv4(), // puse +1, porque es raro que su id sea cero. Otra opcion
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails

     }

     products.push(newProduct);
     res.status(201).json(newProduct);


})

// PUT





export default router;