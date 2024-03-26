document.addEventListener("DOMContentLoaded", function () {
    window.electronAPI.enviarProductos('solicitarProductos');
});

document.addEventListener("DOMContentLoaded", function () {
    window.electronAPI.enviarProductos('solicitarPedidosPendientes');
});

window.electronAPI.recibirProductos('enviarProductos', (products) => {
    mostrarProductos(products);
});

window.electronAPI.recibirProductos('enviarProveedor', (proveedores) => {
    mostrarProveedores(proveedores);
});


function mostrarProductos(products) {
    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = products.map(product => `
        <tr>
            <td>${product.idDelProducto}</td>
            <td>${product.nombreDelProducto}</td>
            <td>${product.proveedor}</td>
            <td>${product.descripcion}</td>
            <td>${product.categoria}</td>
            <td>
                <span id="pendingOrders${product.idDelProducto}">Cargando...</span>
                <span id="valorExistencia${product.idDelProducto}">${product.existencia}</span>
                <input type="number" id="editarExistencia${product.idDelProducto}" style="display:none;">
            </td>
            <td>
                <button onclick="handleProductAction('edit', ${product.idDelProducto},'${product.nombreDelProducto}','${product.proveedor}','${product.descripcion}','${product.categoria}','${product.existencia}')">Editar</button>
                <button onclick="solicitarYMostrarProveedores('order', ${product.idDelProducto},'${product.nombreDelProducto}')">Procesar Orden</button>
            </td>
        </tr>
    `).join('');

    products.forEach(product => {
        window.electronAPI.enviarProductos('solicitarPedidosPendientes', { idDelProducto: product.idDelProducto });
    });    

    window.electronAPI.recibirProductos('enviarPedidosPendientes', (data) => {
        const pendingOrdersElement = document.getElementById(`pendingOrders${data.idDelProducto}`);
        if (pendingOrdersElement) {
            const quantity = data.results.length > 0 ? data.results.reduce((acc, item) => acc + item.cantidad, 0) : 0;
            pendingOrdersElement.textContent = quantity > 0 ? `(${quantity})` : 'No hay pedidos pendientes';
        }
    });
}    



function handleProductAction(action, id, nombre, proveedor, descripcion, categoria, existencia) {
    if (action === 'edit') {
        let params = new URLSearchParams({
            idDelProducto: id,
            nombreDelProducto: nombre,
            proveedor: proveedor,
            descripcion: descripcion,
            categoria: categoria,
            existencia: existencia
        });
        window.location.href = `edicionDeProductos.html?${params}`;
    }
}

function solicitarYMostrarProveedores(action, id, nombre) {
    if (action === 'order') {
        let params = new URLSearchParams({
            idDelProducto: id,
            nombreDelProducto: nombre
        });
        window.location.href = `pedidos.html?${params}`;
        mostrarProveedores();
        window.electronAPI.enviarProductos('solicitarProveedor', { idDelProducto: idDelProducto });
    }
}

function mostrarProveedores(proveedores) {
    const select = document.querySelector("#select-proveedor");

    select.innerHTML = "";

    proveedores.forEach(proveedor => {
        const option = document.createElement("option");
        option.textContent = proveedor.proveedor;
        select.appendChild(option);
    });
}
