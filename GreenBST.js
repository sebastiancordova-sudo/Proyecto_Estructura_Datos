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
        if (!nodoActual) return null; // no existe

        // CORRECCIÓN: usamos Number(...) en ambos lados en vez de "===" directo.
        // nodoActual.valor puede ser un objeto ProductoNodo (que define valueOf()
        // devolviendo el id). El operador "===" NUNCA convierte un objeto a
        // primitivo, así que un número nunca sería igual a un objeto aunque su
        // valueOf() devuelva el mismo número. Al forzar Number() de ambos lados,
        // se dispara la conversión correctamente y la comparación funciona.
        if (Number(nodoActual.valor) === Number(valor)) return nodoActual; // encontrado

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

    // --- RECORRIDO INORDEN ---
    // Devuelve los productos ORDENADOS por su clave. Útil para listar
    // el catálogo completo ya clasificado.
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

    // --- EXPORTAR PARA EL FRONT ---
    // Convierte el árbol a un objeto plano {valor, izquierdo, derecho}
    // que luego usaremos para dibujarlo gráficamente en el frontend.
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