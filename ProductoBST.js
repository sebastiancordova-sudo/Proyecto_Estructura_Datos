// ProductoBST.js
// Como GreenBST compara los valores directamente con < y >,
// envolvemos cada producto en una clase que define valueOf(),
// así "productoA < productoB" compara automáticamente por su ID
// SIN modificar tu clase original.

class ProductoNodo {
    constructor(producto) {
        this.producto = producto; // guardamos el objeto completo (nombre, precio, categoria...)
    }

    // JavaScript llama esto automáticamente en comparaciones (<, >, ===)
    valueOf() {
        return this.producto.id;
    }
}

module.exports = { ProductoNodo };