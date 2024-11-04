import notFound from './404.controller'
import Clientes from './clientes.controller' 
import Proveedores from './proveedores.controller'
import Ventas from './ventas.controller'
import Res from './compraRes.controller'
import Menudo from './menudo.controller'

const pages ={
    notFound: notFound,
    clientes: Clientes,
    proveedores: Proveedores,
    ventas: Ventas,
    res: Res,
    menudo: Menudo
}

export {pages};