const express = require("express");
const router = express.Router();
// admin controls import
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// router controls
const {
       createProduct,
       getProduct,
       getAllProduct,
       updateProduct,
       deleteProduct,
       addToWishlist,
       rating,
      } = require('../controller/productCtrl');

const {deleteImages,uploadImages} = require('../controller/uploadCtrl');

router.get( '/',(req,res)=>{res.send('Product home')} )

router.get( '/getallproduct', getAllProduct ) 
router.get( '/getproduct/:id', getProduct ) 

// add rating 
router.put( '/rating', authMiddleware,  rating )

// add wishlist 
router.put( '/addtowishlist', authMiddleware,  addToWishlist )

// 1st check is authendicated , 2nd check is admin
router.post( '/createproduct',authMiddleware , isAdmin, createProduct ) 
router.put( '/updateproduct/:id',authMiddleware,isAdmin, updateProduct )
router.delete( '/deleteproduct/:id',authMiddleware, isAdmin, deleteProduct )

router.put( '/upload_image/:id',authMiddleware,isAdmin, uploadImages )
router.delete( '/delete_image/:id',authMiddleware,isAdmin, deleteImages )


module.exports = router;