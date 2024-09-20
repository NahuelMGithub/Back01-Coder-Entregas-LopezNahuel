import express from'express';
import handlebars from'express-handlebars';
import __dirname from './utils.js';

//--------------------Importar los routes

import homeViews from './routes/home.router.js'
import realTimeProducts  from './routes/realTimeProducts.router.js'

//--------importar el constructor del servidor de sockets
import { Server } from 'socket.io';

// esta constante la uso para ambas entregas, así que la dejo arriba
const app = express();
app.use(express.static(__dirname+ '/public'));



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
app.use('/',homeViews);
app.use('/realTimeProducts',realTimeProducts); 
/* app.use('/rea lTimeProducts',viewRouter); */





let messages = [] // aca voy guardando los mensajes
let users = [] // aca voy guardando los usuarios conectados

io.on('connection', socket =>{
    console.log('nuevo cliente conectado')

    //Desde aca escuchamos los eventos emitidos por el cliente
socket.on('message', (data)=>{ //aca se escucha message, tiene que coincidir el nombre!
    messages.push(data);

    //ahora se los envio a todos con la etiqueta messageLogs 

    io.emit('messageLogs', messages)
})

socket.on('userAuthenticated', user =>{

    //Almaceno el nombre de usuario por cliente
    users[socket.id] = user
    //emito lista de usuarios a todos
    io.emit('userList', Object.values(users)) // da la lista completa de los usuarios

    //aca le emito al usuario el chat
    socket.emit('messageLogs', messages)

    //aca le digo a todos que esa persona entro al chat
    socket.broadcast.emit('newUserConected', user);
})

   // aca  escucho cuando si alguien esta tipeando
     socket.on('typing' , ()=>{
    socket.broadcast.emit('usuarioEscribiendo', users[socket.id])
    
})


    // aca  escucho cuando se va un usuario
    socket.on('disconnect' , ()=>{
        delete users[socket.id]
        io.emit('userList', Object.values(users))
        
    })


}) 

