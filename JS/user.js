//1. Variables
//2. Funciones Api
//3. Funciones renderizar
//4. Funciones control de estado (limpiar, llenar)
//5. Funciones interaccion
//6. Funciones inicializadores


// URL APIs
const URL_API_USERS = 'http://localhost:3000/users';
const URL_API_PRODUCTOS = 'http://localhost:3000/products';
const URL_API_ORDERS = 'http://localhost:3000/orders';

//Cards
let listProducts = [];
let listOrders = [];
const containerCards = document.getElementById('container-cards'); //contiene las cards
const cartUser = document.getElementById('container-cart'); //Container your order

//Control de botones
const cleanOrder = document.getElementById('clean-order'); //Limpiar el carrito



//--------------Funciones de API

//Traer productos (llamar a get para renderizar)
async function getProducts() {
    try {
        const res = await fetch(`${URL_API_PRODUCTOS}`);
        listProducts = await res.json();
        renderProducts(listProducts);
    } catch (error) {
        console.log('Error al obtener los productos en user:', error);        
    }
}

//Crear orden
async function confirmOrder() {
    if (listOrders.length === 0) {
        alert('No hay productos seleccionados, elija la menos un producto');
        return;
    }

    const data = {
        userId: user.id, //FALTA TRAERLO DEL LOCAL
        date: new Date().toLocaleString(), //trae la fecha en el momento
        products: listOrders,
        total: listOrders.reduce((acc, p) => acc + Number(p.price), 0),
        status: "Delivered"
    };

    try {
        const res = await fetch(`${URL_API_ORDERS}`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }); 
        
        if (res.ok) {
            alert('Se ha creado la orden!');
            listOrders = []; //Limpriar la lista para empezar con otra orden  
            window.location = './infoUser.html';          
        } 
    } catch (error) {
        console.log('Error en crear producto: ', error);
    }
}

// Funcion para traer el usuario por id (GET)
async function buscarPorId(id) {
  try {
    const respuesta = await fetch(`${URL_API_USERS}/${id}`);

    if (!respuesta.ok) throw new Error("No se encontró el registro");

    const usuario = await respuesta.json();

    console.log('Persona encontrada: ' , usuario);
  } catch (error) {
    console.error(error.message);
  }
}

// Funcion para traer las ordenes del usuario actual (GET userID)




//--------------Funciones de Renderizar

//------------------------Sesion Productos
//Mostrar los productos
function renderProducts(list) {
    containerCards.innerHTML = '';

    if (list.length === 0) {
        containerCards.innerHTML = `
            <div class="col-12">
                <h5 class="text-danger text-center">No hay productos</h5>
            </div>
        `;
        return;
    }

    containerCards.innerHTML = list.map((p) => {
        return `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100">
                    <img class="card-img-top" src="${p.img}" alt="${p.nameProduct}" style="height: 180px; object-fit: cover;">

                    <div class="card-body d-flex flex-column p-3">
                        <div class="d-flex align-items-center justify-content-between my-2">                                        
                            <h5 class="card-title">${p.nameProduct}</h5>
                            <span class="small fw-bold text-success">$${Number(p.price).toFixed(2)}</span>
                        </div>
                        <p class="card-text">${p.description}</p>
                        <button type="button" class="btn btn-outline-secondary text-black w-100 m-auto" onclick="btnAddOrder('${p.id}')"><i class="fa-solid fa-cart-shopping me-2"></i>Add to order</button>
                    </div>
                </div>
            </div>
        `;
    }).join(""); //convertir a string
}


//------------------------Sesion carrito

// Esta funcion inicializa la card de las ordenes vacia a con productos
function initCartStructure() {
    cartUser.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-header d-flex justify-content-between bg-white border-0 pt-3">
                <h5 class="fw-bold">Your Order <span id="contador" class="badge bg-success rounded-circle">0</span></h5>
                <button type="button" class="btn btn-sm text-muted" onclick="clearCart()">Clear all</button>
            </div>
            
            <div id="cart-items-container" class="card-body">
                <!-- Aqui van las ordenes -->
            </div>

            <div class="card-footer bg-white border-0 pb-3">
                <div class="d-flex justify-content-between fw-bold my-3">
                    <span>Total</span>
                    <span id="cart-total" class="text-success">$0.00</span>
                </div>
                <button onclick="confirmOrder()" class="btn btn-success w-100 py-2 rounded-4 fw-bold shadow-sm">
                    Confirm Order <i class="fa-solid fa-arrow-right ms-2"></i>
                </button>
            </div>
        </div>
    `;
    
    renderCartItems();
}

//Esta funcion llena la card de las ordenes o si no hay muestra un mensaje
function renderCartItems() {
    const contador = document.getElementById('contador');
    const itemsContainer = document.getElementById('cart-items-container');
    const cartTotal = document.getElementById('cart-total');

    // Contador de ordenes
    contador.innerText = listOrders.length;

    //Si no hay productos muestra un mensaje diciendo que no hay ordenes
    if (listOrders.length === 0) {
        itemsContainer.innerHTML = `
            <div class="text-center p-3">
                <h5 class="text-muted">No hay órdenes en espera</h5>
            </div>
        `;
        cartTotal.innerText = `$0.00`;
        return;
    }

    // Si hay productos saca el total recorriendo la lista de ordenes y lo agrega en la card
    // despues pinta las ordenes

    //reduce -> recorre cada elemento y va guardando la informacion (precio en este caso) empieza desde ,0
    const total = listOrders.reduce((acumulador, p) => acumulador + Number(p.price), 0);
    cartTotal.innerText = `$${total.toFixed(2)}`;

    itemsContainer.innerHTML = listOrders.map((p, index) => `
        <div class="d-flex align-items-center mb-3 border-bottom pb-2">
            <img src="${p.img}" class="rounded-3 me-3" style="width: 45px; height: 45px; object-fit: cover;">
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                    <h6 class="mb-0 small fw-bold">${p.nameProduct}</h6>
                    <span class="small fw-bold">$${Number(p.price).toFixed(2)}</span>
                </div>
                <button type="button" class="btn p-0 small text-danger" style="font-size: 0.75rem;" onclick="removeProduct(${index})">
                    <i class="fa-solid fa-trash-can me-1"></i>Remover
                </button>
            </div>
        </div>
    `).join('');
}


//------------------------Sesion Perfil
// Funcion para renderizar la info del usuario


// Funcion para renderizar la lista de ordenes o compras hechas




//--------------Funciones de iteracion

//Funcion de boton añadir al carrito
function btnAddOrder(id){
    //buscar el producto
    const product = listProducts.find(p => String(p.id) === String(id));
    
    if (product) {
        listOrders.push(product);  //añade un producto
        initCartStructure(); //renderiza las ordenes
    } else {
        alert('Producto no encontrado, no se puede añadir al carrito')
    }
}
    
//Funcion para remover del carrito
function removeProduct(index){
    //array.splice(inicio, cantidadAEliminar)
    listOrders.splice(index, 1);
    initCartStructure();
}

//Funcion para limpiar todo el carrito
function clearCart(){
    alert('Se ha limpiado la sesion de ordenes!');
    listOrders = []; 
    initCartStructure();
}

function btnLogOut(){
    const session = localStorage.removeItem('sessionUser');    
}


//Inicializacion

document.addEventListener('DOMContentLoaded', () => {
    getProducts(); // Trae los productos de la API
    initCartStructure(); //Inicializa la card de las ordenes    
});



