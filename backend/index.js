// Initialize dependencies and modules
const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const jwt = require("jsonwebtoken");

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://fareehamm_db_user:3tFZTxckUCSoe7oK@cluster0.ykyrekz.mongodb.net/e-commerce"
    );
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
connectDB();

// Root endpoint
app.get("/", (req, res) => {
  res.send("Express App is running");
});

// Create folder for images if it doesn't exist
const uploadPath = path.join(__dirname, "upload/images");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// Multer storage engine
const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Serve images statically
app.use("/images", express.static(uploadPath));

// Upload image endpoint
app.post("/upload", upload.single("product"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: 0, message: "No file uploaded" });
    }
    res.json({
      success: 1,
      image_url: `http://localhost:${port}/images/${req.file.filename}`,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: 0, error: err.message });
  }
});

// Mongoose product schema
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// Add product endpoint
app.post("/addproduct", async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name || !req.body.image || !req.body.new_price || !req.body.old_price) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let products = await Product.find({});
    let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const product = new Product({
      id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: Number(req.body.new_price),
      old_price: Number(req.body.old_price),
    });

    await product.save();
    console.log("Product saved:", product.name);

    res.json({ success: true, name: product.name });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Remove product endpoint
app.post("/removeproduct", async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed product id:", req.body.id);
    res.json({ success: true, id: req.body.id });
  } catch (err) {
    console.error("Remove product error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all products endpoint
app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    console.log("All products fetched");
    res.json(products);
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Schema creating for User model.
const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
});

// Creating endpoint for registering user
app.post("/signup", async (req, res) => {
  try {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      //checks if the user already have an existing account
      return res.status(400).json({ success: false, errors: "Existing User found with same email-id" });
      //because we have not created any account
    }

    //if there is  no existing account we will create an empty cart and will create the user
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    //create the user
    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });

    await user.save(); //save the user to the database

    // creating token using this
    const data = {
      user: {
        id: user.id,
      },
    };

    //create token
    const token = jwt.sign(data, "secret_ecom", { expiresIn: "24h" });
    res.json({ success: true, token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, errors: "Server error during signup", details: err.message });
  }
});

//creating endpoint for User Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, errors: "Email and password required" });
    }

    let user = await Users.findOne({ email });
    if (!user) return res.status(404).json({ success: false, errors: "Wrong Email-id" });

    const passCompare = password === user.password; // plain-text comparison
    if (!passCompare) return res.status(401).json({ success: false, errors: "Wrong Password" });

    const token = jwt.sign({ user: { id: user.id } }, "secret_ecom", { expiresIn: "24h" });
    res.json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, errors: "Server error during login" });
  }
});

//Creating endpoint for New collection
app.get('/newcollections',async (req,res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8)
  console.log("New Collection fetched");
  res.send(newcollection);  
})


// creating endpoint for popular in women category
app.get('/popularinwomen', async (req,res) => {
  let products = await Product.find({category:"women"});
  let popular_in_women = products.slice(0,4); //no. of products
  console.log("Popular in women Fetched");
  res.send(popular_in_women);
  
})

// Middleware to authenticate user via JWT
const fetchUser = (req, res, next) => {
  const token = req.header('auth-token');
  console.log("Token received:", token); // Debug: check if token is sent

  if (!token) {
    // No token provided
    return res.status(401).json({ success: false, errors: "Please authenticate using valid token" });
  }

  try {
    // Verify token
    const data = jwt.verify(token, 'secret_ecom');
    console.log("Token valid, user:", data.user); // Debug: token decoded successfully

    req.user = data.user; // Attach user info to request
    next(); // Continue to next middleware / route
  } catch (err) {
    console.error("Invalid token:", err.message); // Debug: token verification failed
    return res.status(401).json({ success: false, errors: "Please authenticate using valid token" });
  }
};


// Creating endpoint for adding products in databse in cart data
app.post('/addtocart', fetchUser, async (req, res) => {
   console.log("added",req.body.itemId);
 let userData = await Users.findOne({_id:req.user.id});
 userData.cartData[req.body.itemId] += 1;
 await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
 res.send("Added")
  
});


// Creating endpoint to remove product from cart data
app.post('/removefromcart',fetchUser,async (req,res) => {
  console.log("removed",req.body.itemId);
   let userData = await Users.findOne({_id:req.user.id});
   if(userData.cartData[req.body.itemId] > 0 )
 userData.cartData[req.body.itemId] -= 1;
 await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
 res.send("Removed")
  
});


// Creating endpoint to get cartdata after login
app.post('/getcart',fetchUser,async (req,res) => {
  console.log("GetCart");
  let userData =  await Users.findOne({_id:req.user.id});
  res.json(userData.cartData);

  
})
  

// Start server
app.listen(port, () => {
  console.log("Server running on port " + port);
});
