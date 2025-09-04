import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  // State for selected image
  const [image, setImage] = useState(null);

  // State for product details
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });

  // Handle input changes
  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  // Add product function
  const Add_Product = async () => {
    try {
      if (!image) {
        alert("Please select an image before adding the product");
        return;
      }

      let product = { ...productDetails };

      // Upload image
      let formData = new FormData();
      formData.append('product', image);

      const uploadResp = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData, // no headers needed for FormData
      });

      const uploadData = await uploadResp.json();

      if (uploadData.success) {
        product.image = uploadData.image_url;

        // Add product to database
        const addResp = await fetch('http://localhost:4000/addproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });

        const addRespText = await addResp.text();

        try {
          const data = JSON.parse(addRespText);
          if (data.success) {
            alert("Product Added");
            // Reset form
            setProductDetails({
              name: "",
              image: "",
              category: "women",
              new_price: "",
              old_price: "",
            });
            setImage(null);
          } else {
            alert("Failed to add product");
          }
        } catch (err) {
          console.error("Server response is not JSON:", addRespText);
          alert("Server error occurred. Check console.");
        }
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Check console for details.");
    }
  };

  return (
    <div className='add-product'>
      <div className='add-product-item-fields'>
        <p>Product Title</p>
        <input
          type="text"
          name='name'
          placeholder='Type here'
          value={productDetails.name}
          onChange={changeHandler}
        />
      </div>

      <div className='add-product-price'>
        <div className='add-product-item-fields'>
          <p>Price</p>
          <input
            type="text"
            name="old_price"
            placeholder='Type here'
            value={productDetails.old_price}
            onChange={changeHandler}
          />
        </div>

        <div className='add-product-item-fields'>
          <p>Offer Price</p>
          <input
            type="text"
            name="new_price"
            placeholder='Type here'
            value={productDetails.new_price}
            onChange={changeHandler}
          />
        </div>
      </div>

      <div className='add-product-item-fields'>
        <p>Product Category</p>
        <select
          name="category"
          className='addproduct-selector'
          value={productDetails.category}
          onChange={changeHandler}
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className='add-product-item-fields'>
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt=""
            className='add_product-thumbnail-image'
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name='image'
          id='file-input'
          hidden
        />
      </div>

      <button className='add-product-btn' onClick={Add_Product}>
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
