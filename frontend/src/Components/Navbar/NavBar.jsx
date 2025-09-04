import React, { useContext, useRef, useState } from 'react'
import './NavBar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import nav_dropdown from '../Assets/nav_dropdown.png'

const NavBar = () => {


    const [menu,setMenu] = useState("shop"); 
    {/* We have used useState so that when we click on Shop the hr tag will display there
and when on Men or Women or Kids the hr tag line will be displayed under them  */}

    const {getTotalCartItems} = useContext(ShopContext); {/* Cart logo icon */}
    const menuRef = useRef();


    {/* when the page is responsive it will show the menu-dropdown icon */ }
    const dropdown_toggle = (e)=> {
        menuRef.current.classList.toggle('nav-menu-visible')
        e.target.classList.toggle('open');


    }



  return (
    <div className='navbar'>
        <div className='nav-logo'>
            <img src={logo} alt="" />
            <p> SHOPPER</p>
        </div>


{/* hr tag is used under shop menu item  */}
{/* We have used useState so that when we click on Shop the hr tag will display there
and when on Men or Women or Kids the hr tag line will be displayed under them.
we have used ternary operator for that  */}
            <img src={nav_dropdown} onClick={dropdown_toggle} className='nav-dropdown' alt="" />
            <ul ref={menuRef} className='nav-menu'>
                <li onClick={()=>{setMenu("shop")}}> <Link to='/' style={{textDecoration: 'none'}}> Shop </Link>  {menu==="shop" ? <hr/> : <></> }</li>    
                <li onClick={()=>{setMenu("mens")}}> <Link to='/mens' style={{textDecoration: 'none'}}> Men </Link> {menu==="mens" ? <hr/> : <></> }</li>
                <li onClick={()=>{setMenu("womens")}}> <Link to='/womens' style={{textDecoration: 'none'}}> Women </Link> {menu==="womens" ? <hr/> : <></> }</li>
                <li onClick={()=>{setMenu("kids")}}> <Link to='/kids' style={{textDecoration: 'none'}}> Kids </Link> {menu==="kids" ? <hr/> : <></> }</li>

            </ul>

            <div className='nav-login-cart'>
            {localStorage.getItem('auth-token')
            ? <button onClick={()=> {localStorage.removeItem('auth-token'); window.location.replace('/')}}> Logout</button>
            : <Link to='/login'>  <button> Login</button> </Link>}

                
               <Link to='/cart'>  <img src={cart_icon} alt="" /> </Link> 
                <div className='nav-cart-count'> {getTotalCartItems()}  </div>
            </div>


      
    </div>
  )
}

export default NavBar
