import Clientes from './clientes.controller' 
import Proveedores from './proveedores.controller'
import notFound from './404.controller'
const pages ={
    clientes: Clientes,
    proveedores: Proveedores,
    notFound: notFound
}

export {pages};