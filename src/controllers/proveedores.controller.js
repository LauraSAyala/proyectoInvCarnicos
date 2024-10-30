import views from '../views/proveedores.html';

export default () => {
    const divElement = document.createElement('div');
    divElement.innerHTML = views;

    const url = 'http://localhost:3001/proveedores';
    const contenedor = divElement.querySelector('tbody');
    const modalProveedor = new bootstrap.Modal(divElement.querySelector('#modalProveedor'));
    const nombreProveedor = divElement.querySelector('#nombre');
    const btnCrear = divElement.querySelector('#btnCrear');
    let opcion = '';
    let idForm = 0;
    let proveedores = [];

    btnCrear.addEventListener('click', () => {
        nombreProveedor.value = '';
        modalProveedor.show();
        opcion = 'crear';
    });

    const mostrarProveedores = (proveedores) => {
        let resultados = '';
        proveedores.innerHTML = ''; // Limpia los datos previos en el contenedor
        proveedores.forEach(proveedores => {
            resultados += `
            <tr>
                <td>${proveedores.idproveedor}</td>
                <td>${proveedores.nombreproveedor}</td>
                <td class="text-center">
                    <a class="btnEditar btn btn-primary">Editar</a>
                    <a class="btnBorrar btn btn-danger">Borrar</a>
                </td>
            </tr>`;
        });
        contenedor.innerHTML = resultados;
    };
    

    const cargarProveedores = async () => {
        try {
            const response = await fetch(url);
            proveedores = await response.json();
            mostrarProveedores(proveedores);
        } catch (error) {
            console.error('Error al obtener los proveedores:', error);
            alert('No se pudieron cargar los proveedores.');
        }
    };
    cargarProveedores();

    const formProveedor = divElement.querySelector('form');
    formProveedor.addEventListener('submit', async (e) => {
        e.preventDefault();
        const proveedor = { nombreProveedor: nombreProveedor.value };

        if (opcion === 'crear') {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(proveedor),
                });
                const nuevoProveedor = await response.json();
                proveedores.push(nuevoProveedor);
                mostrarProveedores(proveedores);
            } catch (error) {
                console.error('Error al crear proveedor:', error);
            }
        } else if (opcion === 'editar') {
            try {
                const response = await fetch(`${url}/${idForm}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(proveedor),
                });
                const proveedorActualizado = await response.json();
                proveedores = proveedores.map(p => p.idproveedor == idForm ? proveedorActualizado : p);
                mostrarProveedores(proveedores);
            } catch (error) {
                console.error('Error al editar proveedor:', error);
            }
        }
        modalProveedor.hide();
    });

    const on = (element, event, selector, handler) => {
        element.addEventListener(event, e => {
            if (e.target.closest(selector)) {
                handler(e);
            }
        });
    };

    on(divElement, 'click', '.btnBorrar', async (e) => {
        const fila = e.target.closest('tr');
        const id = fila.firstElementChild.innerText;

        if (confirm('¿Estás seguro de eliminar este proveedor?')) {
            try {
                const response = await fetch(`${url}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    proveedores = proveedores.filter(proveedor => proveedor.idproveedor != id);
                    mostrarProveedores(proveedores);
                } else {
                    console.error('Error al eliminar el proveedor:', response.statusText);
                    alert('Error al eliminar el proveedor');
                }
            } catch (error) {
                console.error('Error en la solicitud de eliminación:', error);
            }
        }
    });

    on(divElement, 'click', '.btnEditar', (e) => {
        const fila = e.target.closest('tr');
        idForm = fila.firstElementChild.innerText;
        nombreProveedor.value = fila.children[1].innerText;
        opcion = 'editar';
        modalProveedor.show();
    });

    return divElement;
};
