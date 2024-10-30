import view from '../views/res.html'
export default()=>{
    const divElement = document.createElement('div')
    divElement.innerHTML=view;

    return divElement;
}