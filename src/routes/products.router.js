import { Router } from "express";
import productModel from '../models/product.models.js'
import { uploader } from '../utilsMulter.js';

const routerProduct = Router();

//Post para poner mis productos (juegos de mesa). testeado desde web.  Funciona bien
routerProduct.post('/products', uploader.single('thumbnails'),  async (req, res) => {
    try {
        const nuevoProducto = new productModel(req.body) // aca uso el Schema que cree en productModel
        console.log('el producto es: ', nuevoProducto)
          if (req.file) {
            nuevoProducto.thumbnails = req.file.path;  
        }
     else {
        console.log('No se subió ningún archivo.');
    }  
       
           await nuevoProducto.save();
        res.render('product', { product: nuevoProducto.toObject() });
        console.log('el producto es: ', nuevoProducto)
    }
    catch (error) {
        return res.render('error', { error: 'Error al Crear un producto' })
    }
})

//Obtengo  todos Products y los muestros en paginas segun como  quiero. Funciona bien, testeado desde web
routerProduct.get('/products', async (req, res) => {
    try {
        // Obtener los parámetros de la query
        let page = parseInt(req.query.page) || 1; //Parámetro de pagina, por defecto es uno
        let row = parseInt(req.query.row) || 9; //Parámetro de elementos mostrados por pagina, por defecto es 9. La consigna decia 10, pero de a 9 se ve mas lindo 
        let query = req.query.query;  // Parámetro de filtro
        let sort = req.query.sort;    // Parámetro de ordenamiento
        
        // Construir el objeto de filtro para la query
        let filter = {};
        if (query) {
              if (query === 'category') {
                filter = { category: req.query.value }; 
            }
           else if (query === 'available') {
                filter = { stock: { $gt: 0 }, status: true }; // Filtro de disponibilidad
            }
        }

        // Construir el objeto de sort 
        let sortOption = {};
        if (sort === 'asc') {
            sortOption = { price: 1 };  
        } else if (sort === 'desc') {
            sortOption = { price: -1 };  
        }

        //En esto estaba trabado! donde dice filter, si no pongo nada es un objeto vacio   {}
        // Obtener productos paginados con el filtro. 
        let todosLosProductos = await productModel.paginate(filter, { 
            page, 
            limit: row, 
            lean: true, 
            sort: sortOption // Aplicar el ordenamiento 
        });

        // Construir enlaces para paginación. En After 17
        todosLosProductos.nextLink = todosLosProductos.hasNextPage 
            ? `http://localhost:3037/products?page=${todosLosProductos.page + 1}&row=${row}` 
            : '';
        todosLosProductos.prevLink = todosLosProductos.hasPrevPage 
            ? `http://localhost:3037/products?page=${todosLosProductos.page - 1}&row=${row}` 
            : '';
        
        todosLosProductos.isValid = !(page <= 0) || (page > todosLosProductos.totalPages);

        // Renderizar vista con productos. paso los elementos, porque sino no los toma. No se por que
        res.render('allProducts', { 
            products: todosLosProductos.docs, 
            page: todosLosProductos.page,
            isValid: todosLosProductos.isValid,
            totalPages: todosLosProductos.totalPages,
            hasPrevPage: todosLosProductos.hasPrevPage,
            hasNextPage: todosLosProductos.hasNextPage,
            nextLink: todosLosProductos.nextLink,
            prevLink: todosLosProductos.prevLink
        });
    }
    catch (error) {
        return res.render('error', { error: 'Error al obtener productos' });
    }
});

// Get statusQuery: Solicitado por la entrega final: Funciona bien, testeado desde web
routerProduct.get('/statusQuery', async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let row = parseInt(req.query.row);
        if (!page) page = 1
        if (!row) row = 10

        let result = await productModel.paginate({}, { page, limit: row, lean: true });
        result.nextLink = result.hasNextPage ? `http://localhost:3037/products?page=${result.page + 1}&row=${row}` : '';
        result.prevLink = result.hasPrevPage ? `http://localhost:3037/products?page=${result.page - 1}&row=${row}` : '';
        
     // status:success/error   payload: Resultado de los productos solicitados
        res.json({
            status: 'success',
            payload: result,
        });
    }
    catch (error) {
        return res.render('error', { error: 'Error al obtener productos' });
    }
});

// Buscar un producto por ID:  Funciona bien. Testeado desde web
routerProduct.get('/products/:id', async (req, res) => {
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

// Editar un producto por ID Testeado desde POSTMAN funciona bien
routerProduct.put('/products/:id', async (req, res) => {
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

// Eliminar un producto por ID. Funciona bien. Testeado desde web
routerProduct.delete('/products/:id', async (req, res) => {
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

 