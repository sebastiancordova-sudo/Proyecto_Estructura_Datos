// GreenBST.js
// Implementación del Árbol Binario de Búsqueda (BST) utilizado por
// el sistema para insertar, buscar, eliminar y recorrer los productos.
//
// Cada nodo almacena un objeto ProductoNodo, el cual contiene el
// producto completo. Las comparaciones se realizan utilizando el ID
// del producto para garantizar un comportamiento consistente.

class NodoArbol {
    constructor(valor) {
        // Valor almacenado (ProductoNodo)
        this.valor = valor;

        // Referencias a los hijos
        this.izquierdo = null;
        this.derecho = null;
    }
}

class GreenBST {

    constructor() {
        this.raiz = null;
    }

    // ==========================================================
    // INSERCIÓN
    // Inserta un nuevo producto en el árbol utilizando el ID
    // como clave de comparación.
    // ==========================================================
    insertar(valor) {

        const nuevoNodo = new NodoArbol(valor);

        if (!this.raiz) {
            this.raiz = nuevoNodo;
        } else {
            this.insertarNodo(this.raiz, nuevoNodo);
        }

    }

    insertarNodo(nodoActual, nuevoNodo) {

        const idNuevo = nuevoNodo.valor.producto.id;
        const idActual = nodoActual.valor.producto.id;

        if (idNuevo < idActual) {

            if (!nodoActual.izquierdo) {
                nodoActual.izquierdo = nuevoNodo;
            } else {
                this.insertarNodo(nodoActual.izquierdo, nuevoNodo);
            }

        } else {

            if (!nodoActual.derecho) {
                nodoActual.derecho = nuevoNodo;
            } else {
                this.insertarNodo(nodoActual.derecho, nuevoNodo);
            }

        }

    }

    // ==========================================================
    // BÚSQUEDA
    // Busca un producto por su ID.
    // Devuelve el nodo encontrado o null.
    // ==========================================================
    buscar(id) {
        return this.buscarNodo(this.raiz, Number(id));
    }

    buscarNodo(nodoActual, id) {

        if (!nodoActual) return null;

        const idActual = nodoActual.valor.producto.id;

        if (id === idActual) {
            return nodoActual;
        }

        if (id < idActual) {
            return this.buscarNodo(nodoActual.izquierdo, id);
        }

        return this.buscarNodo(nodoActual.derecho, id);

    }

    // ==========================================================
    // ELIMINACIÓN
    // Elimina un producto del árbol utilizando su ID.
    // ==========================================================
    eliminar(id) {
        this.raiz = this.eliminarNodo(this.raiz, Number(id));
    }

    eliminarNodo(nodoActual, id) {

        if (!nodoActual) return null;

        const idActual = nodoActual.valor.producto.id;

        if (id < idActual) {

            nodoActual.izquierdo = this.eliminarNodo(
                nodoActual.izquierdo,
                id
            );

            return nodoActual;

        }

        if (id > idActual) {

            nodoActual.derecho = this.eliminarNodo(
                nodoActual.derecho,
                id
            );

            return nodoActual;

        }

        // ------------------------------------------------------
        // Caso 1: Nodo hoja
        // ------------------------------------------------------
        if (!nodoActual.izquierdo && !nodoActual.derecho) {
            return null;
        }

        // ------------------------------------------------------
        // Caso 2: Un solo hijo
        // ------------------------------------------------------
        if (!nodoActual.izquierdo) {
            return nodoActual.derecho;
        }

        if (!nodoActual.derecho) {
            return nodoActual.izquierdo;
        }

        // ------------------------------------------------------
        // Caso 3: Dos hijos
        // Se reemplaza por el sucesor inorden
        // (el menor del subárbol derecho).
        // ------------------------------------------------------
        let sucesor = nodoActual.derecho;

        while (sucesor.izquierdo) {
            sucesor = sucesor.izquierdo;
        }

        nodoActual.valor = sucesor.valor;

        nodoActual.derecho = this.eliminarNodo(
            nodoActual.derecho,
            sucesor.valor.producto.id
        );

        return nodoActual;

    }

    // ==========================================================
    // RECORRIDO INORDEN
    // Devuelve los productos ordenados ascendentemente por ID.
    // ==========================================================
    inOrden() {

        const resultado = [];

        const recorrer = (nodo) => {

            if (!nodo) return;

            recorrer(nodo.izquierdo);

            resultado.push(nodo.valor);

            recorrer(nodo.derecho);

        };

        recorrer(this.raiz);

        return resultado;

    }

    // ==========================================================
    // EXPORTAR ESTRUCTURA
    // Convierte el árbol en un objeto plano para ser enviado
    // al frontend y dibujado gráficamente.
    // ==========================================================
    exportarEstructura() {

        const convertir = (nodo) => {

            if (!nodo) return null;

            return {
                valor: nodo.valor,
                izquierdo: convertir(nodo.izquierdo),
                derecho: convertir(nodo.derecho)
            };

        };

        return convertir(this.raiz);

    }

}

module.exports = { GreenBST, NodoArbol };