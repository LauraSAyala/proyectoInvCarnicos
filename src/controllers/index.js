import notFound from './404.controller'
import Clientes from './clientes.controller' 
import Proveedores from './proveedores.controller'
import Ventas from './ventas.controller'
import Compras from './compras.controller'
import Res from './res.controller'
import Menudo from './menudo.controller'

const pages ={
    notFound: notFound,
    clientes: Clientes,
    proveedores: Proveedores,
    ventas: Ventas,
    compras: Compras,
    res: Res,
    menudo: Menudo
}

export {pages};