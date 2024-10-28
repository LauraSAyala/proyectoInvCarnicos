import view from '../views/proveedores.html'
export default()=>{
    const divElement = document.createElement('div')
    divElement.innerHTML=view;

    return divElement;
}