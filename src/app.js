import express from'express';
import handlebars from'express-handlebars';
import __dirname from './utils.js';

//Importar los routes

import viewRouter from './routes/views.router.js'

//---------routers viejos
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';


//--------importar el constructor del servidor de sockets
import { Server } from 'socket.io';


// esta constante la uso para ambas entregas, así que la dejo arriba
const app = express();
 
//--------------------------------------------------------------------------------------------------
//------------------------------------------ preentrega 1
//--------------------------------------------------------


//Inicializar el servidor
app.listen(8080, () => {
    console.log("El servidor se encuentra escuchando, tal como era hasta la preentrega 01");
})

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//Implementar los routers 
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


//--------------------------------------------------------
//------------------------------------------ lo anterior era de preentrega 1
//---------------------------------------------------------------------------------------------------------
/* 

//-------- vamos a crear un servidor http para que tenga donde vivir el servidor socket
const httpServer = app.listen(8080, ()=>{
    console.log("El servidor se encuentra en el puerto 8080");
})


//---------- desde aca vamos a ser el SERVIDOR
// creamos un servidor de sockets que vive dentro de nuestro servidor HTTP
const io = new Server(httpServer)

//Configurar el motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views',__dirname + '/views');
app.set('view engine','handlebars');

// Cargamos la carpeta 'public' como nuestra carpeta de archivos estáticos
app.use(express.static(__dirname + '/public'));

//Usamos el enrutador para las vistas
app.use('/',viewRouter);


let messages = [] // aca voy guardando los mensajes

io.on('connection', socket =>{
    console.log('nuevo cliente conectado')

    //Desde aca escuchamos los eventos emitidos por el cliente
socket.on('message', (data)=>{ //aca se escucha message, tiene que coincidir el nombre!
    messages.push(data);

    //ahora se los envio a todos con la etiqueta messageLogs 

    io.emit('messageLogs', messages)
})

socket.on('userAuthenticated', user =>{
    //aca le emito al usuario el chat
    socket.emit('messageLogs', messages)

    //aca le digo a todos que esa persona entro al chat
    socket.broadcast.emit('newUserConected', user);
})

}) */