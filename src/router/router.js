import {pages} from '../controllers/index'
let content= document.getElementById('root');

const router=(route)=>{
    content.innerHTML='';
    switch(route){
        case '#/Clientes':{
            return content.appendChild(pages.clientes());
        }
        case '#/Proveedores':
            return content.appendChild(pages.proveedores());
        default:
            return content.appendChild(pages.notFound());
        }
};

export{router};