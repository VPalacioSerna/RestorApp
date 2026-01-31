const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('password2');

// Función para obtener los valores actuales de los inputs
const getValues = () => ({
  name: nameInput.value.trim(),
  email: emailInput.value.trim(),
  password: passwordInput.value
});

const btnLogin = document.getElementById('btn-login');
const btnRegistro = document.getElementById('btn-registro'); 

const URL_API = 'http://localhost:3000/users';


//--------------------------------------------GET (Obtener datos)-----------------------------------------------------
//GET General
async function index() {
  try {
    const res = await fetch('');
    const data = await res.json();
    console.log('GET:', data);
  } catch (error) {
    console.error('Error en GET:', error);
  }
}

//Funcion para buscar por id
async function buscarPorId(id) {
  try {
    // La URL termina en /posts/1
    const respuesta = await fetch(`${URL_API}/${id}`);

    //Captura el error y lo lleva directamente al catch
    if (!respuesta.ok) throw new Error("No se encontró el registro");

    //Convierte la respuesta (el usuario) a un json
    //Me entrega todo el usuario
    const usuario = await respuesta.json();

    console.log('Persona encontrada' , usuario);
  } catch (error) {
    //Muestra el error que capturo en el if del try
    console.error(error.message);
  }
}
//buscarPorId(1);


//Funcion para buscar por dato especifico
async function buscarPorDato(email) {
  //Poner dentro de un try para validar errores
  try {  
    //Buscar el valor con el simbolo ? y el valor que se va a buscar
    const res = await fetch(`${URL_API}?email=${email}`);

    //Convierte a json y me entrega el array 
    const dato = await res.json();

    if (dato.length === 0) {
      console.log('No hay personas con ese email');       
    } else {
      console.log('El resultado es: ' , dato[0].password); //Se pone dato[0] para que entrege solo el array que busco o dato[0].email
    }
  }
  catch (error) {
    console.log('Hubo un problema: ' + error);    
  }
}
/*btnLogin.addEventListener('click', (e) => {
  e.preventDefault(); //para que la pagina no se recargue

  const currentValues = getValues(); //Trae los datos limpios
  buscarPorDato(currentValues.email); //Llama a la funcion
})*/




//--------------------------------------------POST (Crear datos)-----------------------------------------------------
//Funcion para crear un nuevo dato o recurso
async function crearPost(nameUser, emailUser, passwordUser) {
  try {
    const respuesta = await fetch(`${URL_API}`,{ 
      method: 'POST', //metodo que se esta usando para guardar info
      headers: { 
        'Content-Type': 'application/json' //le dice al cuerpo del doc. que va un archivo json
      }, 
      body: JSON.stringify({ //lo que va a llevar el paquete (la info)
        name: nameUser, 
        email: emailUser, 
        password: passwordUser
      }) 
    });

    if (!respuesta.ok) throw new Error("Error en el POST:"); //Si hay error sale
    const postCreado = await respuesta.json(); //La respuesta del servidor

    console.log("Creado con éxito:", postCreado);
  }
  catch (error) {
    console.error(error.message);
  }
}

// btnRegistro.addEventListener('click', (e) => {
//   e.preventDefault(); //para que la pagina no se recargue

//   const currentValues = getValues(); //Trae los datos limpios
//   crearPost(currentValues.name, currentValues.email, currentValues.password); //Llama a la funcion
// })





//--------------------------------------------PUT y PATCH (Actualizar valores)-----------------------------------------------------

// PUT (Reemplazo total de datos): guarda lo que se le envia, el resto lo elimina
async function reemplazoCompleto() {
  try {
    const res = await fetch(`${URL_API}`, { //Peticion a la api
      method: 'PUT', //especifica el metodo
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ //unicos datos que quedaran en el registro, el resto (si hay) los elimina
        name: 'Item actualizado',
        price: 150
      })
    });

    const data = await res.json(); //Respuesta
  } catch (error) {
    console.error('Error en PUT:', error);
  }
}


// PATCH (Reemplazo parcial): Envia solo los cambios, lo demas se conserva
async function reemplazoParcial() {
  try {
    const res = await fetch(`${URL_API}`, { //Peticion a la api
      method: 'PATCH', //especifica el metodo
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ //actualiza solo estos campos que se le enviaron
        name: 'Item actualizado',
        price: 150
      })
    });

    const data = await res.json(); //Respuesta
  } catch (error) {
    console.error('Error en PUT:', error);
  }
} 




//--------------------------------------------DELETE -----------------------------------------------------
//Funcion para eliminar por id
async function deleteData(id) {
  try {
    const res = await fetch(`${URL_API}/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      console.log(`DELETE: El id ${id} fue eliminado`);
    } else {
      if (!res.ok) throw new Error("Error en el DELETE:");
    }
  } catch (error) {
    console.error(error.message);
  }
}



