/**
 * server.js
 * API REST para gestionar un BST de productos obtenidos por scraping.
 */

const express = require('express');
const cors = require('cors');

const { GreenBST } = require('./GreenBST');
const { ProductoNodo } = require('./ProductoBST');
const { scrapearSitio, generarDatosSimulados } = require('./scraper');

const app = express();

app.use(cors());
app.use(express.json());

const arbolProductos = new GreenBST();

/* ==========================================================
   SCRAPING
========================================================== */
app.post('/api/scrapear', async (req, res) => {

    const { url, simulado, cantidad } = req.body;

    let productos;

    if (simulado) {
        productos = generarDatosSimulados(cantidad || 20);
    } else {
        productos = await scrapearSitio(url);
    }

    // Limpiar el árbol antes de cargar nuevos datos
    arbolProductos.raiz = null;

    // Mezclar el orden de inserción
    for (let i = productos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [productos[i], productos[j]] = [productos[j], productos[i]];
    }

    console.log("Orden de inserción:");
    console.log(productos.map(p => p.id));

    productos.forEach(producto => {
        arbolProductos.insertar(new ProductoNodo(producto));
    });

    res.json({
        mensaje: `${productos.length} productos insertados en el BST`,
        total: productos.length
    });

});

/* ==========================================================
   BUSCAR PRODUCTO
========================================================== */
app.get('/api/productos/:id', (req, res) => {

    const id = Number(req.params.id);

    const nodo = arbolProductos.buscar(id);

    if (!nodo) {
        return res.status(404).json({
            mensaje: "Producto no encontrado"
        });
    }

    res.json(nodo.valor.producto);

});

/* ==========================================================
   INSERTAR MANUALMENTE
========================================================== */
app.post('/api/productos', (req, res) => {

    const producto = req.body;

    if (!producto.id) {
        return res.status(400).json({
            mensaje: "Debe proporcionar un ID."
        });
    }

    const existe = arbolProductos.buscar(producto.id);

    if (existe) {
        return res.status(400).json({
            mensaje: "Ya existe un producto con ese ID."
        });
    }

    arbolProductos.insertar(new ProductoNodo(producto));

    res.json({
        mensaje: "Producto insertado correctamente."
    });

});

/* ==========================================================
   ELIMINAR
========================================================== */
app.delete('/api/productos/:id', (req, res) => {

    const id = Number(req.params.id);

    const existe = arbolProductos.buscar(id);

    if (!existe) {
        return res.status(404).json({
            mensaje: "Producto no encontrado"
        });
    }

    arbolProductos.eliminar(id);

    res.json({
        mensaje: `Producto ${id} eliminado`
    });

});

/* ==========================================================
   LISTA ORDENADA (INORDEN)
========================================================== */
app.get('/api/productos', (req, res) => {

    const productos = arbolProductos
        .inOrden()
        .map(p => p.producto);

    res.json({
        total: productos.length,
        productos
    });

});

/* ==========================================================
   EXPORTAR ÁRBOL
========================================================== */
app.get('/api/arbol', (req, res) => {

    const estructura = arbolProductos.exportarEstructura();

    function limpiar(nodo) {

        if (!nodo) return null;

        return {
            producto: nodo.valor.producto,
            izquierdo: limpiar(nodo.izquierdo),
            derecho: limpiar(nodo.derecho)
        };
    }

    const arbol = limpiar(estructura);

    console.log("\n========== BST ==========");
    console.log(JSON.stringify(arbol, null, 2));
    console.log("=========================\n");

    res.json(arbol);

});

/* ==========================================================
   SERVIDOR
========================================================== */
const PUERTO = 3000;

app.listen(PUERTO, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`);
});