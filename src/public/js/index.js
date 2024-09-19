const socket = io(); // del lado del cliente
let user; //identificador del cliente
let chatBox = document.getElementById('chatbox');

// ni bien me logueo
Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Cual es tu nombre?",
    inputValidator: (value) => {
        return !value && 'Necesitas escribir un nombre para continuar'
    },
    allowOutsideClick: false // para evitar que pueda hacer clcik afuera
}).then(result => {
    user = result.value;
    document.getElementById('username').textContent = user;
    //aca voy a decirle a todo que me conecte. para que luego me muestre el chat 
    socket.emit('userAuthenticated', {user:user}); //solo le mando el nombre
});

//Escucho si se conecta un usuario nuevo.
socket.on('newUserConected', username=>{
    Swal.fire({
         text: "Nuevo usuario conectado",
         toast: true,
        position: "top-right",
        icon: "info",
        title: `${username.user} se ha unido al chat`,
        timer: 5000
    });
})

//Event listener para el imput del chat
chatBox.addEventListener('keyup', (evt) => {
    if (evt.key === 'Enter') {
             
        if (chatBox.value.trim().length) {
            socket.emit('message', { user: user, message: chatBox.value }); // asi emitimos el mensaje
            chatBox.value = '';// aca vacio el mensaje 
        }
    }
})

//Event listener para el imput del chat, marcando que esta tipeando
chatBox.addEventListener('input', () => {
    socket.emit('typing')
})



// aca  escucho el evento userList, para ver los usuarios conectados
socket.on('userList' , (data)=>{
    let userList = document.getElementById('userList');
    let userHtml = ""
    data.forEach(user => {
        userHtml += `${user.user} <br>`
    });
    userList.innerHTML = userHtml;
})

// aca  escucho el evento messageLogs, es decir, historial del chat
socket.on('messageLogs' , (data)=>{
    let log = document.getElementById('messageLogs');
    let messagesHtml = ""
    data.forEach(message => {
        messagesHtml += `${message.user} dice:  ${message.message}<br>`
    });
    log.innerHTML = messagesHtml;
})



socket.on('usuarioEscribiendo', (user)=>{
    let objetTyping = document.getElementById('typing');
    objetTyping.innerHTML = user.user + " esta escribiendo"
    
})






//---------- esto lo hago para que pueda dar opiniones. pero tambien
//voy a poner que se abra un cuadro y complete un producto
const btnOpinar = document.getElementById('opinar');
btnOpinar.addEventListener('click', () => {
    Swal.fire({
        title: "Good job!",
        text: "You clicked the button!",
        icon: "success"
    });
})

