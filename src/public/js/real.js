const socket = io(); // del lado del cliente


socket.on('actualizarProductos', (productos) => {
    let productosDiv = document.getElementById('productsContenedorDeTiempoReal');
    
    if (productosDiv) {
        productosDiv.innerHTML = ""; // Limpiar el contenedor
        
        // Agregar la fila
        const rowDiv = document.createElement('div');
        rowDiv.className = "row";

        productos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.className = "col-md-4"; // Cada card ocupa 1/3 del ancho de la pantalla

            productoDiv.innerHTML = `
                <div class="card mb-4 shadow-sm">
                    <img src="${producto.thumbnails || 'https://via.placeholder.com/150'}" class="card-img-top" alt="Imagen de ${producto.title}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.title}</h5>
                        <p class="card-text">${producto.description}</p>
                        <p class="card-text">Precio: $${producto.price}</p>
                        <p class="card-text">Stock: ${producto.stock}</p>
                        <p class="card-text">Categoría: ${producto.category}</p>
                        <p class="card-text">Estado: ${producto.status ? 'Disponible' : 'No disponible'}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Código: ${producto.code}</small>
                            <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${producto.id}')">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
            rowDiv.appendChild(productoDiv); // Agregar cada producto a la fila
        });

        productosDiv.appendChild(rowDiv); // Agregar la fila al contenedor
    } else {
        alert("No se pudo encontrar el contenedor de productos.");
    }
});




/////////////////////////////////////////////////



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
            `<input type="text" id="category" class="swal2-input" placeholder="Categoría del juego">`,
           
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
      

            if (!title || !description || !code || !price || !stock || !category) {
                Swal.showValidationMessage('Por favor, completa todos los campos');
                return false;
            }

            return {
                title,
                description,
                code,
                price,
                stock,
                category
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



function eliminarProducto(id){
    socket.emit('eliminarProductoPorId', id); // asi emitimos el mensaje

}

 

//Escucho si se crea un producto y aviso a todoso que se creo o si se elimino.

  socket.on('newProduct', producto=>{
    Swal.fire({
         text: "Nuevo producto creado ",
         toast: true,
        position: "top-right",
        icon: "info",
        title: `Se creo el juego ${producto.title}`,
        timer: 5000
    });
}) 

socket.on('productElimnate', idProducto=>{
    Swal.fire({
         text: "Producto Eliminado",
         toast: true,
        position: "top-right",
        icon: "info",
        title: `Se elimino el producto ${idProducto}`,
        timer: 5000
    });
}) 


