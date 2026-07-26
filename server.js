/**
 * server.js
 * API REST que conecta un scraper de productos con una estructura de datos BST (Árbol Binario de Búsqueda).
 */

const express = require('express');
const cors = require('cors');
const { GreenBST } = require('./GreenBST');
const { ProductoNodo } = require('./ProductoBST');
const { scrapearSitio, generarDatosSimulados } = require('./scraper');

const app = express();
// Habilita CORS para permitir peticiones desde el frontend
app.use(cors());
// Permite que la API entienda cuerpos de peticiones en formato JSON
app.use(express.json());

/**
 * Instancia única del árbol (Base de datos en memoria).
 * Importante: Los datos se perderán si el servidor se reinicia.
 */
const arbolProductos = new GreenBST();

/**
 * POST /api/scrapear
 * Ejecuta el scraping (real o simulado) y llena el árbol con los datos obtenidos.
 * Body esperado: { url: string, simulado: boolean, cantidad: number }
 */
app.post('/api/scrapear', async (req, res) => {
    const { url, simulado, cantidad } = req.body;

    let productos;
    if (simulado) {
        productos = generarDatosSimulados(cantidad || 20);
    } else {
        productos = await scrapearSitio(url);
    }

    // Envuelve cada producto en un nodo y lo inserta en el árbol BST
    productos.forEach(p => {
        arbolProductos.insertar(new ProductoNodo(p));
    });

    res.json({
        mensaje: `${productos.length} productos insertados en el BST`,
        total: productos.length
    });
});

/**
 * GET /api/productos/:id
 * Busca un producto específico por su ID. La búsqueda es rápida O(log n) gracias al BST.
 * Params: id (número)
 */
app.get('/api/productos/:id', (req, res) => {
    const id = Number(req.params.id);
    const nodo = arbolProductos.buscar(id); // Busca comparando el ID del producto

    if (!nodo) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(nodo.valor.producto);
});

/**
 * POST /api/productos
 * Permite insertar un producto manualmente en el árbol.
 * Body esperado: { id: number, ...otros_datos }
 */
app.post('/api/productos', (req, res) => {
    const producto = req.body;
    if (!producto.id) {
        return res.status(400).json({ mensaje: 'El producto necesita un id numérico' });
    }
    arbolProductos.insertar(new ProductoNodo(producto));
    res.status(201).json({ mensaje: 'Producto insertado', producto });
});

/**
 * DELETE /api/productos/:id
 * Elimina un producto del catálogo (árbol) buscando por su ID.
 * Params: id (número)
 */
app.delete('/api/productos/:id', (req, res) => {
    const id = Number(req.params.id);
    const existe = arbolProductos.buscar(id);

    if (!existe) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    arbolProductos.eliminar(id);
    res.json({ mensaje: `Producto ${id} eliminado` });
});

/**
 * GET /api/productos
 * Devuelve el catálogo completo. Usa un recorrido "in-orden" del árbol, 
 * lo que garantiza que los productos se devuelvan ordenados por su ID de menor a mayor.
 */
app.get('/api/productos', (req, res) => {
    const productos = arbolProductos.inOrden().map(pn => pn.producto);
    res.json({ total: productos.length, productos });
});

/**
 * GET /api/arbol
 * Devuelve la estructura jerárquica del árbol completa. 
 * Útil para renderizar representaciones visuales del BST en el frontend.
 */
app.get('/api/arbol', (req, res) => {
    const estructura = arbolProductos.exportarEstructura();
    
    // Función recursiva para limpiar los datos y enviar solo la info del producto en cada nodo
    const limpiar = (nodo) => {
        if (!nodo) return null;
        return {
            producto: nodo.valor.producto,
            izquierdo: limpiar(nodo.izquierdo),
            derecho: limpiar(nodo.derecho)
        };
    };
    res.json(limpiar(estructura));
});

// Inicialización del servidor
const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});