import fs from 'fs/promises'; // Importación ES6 para fs.promises
import { v4 as uuidv4 } from 'uuid';
class ProductsManager {

  constructor() {
    this.filePath = '../src/data/products.json';
  }

  async crearProducto(producto) {
    producto.id = uuidv4()
    try {
      let productos = await this.leerProducto();
      productos.push(producto);
      await fs.writeFile(this.filePath, JSON.stringify(productos, null, 2));
      console.log('Producto creado exitosamente!');
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  }
  async leerProducto() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) || []; 
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        } else {
            console.error('Error al leer usuarios:', error);
            throw error; 
        }
    }
  }

  async eliminarProducto(idProducto) {
     
    try {
      console.log("Intentando eliminar producto " + idProducto);
      let productos = await this.leerProducto();
      const productoIndex = productos.findIndex(p => p.id === idProducto);
      
      if (productoIndex === -1) {
        console.error('El producto no existe');
        throw new Error('El producto no existe'); // Lanza un nuevo error con un mensaje
      }
      
      // Eliminar el producto del array
      productos.splice(productoIndex, 1);
  
      // Guardar los productos actualizados en el archivo
      await fs.writeFile(this.filePath, JSON.stringify(productos, null, 2));
      console.log('Producto eliminado exitosamente!');
  
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  }
  async editarProducto(idProducto, nuevosDatos) {
    try {
      // Leer todos los productos
      let productos = await this.leerProducto();

      // Encontrar el índice del producto a editar
      const productoIndex = productos.findIndex(producto => producto.id === idProducto);
      if (productoIndex === -1) {
        throw new Error('Producto no encontrado');
      }

      // Obtener el producto actual
      const productoActual = productos[productoIndex];

      // Actualizar solo los campos proporcionados
      const productoActualizado = {
        ...productoActual,
        ...nuevosDatos // Sobrescribe solo los campos proporcionados en nuevosDatos
      };

      // Actualizar el producto en el array
      productos[productoIndex] = productoActualizado;

      // Guardar los productos actualizados en el archivo
      await fs.writeFile(this.filePath, JSON.stringify(productos, null, 2));
      console.log('Producto actualizado exitosamente!');

      return productoActualizado;
    } catch (error) {
      console.error('Error al editar producto:', error);
      throw error;
    }
  }
}



export default ProductsManager