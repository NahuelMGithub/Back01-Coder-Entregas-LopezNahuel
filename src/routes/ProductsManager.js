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
}

export default ProductsManager