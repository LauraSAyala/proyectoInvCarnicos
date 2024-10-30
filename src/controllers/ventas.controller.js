import view from '../views/ventas.html'
export default()=>{
    const divElement = document.createElement('div')
    divElement.innerHTML=view;

    return divElement;
}