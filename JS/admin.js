const URL_API = 'http://localhost:3000/products';  

const inputImg = document.getElementById('inputImg');
const inputName = document.getElementById('inputName');
const inputDescription = document.getElementById('inputDescription');
const inputPrice = document.getElementById('inputPrice');

//Lista de elementos
const tbody = document.getElementById('tbody'); 
let listProducts = [];

//Control de botones
const btnguardarProducto = document.getElementById('guardarProducto');
let currentMode = 'CREATE'; // Puede ser: 'CREATE', 'EDIT', o 'VIEW'
let productInEdition = null;



//----------------------------------------------------Inicializacion
document.addEventListener('DOMContentLoaded', getProducts);


//----------------------------------------------------Funciones de API

//Traer productos (llamar a get para renderizar)
async function getProducts() {
    try {
        const res = await fetch(`${URL_API}`);
        listProducts = await res.json();
        //muestra
        renderProducts(listProducts);
    } catch (error) {
        console.log('Error al obtener los productos:', error);        
    }
}

//Crear producto
async function createProduct(data) {
    try {
        const res = await fetch(`${URL_API}`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });   

    } catch (error) {
        console.log('Error en crear producto: ', error);
    }
}

//Editar producto
async function updateProduct(id, data) {
    try {
        const res = await fetch(`${URL_API}/${id}`, {
            method: 'PATCH', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })      

    } catch (error) {
        console.log('Error en actualizar producto: ', error);
    }
}

//Eliminar producto
async function deleteProduct(id) {
    try {
        const res = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        })      
        if(res.ok) {
            return;
        } else {
            throw new Error("Error en eliminar: ");
            
        }
    } catch (error) {
        console.log(error.message);
    }
}


//----------------------------------------------------Funciones de Renderizar

//Mostrar los productos
function renderProducts(listProducts) {
    tbody.innerHTML = '';

    if (listProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-danger text-center">No hay productos</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = listProducts.map((p) => {
        return `
            <tr>
                <td>${p.id}</td>
                <td class=""><img class="rounded" src="${p.img}" alt="img-comida" style="width:60px;height:50px;object-fit:cover"></td>
                <td class="fw-bold">${p.nameProduct}</td>
                <td class="text-truncate" style="max-width: 150px;">${p.description}</td>
                <td>$${Number(p.price).toFixed(2)}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-info" onclick="infoProduct(${p.id})">Detalles</button>
                    <button class="btn btn-sm btn-outline-warning me-1" onclick="editProduct(${p.id})">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProductConfirm(${p.id})">Eliminar</button>
                </td>
            </tr>
        `;
    }).join(""); //convertir a string

}

//----------------------------------------------------Funciones de control de estado y formulario

// Función para limpiar todo y volver al estado inicial
function resetForm() {
    cleanForm();
    currentMode = 'CREATE';
    productInEdition = null;
    btnguardarProducto.innerText = "Guardar Producto";
}

// Función para llenar los datos que se mandan a la api
function fillForm(p) {
    inputImg.value = p.img;
    inputName.value = p.nameProduct;
    inputDescription.value = p.description;
    inputPrice.value = p.price;
}

//limpia los datos del formulario
function cleanForm() {
    inputName.value = '';
    inputDescription.value = '';
    inputPrice.value = '';
    inputImg.value = '';
}

//----------------------------------------------------Funciones de interaccion (botones de la tabla)

//Funcion para detalles
function infoProduct(id) {
    const product = listProducts.find(p => String(p.id) === String(id));
    if (product) {
        fillForm(product);
        currentMode = 'VIEW';
        btnguardarProducto.innerText = 'Cerrar detalles';
    }
}

//Funcion para editar
function editProduct(id) {
    const product = listProducts.find(p => String(p.id) === String(id));
    if (product) {
        fillForm(product);
        productInEdition = id;
        currentMode = 'EDIT';
        btnguardarProducto.innerText = 'Actualizar producto';
    }
}

// deleteProductConfirm(id) -> falta esta funcion
function deleteProductConfirm(id) {
    const product = listProducts.find(p => String(p.id) === String(id));
    if (product) {
        productInEdition = id;
        deleteProduct(id);
        alert('Producto Eliminado!')
        getProducts();
    }
}

//----------------------------------------------------Manejador principal (boton guardar)

//Manejo del guardado de datos
btnguardarProducto.addEventListener('click', async ()=> {
    //si esta en detalles
    if (currentMode === 'VIEW') {
        resetForm();
        return;
    }

    const productData = {
        img: inputImg.value,
        nameProduct: inputName.value,
        description: inputDescription.value,
        price: Number(inputPrice.value)
    };

    try {
        //si esta editando
        if (currentMode === 'EDIT') { //productInEdition tendria un id en este momento
            await updateProduct(productInEdition, productData);
            getProducts();
            alert('Producto actualizado!');
        }
        else {
            //si esta creando
            await createProduct(productData);
            getProducts();
            alert('Producto creado!');
            
        } 

        resetForm(); //quita toda la info del form y vuelve a los estados iniciales

    } catch (error) {
        console.log('Error');        
    }
}) 

