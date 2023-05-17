const express = require("express");
const {
    createUser,
    loginUserCtrl,
    getallUser,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    ForgetPasswordToken,
    resetPassword,
    loginAdmin,
    updateAddress,

    getWishlist,

    addToCart,
    getUserCart,
    remove_product_from_cart,

    applyCouponToCart,
    createNewOrder,
    getAllOrders,
    updateOrderStatus,
    getOrderByUserId

  } = require("../controller/userCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// ▶ user control start ========================================================

    //1) get user control home
      router.get("/", (req, res) =>res.send("user auth router home"));

    //2) user register
      router.post("/register", createUser);

    //3) user login
      router.post("/login", loginUserCtrl);

    //4) user login
      router.get("/getwishlist",authMiddleware, getWishlist);

    //5) update address
      router.put("/update-address",authMiddleware, updateAddress);

    //6) add to cart 
      router.post( '/addtocart', authMiddleware,  addToCart );

    //6) get user cart
      router.get( '/getusercart', authMiddleware,  getUserCart );

    //7) remove_product_from_cart
      router.delete( '/remove-product-from-cart', authMiddleware,  remove_product_from_cart );

    //8) apply-coupon-to-cart
      router.post( '/cart/apply-coupon-to-cart', authMiddleware,  applyCouponToCart );

    //9) createNewOrder
      router.post( '/cart/create-new-order', authMiddleware,  createNewOrder );

    //9) getAllOrders
      router.get( '/cart/get-all-orders', authMiddleware,  getAllOrders );


//◀ user control end =========================================================

//▶ common user control start=================================================

    //1) get refresh token cookie to keep login
    router.get("/refresh", handleRefreshToken);

    //2) login user update password
    router.put("/updatepassword", authMiddleware, updatePassword);

    //3) verify token and reset password throw link to email
    router.post("/forget-password-token", ForgetPasswordToken);
    
    //4) update new password token via
    router.put("/reset-password/:token", resetPassword);

    //5) logout
      router.get("/logout", logout);

//◀ common user control end===================================================


//▶ admin control start ======================================================

    //1) admin login
    router.post("/admin-login", loginAdmin);

    //2) get all user
    router.get("/all-users", authMiddleware, isAdmin, getallUser);

    //3) get single user
    router.get("/:id", authMiddleware, isAdmin, getUser);

    //4) block and unblock user - allow only admin
     router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
     router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
 
    //5) delete and edit user
    router.put("/edit-user", authMiddleware, isAdmin, updateUser);
    router.delete("/deleteuser/:id", authMiddleware, isAdmin, deleteUser);

    //6) update order status
    router.put( '/update-order-status/:id', authMiddleware, isAdmin,  updateOrderStatus );

//◀ admin control end ========================================================



module.exports = router;
