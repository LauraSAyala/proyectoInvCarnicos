import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './main.css'

import{router} from './router/router'
router(window.location.hash)
window.addEventListener('hashchange',()=>{
   router(window.location.hash)
})