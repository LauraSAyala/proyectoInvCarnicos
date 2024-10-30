import views from '../views/clientes.html';

export default () => {
    const divElement = document.createElement('div');
    divElement.innerHTML = views;

    const url = 'http://localhost:3001/clientes';
    const contenedor = divElement.querySelector('tbody');
    const modalCliente = new bootstrap.Modal(divElement.querySelector('#modalCliente'));
    const nombreCliente = divElement.querySelector('#nombre');
    const btnCrear = divElement.querySelector('#btnCrear');
    let opcion = '';
    let idForm = 0;
    let clientes = [];

    // Botón Crear
    btnCrear.addEventListener('click', () => {
        nombreCliente.value = '';
        modalCliente.show();
        opcion = 'crear';
    });

    const mostrarClientes = (clientes) => {
        let resultados = ''; // Define la variable 'resultados' como un string vacío
        contenedor.innerHTML = ''; // Limpia el contenedor antes de cargar nuevos datos
    
        clientes.forEach(cliente => {
            resultados += `
                <tr>
                    <td>${cliente.idcliente}</td>
                    <td>${cliente.nombrecliente}</td>
                    <td class="text-center">
                        <a class="btnEditar btn btn-primary">Editar</a>
                        <a class="btnBorrar btn btn-danger">Borrar</a>
                    </td>
                </tr>`;
        });
    
        contenedor.innerHTML = resultados; // Inserta los resultados en el contenedor
    };
    
    

    // Obtener clientes de la API
    const cargarClientes = async () => {
        try {
            const response = await fetch(url);
            clientes = await response.json();
            mostrarClientes(clientes);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
            alert('No se pudieron cargar los clientes.');
        }
    };
    cargarClientes();

    const formCliente = divElement.querySelector('form');
    formCliente.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cliente = { nombreCliente: nombreCliente.value };
        if (opcion === 'crear') {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cliente),
                });
                const nuevoCliente = await response.json();
                clientes.push(nuevoCliente);
                mostrarClientes(clientes);
            } catch (error) {
                console.error('Error al crear cliente:', error);
            }
        } else if (opcion === 'editar') {
            try {
                const response = await fetch(`${url}/${idForm}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cliente),
                });
                const clienteActualizado = await response.json();
                clientes = clientes.map(c => c.idcliente == idForm ? clienteActualizado : c);
                mostrarClientes(clientes);
            } catch (error) {
                console.error('Error al editar cliente:', error);
            }
        }
        modalCliente.hide();
    });

    // Procedimiento para Borrar y Editar con Delegación de Eventos
    const on = (element, event, selector, handler) => {
        element.addEventListener(event, e => {
            if (e.target.closest(selector)) {
                handler(e);
            }
        });
    };

    on(divElement, 'click', '.btnBorrar', async (e) => {
        const fila = e.target.closest('tr'); // Selecciona la fila actual
        const id = fila.firstElementChild.innerText; // Toma el ID del cliente de la primera columna

        if (confirm('¿Estás seguro de eliminar este cliente?')) {
            try {
                const response = await fetch(`${url}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    clientes = clientes.filter(cliente => cliente.idcliente != id);
                    mostrarClientes(clientes); // Actualiza la tabla sin recargar la página
                } else {
                    console.error('Error al eliminar el cliente:', response.statusText);
                    alert('Error al eliminar el cliente');
                }
            } catch (error) {
                console.error('Error en la solicitud de eliminación:', error);
            }
        }
    });

    on(divElement, 'click', '.btnEditar', (e) => {
        const fila = e.target.closest('tr');
        idForm = fila.firstElementChild.innerText;
        nombreCliente.value = fila.children[1].innerText;
        opcion = 'editar';
        modalCliente.show();
    });

    return divElement;
};
