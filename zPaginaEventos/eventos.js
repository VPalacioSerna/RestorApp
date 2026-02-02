const URL_API = 'http://localhost:3000/eventos';

const reglasAntelacion = {
    'Reunión': 2,
    'Taller': 7,
    'Concierto': 15
};

// 1. Bloquear fechas según el tipo de evento
function actualizarFechaMinima() {
    const tipo = document.getElementById('tipoEvento').value;
    const inputFecha = document.getElementById('fechaEvento');
    
    let fechaMin = new Date();
    fechaMin.setDate(fechaMin.getDate() + reglasAntelacion[tipo]);
    
    const isoFecha = fechaMin.toISOString().split('T')[0];
    inputFecha.min = isoFecha;
    inputFecha.value = isoFecha; 
}

// 2. Traer eventos del servidor
async function obtenerEventos() {
    try {
        const res = await fetch(URL_API);
        const eventos = await res.json();
        renderizarEventos(eventos);
    } catch (error) {
        console.error("Error cargando eventos:", error);
    }
}

// 3. Agendar con validación de disponibilidad
async function agendarEvento() {
    const tipo = document.getElementById('tipoEvento').value;
    const fecha = document.getElementById('fechaEvento').value;

    if (!fecha) return alert("Selecciona una fecha");

    try {
        // VALIDACIÓN: Consultamos si ya existe esa fecha en el servidor
        const resConsulta = await fetch(`${URL_API}?fecha=${fecha}`);
        const coincidencias = await resConsulta.json();

        if (coincidencias.length > 0) {
            return alert(`Lo sentimos, el día ${fecha} ya está reservado para otro evento.`);
        }

        // Si la fecha está libre, enviamos el POST
        const nuevoEvento = { tipo, fecha };
        const resPost = await fetch(URL_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoEvento)
        });

        if (resPost.ok) {
            alert("¡Evento agendado con éxito!");
            obtenerEventos(); // Refrescar la lista
        }
    } catch (error) {
        console.error("Error al agendar:", error);
    }
}

// 4. Eliminar evento
async function eliminarEvento(id) {
    if (!confirm("¿Seguro que deseas cancelar este evento?")) return;

    try {
        await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
        obtenerEventos();
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}

// 5. Dibujar en pantalla
function renderizarEventos(eventos) {
    const lista = document.getElementById('listaEventos');
    // Ordenamos por fecha antes de mostrar
    eventos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    lista.innerHTML = eventos.map(ev => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span><strong>${ev.tipo}</strong> - ${ev.fecha}</span>
            <button class="btn btn-danger btn-sm" onclick="eliminarEvento('${ev.id}')">Cancelar</button>
        </li>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarFechaMinima();
    obtenerEventos();
});