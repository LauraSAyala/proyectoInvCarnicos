import view from '../views/menudo.html'
export default()=>{
    const divElement = document.createElement('div')
    divElement.innerHTML=view;

    return divElement;
}