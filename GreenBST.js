// GreenBST.js
// Extiende tu clase base agregando las operaciones que necesita
// el sistema: buscar, eliminar y recorrer el árbol para exportarlo al front.

class NodoArbol {
    constructor(valor) {
        this.valor = valor;       // Aquí guardaremos el objeto producto completo
        this.izquierdo = null;
        this.derecho = null;
    }
}

class GreenBST {
    constructor() {
        this.raiz = null;
    }

    // --- INSERCIÓN (tal cual la diste, sin modificar) ---
    insertar(valor) {
        const nuevoNodo = new NodoArbol(valor);
        if (!this.raiz) {
            this.raiz = nuevoNodo;
        } else {
            this.insertarNodo(this.raiz, nuevoNodo);
        }
    }

    insertarNodo(nodoActual, nuevoNodo) {
        if (nuevoNodo.valor < nodoActual.valor) {
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

    // --- BÚSQUEDA ---
    // Recibe el valor (o clave de comparación) y devuelve el nodo o null.
    buscar(valor) {
        return this.buscarNodo(this.raiz, valor);
    }

    buscarNodo(nodoActual, valor) {
        if (!nodoActual) return null;               // no existe
        if (valor === nodoActual.valor) return nodoActual; // encontrado
        if (valor < nodoActual.valor) {
            return this.buscarNodo(nodoActual.izquierdo, valor);
        } else {
            return this.buscarNodo(nodoActual.derecho, valor);
        }
    }

    // --- ELIMINACIÓN ---
    eliminar(valor) { 
        this.raiz = this.eliminarNodo(this.raiz, valor);
    }

    eliminarNodo(nodoActual, valor) {
        if (!nodoActual) return null;

        if (valor < nodoActual.valor) {
            nodoActual.izquierdo = this.eliminarNodo(nodoActual.izquierdo, valor);
            return nodoActual;
        } else if (valor > nodoActual.valor) {
            nodoActual.derecho = this.eliminarNodo(nodoActual.derecho, valor);
            return nodoActual;
        } else {
            // Caso 1: nodo hoja (sin hijos)
            if (!nodoActual.izquierdo && !nodoActual.derecho) {
                return null;
            }
            // Caso 2: un solo hijo
            if (!nodoActual.izquierdo) return nodoActual.derecho;
            if (!nodoActual.derecho) return nodoActual.izquierdo;

            // Caso 3: dos hijos -> buscamos el sucesor (mínimo del subárbol derecho)
            let sucesor = nodoActual.derecho;
            while (sucesor.izquierdo) {
                sucesor = sucesor.izquierdo;
            }
            nodoActual.valor = sucesor.valor; // copiamos el valor del sucesor
            // eliminamos el sucesor de su posición original
            nodoActual.derecho = this.eliminarNodo(nodoActual.derecho, sucesor.valor);
            return nodoActual;
        }
    }
}
