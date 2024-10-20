import { Router } from "express";
import productModel from '../models/product.models.js'
import cartModel from '../models/cart.models.js'


const routerCart = Router();

/// Get carrito -> Funciona
routerCart.get('/', async (req, res) => {
    try {
        // Obtén el carrito y poblalo para incluir los detalles de los productos
        let carritoActual = await cartModel.findById("671500c361b6d5c79fd986bb").populate('juegos.juego');
        res.render('cart', { products: carritoActual.juegos });
    } catch (error) {
        console.error(error); // Muestra el error en la consola para facilitar la depuración
        return res.render('error', { error: 'Error al obtener productos' });
    }
});


/// Get carrito por ID -> Funciona
// Modificar la ruta /:cid para que al traer todos los productos, los traiga completos mediante un “populate”. De esta manera almacenamos sólo el Id, pero al solicitarlo 
// podemos desglosar los productos asociados.
routerCart.get('/:cid', async (req, res) => {
    try {
        // Obtén el carrito y poblalo para incluir los detalles de los productos
        let   {cid} = req.params;
       let juegos = await cartModel.findById(cid).populate('juegos.juego');
        res.send(juegos)
       } catch (error) {
        console.error(error); // Muestra el error en la consola para facilitar la depuración
        return res.render('error', { error: 'Error al obtener productos' });
    }
});


// posteo correctamente un carrito desde POSTMAN  -> Funciona
routerCart.post('/', async (req, res) => {
    try {
        const nuevoCarrito = await cartModel.create(req.body)
        return res.status(201).json({ message: 'Carrito creado con éxito', carrito: nuevoCarrito });
   }
    catch (error) {
        return res.render('error', { error: 'Error al Crear carrito' });
    }
});


//agregar un producto con id al carrito actual: -> Funciona  e
routerCart.post('/:id', async (req, res) => {
    try {
        // Usar req.params.id para obtener el ID del producto
        let productoAAgregar = await productModel.findById(req.params.id);
        if (!productoAAgregar) {
            return res.status(404).send({
                message: 'Producto NO encontrado'
            });
        }
        // uso por defecto este unico carrito.        
        let carritoActual = await cartModel.findById("671500c361b6d5c79fd986bb").populate('juegos.juego');
    // Busca si el producto ya existe en el carrito
        let productoExistente = carritoActual.juegos.find(j => j._id == productoAAgregar.id);
          if (productoExistente) {
            // Si el producto ya está en el carrito, aumenta la cantidad
            productoExistente.quantity += 1; // Aumenta la cantidad (puedes ajustar esto si necesitas un valor específico)
        } else {
            // Si el producto no existe, agréguelo al carrito
            carritoActual.juegos.push({ juego: productoAAgregar._id, quantity: 1 }); // Agrega el producto con cantidad 1
        }
                await carritoActual.save();  
                res.redirect('/cart') // ni bien termina, me devuelve (en este caso a producs)
    } catch (error) {
        console.error(error);  // Registra el error para depuración
        return res.status(500).render('error', { error: 'Error al crear el carrito' });
    }
});

//PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.  Funciona bien en postman
routerCart.put('/:cid', async (req, res) => {
    try {
        // Obtener el ID del carrito desde los parámetros de la URL
        let carritoId = req.params.cid;
        // Obtener el arreglo de juegos a agregar desde el cuerpo de la solicitud
        let juegosAAgregar = req.body.juegos;
        // Verificar si el carrito existe
        let carritoAActualizar = await cartModel.findById(carritoId);
        if (!carritoAActualizar) {
            return res.status(404).send({
                message: 'Carrito NO encontrado'
            });
        }
        console.log("El juego a actualizar es ", juegosAAgregar )
        // Iterar sobre los juegos a agregar
        juegosAAgregar.forEach((nuevoJuego) => {
            // Buscar si el juego ya existe en el carrito
            let juegoExistente = carritoAActualizar.juegos.find(j => j._id.toString() === nuevoJuego._id);

            if (juegoExistente) {
                // Si el juego ya está en el carrito, incrementar la cantidad
                juegoExistente.quantity += nuevoJuego.stock || 1;
            } else {
                // Si el juego no existe, agregarlo al carrito
                carritoAActualizar.juegos.push({
                    juego: nuevoJuego.juego, 
                    quantity: nuevoJuego.stock || 1 // Asumimos que se agrega 1 si no se especifica cantidad. pero a la cantidad le agrego el stock
                });
            }
        });
        // Guardar el carrito actualizado
        await carritoAActualizar.save();
        // Redireccionar o devolver el carrito actualizado como respuesta JSON
        res.redirect('/cart');
       
    } catch (error) {
        console.error(error);  // Registra el error para depuración
        return res.status(500).render('error', { error: 'Error al actualizar el carrito' });
    }
});

//PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
routerCart.put('/:cid/products/:pid', async (req, res) => {
    try {
        let {pid} = req.params
        let nuevaCantidad = req.body.quantity;
        // Usar req.params.id para obtener el ID del producto
        let productoAAgregar = await productModel.findById(pid);
        if (!productoAAgregar) {
            return res.status(404).send({
                message: 'Producto NO encontrado'
            });
        }
                
        let carritoActual = await cartModel.findById(req.params.cid).populate('juegos.juego');
        if (!carritoActual) {
            return res.status(404).send({
                message: 'Carrito NO encontrado'
            });
        }
     // Busco si el producto ya existe en el carrito
        let productoExistente = carritoActual.juegos.find(j => j.juego._id.toString() === pid);
        if (productoExistente) {
            // Si el producto ya está en el carrito, aumenta la cantidad
            productoExistente.quantity = nuevaCantidad; // Aumenta la cantidad (puedes ajustar esto si necesitas un valor específico)
        } else {
            // Si el producto no existe, lo agrego al carrito, con la cantidad dada
            carritoActual.juegos.push({ juego: productoAAgregar._id, quantity: nuevaCantidad }); // Agrega el producto con cantidad dad
        }
        
        await carritoActual.save();  
        res.status(200).json({ message: 'Carrito Actualizado exitosamente, nueva cantidad: ', nuevaCantidad });
     } catch (error) {
       return res.status(500).render('error', { error: 'Error al crear el carrito' });
    }
});


//--------------Deletes
//DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado. > Funciona en postman
routerCart.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params; // Aca desestructure req.params
    try {
        // Buscamos el carrito por su ID
        const carritoBuscado = await cartModel.findById(cid);
                if (!carritoBuscado) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Filtramos el array de productos para eliminar el producto específico
        carritoBuscado.juegos = carritoBuscado.juegos.filter(juegoABorrar => juegoABorrar._id.toString() !== pid);
        // Guardamos los cambios en el carrito
        await carritoBuscado.save();
        return res.status(200).json({ message: 'Producto eliminado del carrito', carrito: carritoBuscado });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});



//DELETE api/carts/:cid deberá eliminar todos los productos del carrito 

routerCart.delete('/:cid', async (req, res) => {
    const { cid } = req.params; // Obtener el ID del carrito de los parámetros
    try {
        const carritoBuscado = await cartModel.findById(cid);
        if (!carritoBuscado) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
      // Eliminar todos los productos del carrito
        carritoBuscado.juegos = []; // Limpiar el array de juegos. Los quantity pasan a desaparecer, asi que no me tengo que preocupar
        await carritoBuscado.save(); // Guardar cambios en la base de datos

        res.status(200).json({ message: 'Carrito eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
});



export default routerCart;
