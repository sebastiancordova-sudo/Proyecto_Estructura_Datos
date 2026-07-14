class NodoArbol {
    constructor(valor) {
        this.valor = valor;
        this.izquierdo = null;
        this.derecho = null;
    }
}

class GreenBST {
    constructor() {
        this.raiz = null;
    }

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
}