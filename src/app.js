import express from'express';

//Importar los routes

import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';


const app = express();

//Inicializar el servidor
app.listen(8080, () => {
    console.log("El servidor se encuentra escuchando");
})

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//Implementar los routers 
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);



