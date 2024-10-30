import {pages} from '../controllers/index'
let content= document.getElementById('root');

const router=(route)=>{
    content.innerHTML='';
    switch(route){
        case '#/Clientes':{
            return content.appendChild(pages.clientes());
        }
        case '#/Proveedores':{
            return content.appendChild(pages.proveedores());
        }
        case '#/Venta':{
            return content.appendChild(pages.ventas());
        }
        case '#/Compra':{
            return content.appendChild(pages.compras());
        }
        case '#/Res':{
            return content.appendChild(pages.res());
        }
        case '#/Menudo':{
            return content.appendChild(pages.menudo());
        }
        default:
            return content.appendChild(pages.notFound());
        }
};

export{router};