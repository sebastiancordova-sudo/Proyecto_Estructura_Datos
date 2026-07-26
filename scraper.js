// scraper.js
// Simula el scraping de un sitio de e-commerce (o consume uno real con axios+cheerio)
// y transforma el resultado en una lista plana de productos listos para insertarse en el BST.

const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Realiza scraping real de una página HTML pública.
 * Ajusta los selectores CSS según el sitio que vayas a scrapear.
 */
async function scrapearSitio(url) {
    try {
        const { data: html } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' } // evita bloqueos básicos
        });
        const $ = cheerio.load(html);

        const productos = [];

        // Ejemplo genérico: cada producto vive en un elemento .product
        $('.product').each((i, el) => {
            const nombre = $(el).find('.product-name').text().trim();
            const precioTexto = $(el).find('.price').text().trim();
            const categoria = $(el).find('.category').text().trim() || 'General';

            productos.push({
                id: Number(`${Date.now()}${i}`.slice(-9)), // ID numérico único
                nombre,
                precio: parseFloat(precioTexto.replace(/[^0-9.]/g, '')) || 0,
                categoria,
                subcategoria: null,
                disponible: true,
                fechaScrapeo: new Date().toISOString()
            });
        });

        return productos;
    } catch (error) {
        console.error('Error al scrapear:', error.message);
        return [];
    }
}

/**
 * Genera datos jerárquicos SIMULADOS (categoría -> subcategoría -> productos)
 * tal como los describe tu documento, útil para pruebas sin depender de internet.
 *
 * IMPORTANTE: usamos "baseId" (basado en Date.now()) en vez de arrancar
 * siempre desde 1000. Así, cada vez que se llama esta función —por ejemplo,
 * cada vez que el usuario da clic en "Ejecutar scraping"— se genera un rango
 * de IDs distinto al anterior. Esto evita que se inserten productos con IDs
 * duplicados en el árbol, lo que antes generaba un BST desbalanceado
 * (una especie de lista encadenada hacia la derecha) por culpa de los empates
 * en la comparación de insertarNodo().
 */
function generarDatosSimulados(cantidad = 20) {
    const categorias = ['Electrónica', 'Hogar', 'Ropa'];
    const subcategorias = {
        'Electrónica': ['Celulares', 'Laptops', 'Audio'],
        'Hogar': ['Cocina', 'Muebles'],
        'Ropa': ['Hombre', 'Mujer', 'Niños']
    };

    const productos = [];
    const baseId = Date.now() % 100000; // cambia en cada llamada, evita colisiones

    for (let i = 1; i <= cantidad; i++) {
        const categoria = categorias[Math.floor(Math.random() * categorias.length)];
        const subs = subcategorias[categoria];
        const subcategoria = subs[Math.floor(Math.random() * subs.length)];

        productos.push({
            id: baseId + i, // cada tanda de scraping usa un rango de IDs distinto
            nombre: `Producto ${baseId + i}`,
            precio: Math.round(Math.random() * 500 * 100) / 100,
            categoria,
            subcategoria,
            disponible: Math.random() > 0.2,
            fechaScrapeo: new Date().toISOString()
        });
    }
    return productos;
}

module.exports = { scrapearSitio, generarDatosSimulados };