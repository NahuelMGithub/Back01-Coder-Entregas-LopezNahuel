import fs from 'fs/promises'; // Importación ES6 para fs.promises

class ProductsManager {

  constructor() {
    this.filePath = '../products.json';
  }

  async crearProducto(producto) {
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

  async eliminarProducto(idProducto){
    try{
      let productos = await this.leerProducto();
      const productoIndex = productos.findIndex(producto => producto.id === idProducto);
      if (productoIndex === -1) {
        console.error('El producto no existe', error);
        throw error;
    }
    // Eliminar el producto del array
    productos.splice(productoIndex, 1);

    // Guardar los productos actualizados en el archivo
    await fs.writeFile(this.filePath, JSON.stringify(productos, null, 2));
    console.log('Producto eliminado exitosamente!');

    }
    catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  }
}

export default ProductsManager