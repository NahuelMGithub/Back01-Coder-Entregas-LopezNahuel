import express from'express';
import handlebars from'express-handlebars';
import mongoose from 'mongoose';

// metodo para eliminar
import methodOverride from 'method-override'

//Import para configuracion base
import __dirname from './utils.js';

// Import para variable de entorno
import dotenv from 'dotenv';
dotenv.config();
const uriConexcion = process.env.URI_MONGO

//Importar los routers routers
import routerProduct from './routes/products.router.js';
import routerCart from './routes/cart.router.js';

const app = express(); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

//Iniciar el motodo de app.engine
//Configurar el motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views',__dirname + '/views');
app.set('view engine','handlebars');
// Cargamos la carpeta 'public' como nuestra carpeta de archivos estáticos
app.use(express.static(__dirname + '/public'));


const PORT = 3037;
app.listen(PORT, ()=>{
    console.log(`Escuchando en puerto ${PORT}`);
})

console.log('uriConexcion es ',uriConexcion)
// uriConexcion me toma como undifined, por eso lo dejo aca, aunque se que es mala practica


 mongoose.connect('mongodb+srv://nahuel:coder2024@entregafinal.ehdln.mongodb.net/')
    .then(()=>console.log('conectado a BD Atlas'))
    .catch(error=>console.log('error: ', error))

    //  esto lo uso, solo para agregar varios una vez, lo podria hacer desde postman tambien
      
    
    
//---- Routers 
app.use('/', routerProduct);
//app.use('/cart', routerCart);

app.get('/newProduct', (req, res)=>{
    res.render('newProduct');
})


app.use('/cart', routerCart);
//app.use('/cart', routerCart);


