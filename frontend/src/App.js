
import './App.css';
import NavBar from './Components/Navbar/NavBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import LoginSignup from './Pages/LoginSignup';
import Product from './Pages/Product';   
import Cart from './Pages/Cart';   
import Footer from './Components/Footer/Footer'


import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kids_banner from './Components/Assets/banner_kids.png'
{/* and passed these banners below as props in ShopCategory tag */}


function App() {
  return (
    <div>

      <BrowserRouter>
      <NavBar />            {/* Now NavBar will be shown in all pages */}
      <Routes>

        <Route path='/' element={ <Shop/> }/> {/* This is the main HOME page */}
        <Route path='/mens' element={ <ShopCategory banner={men_banner} category="men"/> } /> {/* If someone will render "mens" path it will render ShopCategory Page */}  
        <Route path='/womens' element={ <ShopCategory banner={women_banner} category="women"/> } />
        <Route path='/kids' element={ <ShopCategory banner={kids_banner} category="kid"/> } />

        <Route path="product" element={<Product />}>
        <Route path=':productId' element={<Product/>} />

        </Route>


          <Route path='/cart' element={ <Cart/> }/>
          <Route path='/login' element={ <LoginSignup/> }/>

      </Routes>

      <Footer />



      </BrowserRouter>
          



     
      
    </div>
  );
}

export default App;
