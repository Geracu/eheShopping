function eliminarCambios() {
    const params = new URLSearchParams(window.location.search);

    const fields = {
        'idDelProducto': 'product-id',
        'nombreDelProducto': 'product-name',
        'proveedor': 'product-supplier',
        'descripcion': 'product-description',
        'categoria': 'product-category',
        'existencia': 'product-stock',
    };

    Object.keys(fields).forEach((param) => {
        const value = params.get(param);
        const field = document.getElementById(fields[param]);
        if (field && value) {
            field.value = value;
        } else {
            console.log(`No funciona: ${param}`);
        }
    });
}

function guardarCambios() {
    console.log("guardarCambios invoked");
    var productId = document.getElementById("product-id").value;
    var productName = document.getElementById("product-name").value;
    var productSupplier = document.getElementById("product-supplier").value;
    var productDescription = document.getElementById("product-description").value;
    var productCategory = document.getElementById("product-category").value;
    var productStock = document.getElementById("product-stock").value;

    window.electronAPI.send('updateProduct', {
        id: productId,
        name: productName,
        supplier: productSupplier,
        description: productDescription,
        category: productCategory,
        stock: productStock
    });

    window.location.href = 'listadoDeProductos.html'
}

function regresar() {
    window.location.href = 'listadoDeProductos.html'
}




document.addEventListener('DOMContentLoaded', (event) => {
    const params = new URLSearchParams(window.location.search);

    const fields = {
        'idDelProducto': 'product-id',
        'nombreDelProducto': 'product-name',
        'proveedor': 'product-supplier',
        'descripcion': 'product-description',
        'categoria': 'product-category',
        'existencia': 'product-stock',
    };

    Object.keys(fields).forEach((param) => {
        const value = params.get(param);
        const field = document.getElementById(fields[param]);
        if (field && value) {
            field.value = value;
        } else {
            console.log(`No funciona: ${param}`);
        }
    });
});


window.electronAPI.receive('productUpdateResponse', (response) => {
    if (response.success) {
        console.log(response.message);
    } else {
        console.error(response.message);
    }
});