import React from 'react'
import './DescriptionBox.css'


const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className='descriptionbox-navigator'>

        <div className='descriptionbox-nav-box'> Description </div>
        <div className='descriptionbox-nav-box fade'> Reviews (122) </div>
      </div>

      <div className='descriptionbox-description'>
        <p> Stay stylish and comfortable with our latest collection of men’s hoodies. 
          Designed with premium fabric and attention to detail, this hoodie is perfect for casual outings, workouts, or everyday wear. 
          Featuring a modern fit, adjustable hood, and durable zip closure, it combines functionality with fashion. 
          Pair it with jeans, joggers, or shorts for a versatile look that never goes out of style.</p>

         <p>Care Instructions: </p>

            <p> Machine wash cold with like colors

           Do not bleach

            Tumble dry low or hang dry

            Iron on low if needed (avoid logo/print area)</p>
      </div>

    </div>
  )
}

export default DescriptionBox
