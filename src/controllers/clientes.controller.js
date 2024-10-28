import views from '../views/clientes.html';

export default () => {
    const divElement = document.createElement('div');
    divElement.innerHTML = views;

    const url = 'http://localhost:3001/clientes'; // URL para obtener clientes
    const contenedor = divElement.querySelector('tbody');
    let resultados = '';

    const modalCliente = new bootstrap.Modal(divElement.querySelector('#modalCliente'));
    const nombreCliente = divElement.querySelector('#nombre');
    const btnCrear = divElement.querySelector('#btnCrear');
    let opcion = '';

    btnCrear.addEventListener('click', () => {
        nombreCliente.value = ''; // Limpia el campo de nombre
        modalCliente.show(); // Muestra el modal
        opcion = 'crear'; // Establece la opción a crear
    });

    const mostrar = (clientes) => {
        resultados = ''; // Limpiar resultados antes de llenarlo
        clientes.forEach(cliente => {
            resultados +=
            `<tr>
                <td>${cliente.idcliente}</td>
                <td>${cliente.nombrecliente}</td>
                <td class="text-center">
                    <a class="btnEditar btn btn-primary">Editar</a>
                    <a class="btnBorrar btn btn-danger">Borrar</a>
                </td>
            </tr>`;
        });
        contenedor.innerHTML = resultados;
    };

    // Obtener clientes de la API
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta de la API'); // Manejo de errores de la respuesta
            return response.json();
        })
        .then(data => mostrar(data))
        .catch(error => {
            console.error('Error al obtener los clientes', error);
            alert('No se pudieron cargar los clientes.'); // Mensaje de error al usuario
        });

    const on =(element,event,selector,handler)=>{
        element.addEventListener(event, e =>{
            if(e.target.closest(selector)){
                handler(e)
            }
        })
    }
//Procedimiento Borrar
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.parentNode.parentNode;
    const id = fila.firstElementChild.innerHTML;

    alertify.confirm("¿Estás seguro de eliminar?",
        function () {
            fetch(`${url}/${id}`, { method: 'DELETE' })
                .then(response => {
                    if (!response.ok) throw new Error('Error al eliminar el cliente');
                    return response.json();
                })
                .then(() => location.reload())
                .catch(error => {
                    console.error('Error al eliminar el cliente', error);
                    alert('Error al eliminar el cliente');
                });
        },
        function () {
            alertify.error('Cancel');
        }
    );
});
//Procedimiento editar
let idForm=0
on(document,'click','.btnEditar',e =>{
    const fila=e.target.parentNode.parentNode
    idForm=fila.children[0].innerHTML
    const nombreForm=fila.children[1].innerHTML
    nombreCliente.value=nombreForm
    opcion='editar'
    modalCliente.show()
})

const formCliente = divElement.querySelector('form');
if (formCliente) {
    console.log('Formulario encontrado');
} else {
    console.error('Formulario no encontrado');
}

//procedimiento para crear o editar 
formCliente.addEventListener('submit', (e)=>{
    e.preventDefault()
    console.log('Opción actual:', opcion);
    if(opcion==='crear'){
        console.log('OPCION CREAR')
    }
    if(opcion==='editar'){
        console.log('OPCION EDITAR')
    }
    modalCliente.hide()
})
    return divElement;
};

