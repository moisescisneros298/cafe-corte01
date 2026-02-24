const titulo = document.getElementById("titulo");
const fecha = new Date().toLocaleDateString();
titulo.textContent = `Corte Huicho 1 - ${fecha}`;

const tablaBody = document.getElementById("tabla-body");
const totalFinalElemento = document.getElementById("total-final");

let productosGlobal = [];

fetch("db/productos.json")
    .then(response => response.json())
    .then(data => {
        productosGlobal = data;
        construirTabla(data);
    })
    .catch(error => console.error("Error cargando el JSON:", error));

function construirTabla(productos) {
    tablaBody.innerHTML = "";

    productos.forEach(producto => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>
                <input type="number" 
                       min="0" 
                       max="${producto.existencia}" 
                       value="0"
                       data-id="${producto.id}">
            </td>
            <td>$${producto.precio}</td>
            <td class="total-producto">$0</td>
        `;

        tablaBody.appendChild(fila);
    });

    activarEventos();
}

function activarEventos() {
    const inputs = document.querySelectorAll("input[type='number']");

    inputs.forEach(input => {
        input.addEventListener("input", actualizarTotales);
    });
}

function actualizarTotales() {
    let totalGeneral = 0;

    const filas = tablaBody.querySelectorAll("tr");

    filas.forEach(fila => {
        const input = fila.querySelector("input");
        const totalCelda = fila.querySelector(".total-producto");

        const id = parseInt(input.dataset.id);
        const producto = productosGlobal.find(p => p.id === id);

        const cantidad = parseInt(input.value) || 0;
        const total = cantidad * producto.precio;

        totalCelda.textContent = `$${total}`;
        totalGeneral += total;
    });

    totalFinalElemento.textContent = `$${totalGeneral}`;
}