var form = document.querySelector('form');
var productQuantity = document.getElementById('product-quantity');
const back = document.getElementById('back-button');

back.addEventListener('click', function (event) {
    window.location.href = 'listadoDeProductos.html';
})


form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    var error = "";

    if (parseInt(productQuantity.value) <= 0 || isNaN(productQuantity.value)) {
        error += "Para hacer un pedido debe ser mayor a 0.\n";
    }

    if (error) {
        window.electronAPI.showAlert({
            type: 'error',
            title: 'Error',
            message: error,
        });
    } else {
        guardarCambios();
    }
});


function guardarCambios() {
    console.log("guardarCambios invoked");
    var productId = document.getElementById("product-id").value;
    var productName = document.getElementById("product-name").value;
    var productSupplier = document.getElementById("select-proveedor").value;
    var productStock = document.getElementById("product-quantity").value;
    var employeeId = localStorage.getItem('idEmpleado');

    window.electronAPI.send('sendOrder', {
        id: productId,
        name: productName,
        supplier: productSupplier,
        stock: productStock,
        employeeId: employeeId
    });

    console.log(productId, productName, productSupplier, productStock, employeeId)
}


document.addEventListener('DOMContentLoaded', (event) => {
    const params = new URLSearchParams(window.location.search);
    const idDelProducto = params.get('idDelProducto');
    const nombreDelProducto = params.get('nombreDelProducto');
    const idEmpleado = params.get('idEmpleado');

    const productIdField = document.getElementById('product-id');
    if (productIdField && idDelProducto) {
        productIdField.value = idDelProducto;
    }

    const nombreDelProductoField = document.getElementById('product-name');
    if (nombreDelProductoField && nombreDelProducto) {
        nombreDelProductoField.value = nombreDelProducto;
    }

    if (idDelProducto) {
        window.electronAPI.enviarProductos('solicitarProveedor', { idDelProducto: idDelProducto });
    }
});


window.electronAPI.recibirProductos('enviarProveedor', (proveedores) => {
    mostrarProveedores(proveedores);
});

function mostrarProveedores(proveedores) {
    console.log(proveedores);
    const selectProveedor = document.getElementById("select-proveedor");
    selectProveedor.innerHTML = "";

    proveedores.forEach((proveedor) => {
        let opcion = document.createElement("option");
        opcion.text = proveedor.proveedor;
        selectProveedor.appendChild(opcion);
    });
}

window.electronAPI.receive('pedidoResponse', (response) => {
    console.log("Respuesta recibida del proceso principal:", response);
    if (response.success) {
        console.log(response.message);
        alert("Pedido registrado con éxito.");
    } else {
        console.error(response.message);
        alert("Hubo un problema al registrar el pedido.");
    }
});

window.electronAPI.recibirProductUpdateResponse('orderResponse', (response) => {
    if (response.success) {
        window.location.href = 'listadoDeProductos.html';
    } else {
        window.electronAPI.showAlert({
            type: 'error',
            title: 'Update Error',
            message: "Ya existe un pedido para este producto.",
        });
    }
});

