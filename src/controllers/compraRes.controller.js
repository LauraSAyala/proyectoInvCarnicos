import views from '../views/compraRes.html';

export default () => {
    const divElement = document.createElement('div');
    divElement.innerHTML = views;

    const urlCompras = 'http://localhost:3001/compras';
    const urlDetalles = 'http://localhost:3001/detallesCompra';

    const contenedorCompras = divElement.querySelector('#tablaCompras');
    const contenedorDetalles = divElement.querySelector('#tablaDetalles');
    const btnGuardarCompraCompleta = divElement.querySelector('#btnGuardarCompraCompleta');
    const btnCrearCompra = divElement.querySelector('#btnCrearCompra');
    const mensajeCompraCreada = divElement.querySelector('#mensajeCompraCreada');

    const formCompra = divElement.querySelector('#formCompra');
    const fechaCompra = divElement.querySelector('#fechaCompra');
    const idProveedor = divElement.querySelector('#idProveedor');

    const formDetalleCompra = divElement.querySelector('#formDetalleCompra');
    const codigoRes = divElement.querySelector('#codigoRes');
    const peso = divElement.querySelector('#peso');
    const sexo = divElement.querySelector('#sexo');
    const precioKilo = divElement.querySelector('#precioKilo');
    const totalDetalle = divElement.querySelector('#totalDetalle');

    let detallesCompra = [];
    let idCompraActual = null;

     // Cargar las compras guardadas
    const cargarCompras = async () => {
        try {
            const response = await fetch(urlCompras);
            const compras = await response.json();
            let comprasHtml = '';
            compras.forEach(compra => {
                comprasHtml += `
                    <tr>
                        <td>${compra.idcompra}</td>
                        <td>${compra.fechacompra}</td>
                        <td>${compra.nombreproveedor}</td>
                        <td>${compra.totalcompra}</td>
                        <td>
                            <button class="btn btn-info btnDetalles" data-id="${compra.idcompra}">Ver Detalles</button>
                            <button class="btn btn-danger btnEliminar" data-id="${compra.idcompra}">Eliminar</button>
                        </td>
                    </tr>`;
            });
            contenedorCompras.innerHTML = comprasHtml;
        } catch (error) {
            console.error('Error al cargar compras:', error);
        }
    };

    // Función para calcular el total de un detalle
    const calcularTotalDetalle = () => {
        const pesoValue = parseFloat(peso.value) || 0;
        const precioKiloValue = parseFloat(precioKilo.value) || 0;
        totalDetalle.value = (pesoValue * precioKiloValue).toFixed(2);
    
        console.log("Total del Detalle Calculado:", totalDetalle.value); // Imprime el total en la consola
    };
    

    // Evento para calcular el total del detalle
    peso.addEventListener('input', calcularTotalDetalle);
    precioKilo.addEventListener('input', calcularTotalDetalle);

    // Función para cargar proveedores
    const cargarProveedores = async () => {
        try {
            const response = await fetch('http://localhost:3001/proveedores');
            const proveedores = await response.json();
            idProveedor.innerHTML = '<option value="">Selecciona un proveedor</option>';
            idProveedor.innerHTML += proveedores.map(proveedor => 
                `<option value="${proveedor.idproveedor}">${proveedor.nombreproveedor}</option>`
            ).join('');
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
        }
    };

    
    // Función para cargar sexos
    const cargarSexos = async () => {
        try {
            const response = await fetch('http://localhost:3001/sexos');
            const sexos = await response.json();
            sexo.innerHTML = '<option value="">Selecciona un sexo</option>';
            sexo.innerHTML += sexos.map(sexoItem => 
                `<option value="${sexoItem.idsexo}">${sexoItem.nsex}</option>`
            ).join('');
        } catch (error) {
            console.error('Error al cargar sexos:', error);
        }
    };

    // Crear la compra inicial
    btnCrearCompra.addEventListener('click', async () => {
        // No se necesita crear la compra aquí
        // En su lugar, solo debes habilitar el formulario para agregar detalles.
        formCompra.style.display = 'none'; // Oculta el formulario de compra
        formDetalleCompra.style.display = 'block'; // Muestra el formulario de detalles
        alert('Compra creada, ahora digita los detalles');
    });

    
    // Eliminar un detalle de la lista temporal
    window.eliminarDetalle = (index) => {
        detallesCompra.splice(index, 1);
        mostrarDetallesCompra();
    };

    // Agregar un detalle a la lista temporal de detalles
divElement.querySelector('#btnAgregarDetalle').addEventListener('click', async () => {
    // Verifica primero si el código de res existe
    const existe = await verificarCodigoRes(codigoRes.value);
    if (!existe) {
        // Si no existe, crea una nueva res
        const nuevaRes = {
            codigores: codigoRes.value,
            peso: peso.value, // Asegúrate de que estos valores sean correctos
            sexo: sexo.value,
        };
        
        const respuesta = await fetch('http://localhost:3001/res', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaRes),
        });

        if (respuesta.ok) {
            alert('Nueva res creada correctamente.');
        } else {
            alert('Error al crear la nueva res.');
            return; // Sale si hay un error
        }
    }

    // Después de asegurarte que la res existe (o se creó), agrega el detalle
    const detalle = {
        codigoRes: codigoRes.value,
        peso: peso.value,
        sexo: sexo.value,
        precioKilo: precioKilo.value,
        total: totalDetalle.value,
    };

    detallesCompra.push(detalle);
    mostrarDetallesCompra();
    formDetalleCompra.reset(); // Limpia el formulario de detalles
});

// Mostrar los detalles de compra en la tabla temporal
const mostrarDetallesCompra = () => {
    let detallesHtml = '';
    detallesCompra.forEach((detalle, index) => {
        detallesHtml += `
            <tr>
                <td>${detalle.codigoRes}</td>
                <td>${detalle.peso}</td>
                <td>${detalle.sexo}</td>
                <td>${detalle.precioKilo}</td>
                <td>${detalle.total}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="eliminarDetalle(${index})">Eliminar</button>
                </td>
            </tr>`;
    });
    contenedorDetalles.innerHTML = detallesHtml;
};


// Función para verificar si el código de res existe
const verificarCodigoRes = async (codigoRes) => {
    const response = await fetch(`http://localhost:3001/res/${codigoRes}`);
    return response.ok; // Devuelve true si el código de res existe
};


// Guardar la compra y los detalles en el servidor
btnGuardarCompraCompleta.addEventListener('click', async () => {
    if (detallesCompra.length === 0) {
        alert('Por favor, agrega al menos un detalle a la compra.');
        return;
    }

    try {
        // Guardar la compra antes de agregar detalles
        const compraGuardada = await fetch(urlCompras, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                fechaCompra: fechaCompra.value,
                idProveedor: idProveedor.value
            }),
        });
        
        const nuevaCompra = await compraGuardada.json();
        idCompraActual = nuevaCompra.idcompra; // Actualiza el ID de compra

        // Ahora guarda los detalles de la compra
        await Promise.all(detallesCompra.map(async (detalle) => {
            detalle.idCompra = idCompraActual; // Asegúrate de que el ID de compra esté presente
            await fetch(urlDetalles, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(detalle),
            });
        }));

        // Limpiar la lista de detalles y UI
        detallesCompra = [];
        mostrarDetallesCompra();
        cargarCompras(); // Recargar la tabla de compras
        formCompra.reset();
        formCompra.style.display = 'block';
        formDetalleCompra.style.display = 'none';
        mensajeCompraCreada.textContent = '';

    } catch (error) {
        console.error('Error al guardar detalles de la compra:', error);
        alert('Error al guardar los detalles de la compra.');
    }
});




    // Funcionalidad de eliminar compra
    divElement.addEventListener('click', async (event) => {
        if (event.target.classList.contains('btnEliminar')) {
            const idCompra = event.target.getAttribute('data-id');
            try {
                await fetch(`${urlCompras}/${idCompra}`, { method: 'DELETE' });
                cargarCompras();
            } catch (error) {
                console.error('Error al eliminar compra:', error);
                alert('Error al eliminar la compra.');
            }
        }
    });

    // Funcionalidad de ver detalles de una compra
    divElement.addEventListener('click', async (event) => {
        if (event.target.classList.contains('btnDetalles')) {
            const idCompra = event.target.getAttribute('data-id');
            try {
                const response = await fetch(`${urlDetalles}?idCompra=${idCompra}`);
                const detalles = await response.json();
                mostrarDetallesCompraEspecifica(detalles);
            } catch (error) {
                console.error('Error al cargar detalles:', error);
            }
        }
    });

    const mostrarDetallesCompraEspecifica = (detalles) => {
        let detallesHtml = '';
        detalles.forEach(detalle => {
            detallesHtml += `
                <tr>
                    <td>${detalle.codigores}</td>
                    <td>${detalle.peso}</td>
                    <td>${detalle.sexo}</td>
                    <td>${detalle.precio}</td>
                    <td>${detalle.totaldetalle}</td>
                </tr>`; 
        });
        contenedorDetalles.innerHTML = detallesHtml;
    };

   

    // Cargar datos iniciales
    cargarProveedores();
    cargarSexos();
    cargarCompras();

    return divElement;
};
