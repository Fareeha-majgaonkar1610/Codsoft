import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom';


const Item = (props) => {
  return (
    <div className='item'>
      <Link to={`/product/${props.id}`}> <img onClick={window.scrollTo(0,0)} src={props.image} alt="" />  </Link>
      {/* img onClick={window.scrollTo(0,0)} ( When we will click the related products in the bottom it will scroll above to open the selected item) */}

      <p> { props.name}</p>
      <div className='item-prices'>
        <div className='item-price-new'>
            ${props.new_price} {/* will be displayed on screen */}

        </div>
        
        <div className='item-price-old'>
            ${props.old_price}     {/* will be displayed on screen */}

        </div>
      </div>
    </div>
  )
}

export default Item
