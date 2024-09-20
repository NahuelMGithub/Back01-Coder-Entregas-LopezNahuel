/* Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Cual es tu nombre?",
    inputValidator: (value) => {
        return !value && 'Necesitas escribir un nombre para continuar'
    },
   
}).then(result => {
    user = result.value;
    document.getElementById('username').textContent = user;
    //aca voy a decirle a todo que me conecte. para que luego me muestre el chat 
    socket.emit('userAuthenticated', {user:user}); //solo le mando el nombre
}); */