import express from'express';
import handlebars from'express-handlebars';
import mongoose from 'mongoose';
import cartModel from './models/cart.models.js';

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
import productModel from './models/product.models.js';

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
   /*  let result = await productModel.insertMany(
        [
            {
              "title": "Catan",
              "description": "Juego de estrategia y comercio en el que los jugadores colonizan una isla.",
              "code": "CAT123",
              "price": 50,
              "status": true,
              "stock": 10,
              "category": "Estrategia",
              "thumbnails": "../img/catan.jpg",
              "__v": 0
            },
            {
              "title": "Carcassonne",
              "description": "Juego de colocación de losetas donde los jugadores construyen ciudades y caminos.",
              "code": "CAR234",
              "price": 35,
              "status": true,
              "stock": 15,
              "category": "EuroGame",
              "thumbnails": "../img/images.jfif",
              "__v": 0
            },
            {
              "title": "Terraforming Mars",
              "description": "Juego donde los jugadores controlan corporaciones que terraforman Marte.",
              "code": "TM345",
              "price": 60,
              "status": true,
              "stock": 5,
              "category": "EuroGame",
              "thumbnails": "../img/Terraforming Mars.jfif",
              "__v": 0
            },
            {
              "title": "Azul",
              "description": "Juego de colocación de fichas basado en la creación de patrones decorativos.",
              "code": "AZ456",
              "price": 30,
              "status": true,
              "stock": 8,
              "category": "Abstracto",
              "thumbnails": "../img/Azul.jpg",
              "__v": 0
            },
            {
              "title": "Gloomhaven",
              "description": "Juego de aventura y combate táctico con una rica narrativa.",
              "code": "GH567",
              "price": 120,
              "status": true,
              "stock": 3,
              "category": "Cooperativo",
              "thumbnails": "../img/Gloomhaven.jpg",
              "__v": 0
            },
            {
              "title": "Pandemic",
              "description": "Juego cooperativo donde los jugadores trabajan juntos para detener enfermedades globales.",
              "code": "PAN678",
              "price": 40,
              "status": true,
              "stock": 12,
              "category": "Cooperativo",
              "thumbnails": "../img/Pandemic.jpg",
              "__v": 0
            },
            {
              "title": "7 Wonders",
              "description": "Juego de construcción de civilizaciones en el que los jugadores desarrollan maravillas del mundo.",
              "code": "7W789",
              "price": 45,
              "status": true,
              "stock": 9,
              "category": "EuroGame",
              "thumbnails": "../img/Wonders.jpg",
              "__v": 0
            },
            {
              "title": "Ticket to Ride",
              "description": "Juego de construcción de rutas ferroviarias a través de diferentes regiones.",
              "code": "TTR890",
              "price": 40,
              "status": true,
              "stock": 20,
              "category": "Clasico",
              "thumbnails": "../img/Ticket to Ride.jpg",
              "__v": 0
            },
            {
              "title": "Agricola",
              "description": "Juego de gestión de recursos en el que los jugadores administran una granja.",
              "code": "AGR901",
              "price": 55,
              "status": true,
              "stock": 6,
              "category": "EuroGame",
              "thumbnails": "../img/Agricola.jpg",
              "__v": 0
            },
            {
              "title": "Dominion",
              "description": "Juego de construcción de mazos donde los jugadores buscan construir su reino.",
              "code": "DOM012",
              "price": 35,
              "status": true,
              "stock": 11,
              "category": "Estrategia",
              "thumbnails": "../img/Dominion.jpg",
              "__v": 0
            },
            {
              "title": "Mage Knight",
              "description": "Juego de aventura y exploración en un mundo de fantasía.",
              "code": "MK123",
              "price": 90,
              "status": true,
              "stock": 4,
              "category": "Solitario",
              "thumbnails": "../img/Mage Knight.jpg",
              "__v": 0
            },
            {
              "title": "The Castles of Burgundy",
              "description": "Juego de estrategia donde los jugadores construyen asentamientos y desarrollan su región.",
              "code": "COB234",
              "price": 45,
              "status": true,
              "stock": 7,
              "category": "EuroGame",
              "thumbnails": "../img/The Castles of Burgundy.jpg",
              "__v": 0
            },
            {
              "title": "Root",
              "description": "Juego de guerra asimétrico donde varias facciones luchan por el control de un bosque.",
              "code": "ROO345",
              "price": 65,
              "status": true,
              "stock": 5,
              "category": "Estrategia",
              "thumbnails": "../img/Root.jpg",
              "__v": 0
            },
            {
              "title": "Spirit Island",
              "description": "Juego cooperativo donde los jugadores encarnan espíritus que defienden su isla de los invasores.",
              "code": "SI456",
              "price": 70,
              "status": true,
              "stock": 6,
              "category": "Cooperativo",
              "thumbnails": "../img/Spirit Island.jpg",
              "__v": 0
            },
            {
              "title": "Scythe",
              "description": "Juego de estrategia en un universo dieselpunk donde los jugadores controlan mechs y territorios.",
              "code": "SCY567",
              "price": 75,
              "status": true,
              "stock": 8,
              "category": "Estrategia",
              "thumbnails": "../img/Scythe.jpg",
              "__v": 0
            }
          ]
          

    ) */

//---- Routers 
app.use('/', routerProduct);
//app.use('/cart', routerCart);

app.get('/newProduct', (req, res)=>{
    res.render('newProduct');
})


app.use('/cart', routerCart);
//app.use('/cart', routerCart);


