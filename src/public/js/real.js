const socket = io(); // del lado del cliente

let user; //identificador del cliente
let chatBox = document.getElementById('chatbox');



//--------------- ni bien me conecto tiene que mostrar todos los productos

/*
ade mas tiene que escuchar:
si creo o borro uno. 
si lo hace, debe modificar la  la lista y ac tualizarla.
*/


//-------------- boton para agregar producto

/*
1) validar datos, si estan todos 
va a emitir un mensaje con un objeto:
desde el servidor lo va a escuchar, va a agregar a  l a lista y luego va  renderizar 



cuando alguien crea un producto, me gustari ademas que aparezca un producto creado, igual que era
con usuario creado> LISTO
*/


//-------- Boton para crear un producto.
const btnAgregarProducto = document.getElementById('agregarProducto');
btnAgregarProducto.addEventListener('click', () => {
    Swal.fire({
        title: 'Agregar Producto',
        html:
            `<input type="text" id="title" class="swal2-input" placeholder="Título del juego">` +
            `<input type="text" id="description" class="swal2-input" placeholder="Descripción del juego">` +
            `<input type="text" id="code" class="swal2-input" placeholder="Código del juego">` +
            `<input type="number" id="price" class="swal2-input" placeholder="Precio del juego">` +
            `<input type="number" id="stock" class="swal2-input" placeholder="Stock disponible">` +
            `<input type="text" id="category" class="swal2-input" placeholder="Categoría del juego">` +
            `<input type="text" id="thumbnails" class="swal2-input" placeholder="URL de la imagen (thumbnail)">`,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        preConfirm: () => {
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const code = document.getElementById('code').value;
            const price = document.getElementById('price').value;
            const stock = document.getElementById('stock').value;
            const category = document.getElementById('category').value;
            const thumbnails = document.getElementById('thumbnails').value;

            if (!title || !description || !code || !price || !stock || !category || !thumbnails) {
                Swal.showValidationMessage('Por favor, completa todos los campos');
                return false;
            }

            return {
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const productData = result.value;
            console.log('Producto agregado:', productData);

            // Emitir el evento al socket
            socket.emit('productocreado', productData);

            // Aquí puedes agregar la lógica para guardar o procesar el producto
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            console.log('Acción cancelada');
        }
    });
});





 

//Escucho si se crea un producto y aviso a todoso que se creo.

 socket.on('newProduct', data=>{
    Swal.fire({
         text: "Nuevo producto creador ",
         toast: true,
        position: "top-right",
        icon: "info",
        title: `Se creo el juego ${data.title}`,
        timer: 5000
    });
}) 


    /////////////----------------------------- escuchando
/* 

//Event listener para el imput del chat
chatBox.addEventListener('keyup', (evt) => {
    if (evt.key === 'Enter') {
             
        if (chatBox.value.trim().length) {
            socket.emit('message', { user: user, message: chatBox.value }); // asi emitimos el mensaje
            chatBox.value = '';// aca vacio el mensaje 
        }
    }
})



// aca  escucho el evento messageLogs

socket.on('messageLogs' , (data)=>{
    let log = document.getElementById('messageLogs');
    let messagesHtml = ""
    data.forEach(message => {
        messagesHtml += `${message.user} dice:  ${message.message}<br>`
    });
    log.innerHTML = messagesHtml;
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

*/