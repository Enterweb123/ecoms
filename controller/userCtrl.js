// *) user model (db)
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModels");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");

//*)  union id generator packages
const uniqid = require("uniqid");

// *)Token gen functions import
const { generateToken } = require("../config/jwtToken");

// *)error handelr library
const asyncHandler = require('express-async-handler');

// *)check is user valid or not valid
const validateMongoDbId = require("../utils/validatemongodbid");

// *) referesh token gen
const generateRefreshToken = require("../config/refreshtoken");

// *) passwod hashing
const crypto = require('crypto');

// *) referesh token gen
const jwt = require('jsonwebtoken');
const sendEmail = require("./emailCtrl");


// --------------------------------------------------------------
//  1) create new user account
// --------------------------------------------------------------

const createUser = asyncHandler( async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });

    if (!findUser) {
        // create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    }
    else {
        // create already Exists - create error
        throw new Error('User Already Exists')
    }
} );


// --------------------------------------------------------------
//  2) Login user
// --------------------------------------------------------------

const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // console.log(email,password);
    // check if user exites or not 
    const findUser = await User.findOne({ email:email });

   if(!findUser) {
      throw new Error("Invalied email");

   } else {

        if (findUser && await findUser.isPasswordMatched(password) ) {
            // new token for stable page refresh
            const refreshToken = await generateRefreshToken(findUser?._id);
 
            // update that refreshToken to that login user db field
            const updateuser = await User.findByIdAndUpdate(
                findUser._id,
                {
                  refreshToken:refreshToken
                }, 
                { new:true }
            );

            // send cookie to frond end to product referesh
            res.cookie(
                'refreshToken',
                 refreshToken,
                 {
                   httpOnly:true,
                   maxAge:72*60*60*1000,
                 });
            // 72 hrs * 60 min * 60 sec * 1000 milli second = 3 days

            res.json({
                _id: findUser?._id,
                firestname: findUser?.firstname,
                lastname: findUser?.lastname,
                email: findUser?.email,
                password: findUser?.password,
                role: findUser?.role,
                token: generateToken(findUser?._id)
            })
        }
        else {
            throw new Error("Invalied password");
        }
   }
});


// --------------------------------------------------------------
//  3) handle refresh token
// --------------------------------------------------------------

const handleRefreshToken = asyncHandler( async (req, res) => {

    const cookie = req.cookies;

    if(!cookie?.refreshToken) throw new Error('Not refresh token in cookies Please login again😏');
     const refreshToken = cookie.refreshToken;
     const user = await User.findOne({ refreshToken });
 
    if(!user) throw new Error('No refresh token present in db or not matched');
    
     jwt.verify( refreshToken, process.env.JWT_SECRECT, (err, decoded)=>{
         if(err || user.id !== decoded.id) {
             throw new Error("There is something wrong with refresh token");
         }
         // again generate token inside user id
         const accessToken = generateToken(User?._id)
         res.json({ accessToken });
      } );
 });


// -------------------------------------------------------------
//  4) logout functionality
// -------------------------------------------------------------

const logout = asyncHandler( async(req,res) => {
    const cookie = req.cookies;

    if(! cookie?.refreshToken) {
        throw new Error('Not refresh token in cookies Please login again😏');
    }
    else { 
        const refreshToken = cookie.refreshToken;
        const user = await User.findOne({ refreshToken });

        if(!user) {
            // if not find user based on cookie - that cookie is expried so delete that cookie
            res.clearCookie( 'refreshToken', {
            httpOnly:true,
            secure:true
            });

            res.sendStatus(204); // forbidden
        } 

        else {
            //1- remove token from user db
            await User.findOneAndUpdate( refreshToken,{
                refreshToken:" ",
            });

            //2- remove cookie from browser
            res.clearCookie( 'refreshToken', {
            httpOnly:true,
            secure:true
            });

            res.sendStatus(204); // forbidden
        }
    
    }
});

// ------------------------------------------------------
//  5) get all user 
// ------------------------------------------------------

const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers)
    } 
    
    catch (error) {
        throw new Error(error);
    }
})

// -----------------------------------------------------
//  6) get single user
// -----------------------------------------------------

const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

     // check user is valid
     validateMongoDbId(id);

    try {
        const getSingleUser = await User.findById(id)
        res.json(getSingleUser)
    }

    catch (error) {
        throw new Error(error)
    }

})

// -----------------------------------------------------
//  7) Delete User
// -----------------------------------------------------

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // check user is valid
    validateMongoDbId(id);

    try {
        const deleteUser = await User.findByIdAndDelete(id)
        res.json(deleteUser)
    } 

    catch (error) {
        throw new Error(error)
    }
})

// ------------------------------------------------------
//  8) update  user
// ------------------------------------------------------

const updateUser = asyncHandler( async (req, res) => {
    const { _id } = req.user;

    // check user is valid
    validateMongoDbId(_id);

    try {
        const updatedUser = await User.findByIdAndUpdate( 
        _id, 
        {
          firstname: req?.body?.firstname,
          lastname: req?.body?.lastname,
          email: req?.body?.email,
          mobile: req?.body?.mobile,
        }, { new: true } )

        res.json(updatedUser);

    } catch (error) {
        throw new Error(error)
    }
} )

// -----------------------------------------------------
//  9) Block user - is of the update user data😂
// -----------------------------------------------------

const blockUser = asyncHandler( async (req, res) => {
    const { id } = req.params;

    // check user is valid
    validateMongoDbId(id);

    try {
        const BlackUser = await User.findByIdAndUpdate(id, {
            isBlocked:true
        }, { new: true })

        res.json({
            usernaem:BlackUser.firstname,
            message:"User Blocked"
        });

    } catch (error) {
        throw new Error(error)
    }

} )

// ----------------------------------------------------
//  10) un block user - is of the update user data😂
// ----------------------------------------------------

const unblockUser = asyncHandler( async (req, res) => {
    const { id } = req.params; 

    // check user is valid
    validateMongoDbId(id);

    try {
        const unBlackUser = await User.findByIdAndUpdate(id, {
            isBlocked:false
        }, { new: true })

        res.json({
            usernaem:unBlackUser.firstname,
            message:"User UnBlocked"
        });

    } catch (error) {
        throw new Error(error)
    }
} )

// ----------------------------------------------------
//  11) password update
// ----------------------------------------------------

const updatePassword = asyncHandler( async(req, res) => {
    const { _id } = req.user; 
    const { password } = req.body;

    // check user is valid
    validateMongoDbId(_id);

    const Find_user = await User.findById(_id);
    if(password) {
        Find_user.password = password;
        const Password_Updated_User = await Find_user.save();
        res.json(Password_Updated_User);
    } else {
        res.json(Find_user)
    }
} )

// ----------------------------------------------------
//  12)create password token and send to mail
// ----------------------------------------------------

const ForgetPasswordToken = asyncHandler( async(req,res) => {

      const {email}  = req.body;
      const user = await User.findOne({ email });

      if(!user) {
        res.send("user not found in our website please create a account or try again");
        throw new Error("user not found in our website please create a account or try again");
      } 
      try {
        const token = await user.createPasswordResetToken();
                      await user.save();

        const restURL = `
        hai, Please follow this 
        link to reset your passwprd.
        This Link is valid till 10 minutes from now.
        
        <a href='http://localhost:4000/api/user/reset-password/${token}'>
        Click To Reset 
        </a>
        `
        const data = {
            to:email,
            text:"Hey User",
            subject:"Forget Password Link",
            html:restURL
        }

        sendEmail(data);
        res.json(token);

      } catch(error) {
        throw new Error(error);
      }
} )

// ----------------------------------------------------
//  13) reset new password throw email token link
// ----------------------------------------------------

const resetPassword = asyncHandler( async(req,res)=>{
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex");

    // find that user
    const user = await User.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpires:{ $gt: Date.now() },
    });

    if(!user) throw new Error("Token expired, Please try again later");
    
    user.password = password;
    user.passwordResetToken = undefined,
    user.passwordResetExpires = undefined ;

    await user.save();
    res.json(user); 
});

// ----------------------------------------------------
//  14) admin login
// ----------------------------------------------------

const loginAdmin = asyncHandler(async (req, res)=>{

    const { email, password } = req.body;
    // check if user exists or not
    const findAdmin = await User.findOne({ email });

    if (findAdmin.role !== "admin") throw new Error("Not Authorised");

    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {

      const refreshToken = await generateRefreshToken(findAdmin?._id);

      const updateuser = await User.findByIdAndUpdate(
        findAdmin.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      
      res.json({
        _id: findAdmin?._id,
        firstname: findAdmin?.firstname,
        lastname: findAdmin?.lastname,
        email: findAdmin?.email,
        mobile: findAdmin?.mobile,
        role: findAdmin?.role,
        token: generateToken(findAdmin?._id),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  });

// ----------------------------------------------------
//  15) get user Wishlist
// ----------------------------------------------------

  const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
      const findUser = await User.findById(_id).populate("wishlist");
      res.json(findUser);
    } catch (error) {
      throw new Error(error);
    }
  });

// ----------------------------------------------------
//  16) add address
// ----------------------------------------------------

const updateAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          address: req?.body?.address,
        },
        {
          new: true,
        }
      );
      res.json(updatedUser);
    } catch (error) {
      throw new Error(error);
    }

  });

// ----------------------------------------------------
//  17) add to cart
// ----------------------------------------------------
const addToCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    
    try {
      let products = [];

      const user = await User.findById(_id);

      // check if user already have product in cart
      const alreadyExistCart = await Cart.findOne({ orderby: user._id });

      if (alreadyExistCart) {
        alreadyExistCart.remove();
      }

      for (let i = 0; i < cart.length; i++) {
        let object = {};

        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;

        let getPrice = await Product.findById(cart[i]._id).select("price").exec();

        object.price = getPrice.price;

        products.push(object);
      }

      let cartTotal = 0;

      for (let i = 0; i < products.length; i++) {
        cartTotal = cartTotal + products[i].price * products[i].count;
      }

      let newCart = await new Cart({
        products,
        cartTotal,
        orderby: user?._id,
      }).save();
 
      res.json(newCart);

    } catch (error) {
      throw new Error(error);
    }
  });

// ----------------------------------------------------
//  18) get cart
// ----------------------------------------------------
const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});


// ----------------------------------------------------
//  19) remove product from cart
// ----------------------------------------------------
const remove_product_from_cart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});


// ----------------------------------------------------
//  20) apply coupon to cart model
// ----------------------------------------------------
const applyCouponToCart = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);

  const validCoupon = await Coupon.findOne({ name: coupon });

  if (validCoupon === null) throw new Error("Invalid Coupon");
   
  const user = await User.findOne({ _id });

  let { cartTotal } = await Cart.findOne({
        orderby: user._id,
        }).populate("products.product");

  let totalAfterDiscount = ( cartTotal - (cartTotal * validCoupon.discount) / 100 ).toFixed(2);

  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );

  res.json(totalAfterDiscount);
});

// ----------------------------------------------------
//  21) create order
// ----------------------------------------------------
const createNewOrder = asyncHandler(async (req, res) => {
  const { cashondelivery, couponApplied } = req.body;

  const { _id } = req.user;
  validateMongoDbId(_id);

  try {

    if (!cashondelivery) throw new Error("Create cash order failed");

    //1) find orders users & that user card
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmout = 0;

    //2) check any order applyed
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount;
    } 
    else {
      finalAmout = userCart.cartTotal;
    }

    //3) create  order - insert new document to order model
    let newOrder = await new Order({
      products: userCart.products,

      paymentIntent: {
        id: uniqid(),
        method: "cashondelivery",
        amount: finalAmout,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "INR",
      },

      orderby: user._id,
      orderStatus: "Cash on Delivery",

    }).save();

    //3) create update model 
       //i) decrease product item quantity
       //ii) increare sold quantity

    let update = userCart.products.map( (item) => {

      return { 
        updateOne: {
           filter: { _id: item.product._id },
           update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };

    });

    //4) update product model - after ordered
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });

  }
  catch (error) {
    throw new Error(error);
  }
});


// ----------------------------------------------------
//  22) getAllOrders
// ----------------------------------------------------
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const alluserorders = await Order.find()
      .populate("products.product")
      .populate("orderby","-passwordResetToken -passwordResetExpires")
      .exec();
    res.json(alluserorders);
    
  } catch (error) {
    throw new Error(error);
  }
});


// ----------------------------------------------------
//  23) getOrderByUserId
// ----------------------------------------------------
const getOrderByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  
  try {
    const userorders = await Order.findOne({ orderby: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});


// ----------------------------------------------------
//  24) updateOrderStatus
// ----------------------------------------------------
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  validateMongoDbId(id);

  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );

    res.json(updateOrderStatus);
  } 
  catch (error) {
    throw new Error(error);
  }
});

module.exports = { 
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

    getWishlist,
    updateAddress,

    addToCart,
    getUserCart,
    remove_product_from_cart,

    applyCouponToCart,

    createNewOrder,
    getAllOrders,
    getOrderByUserId,
    updateOrderStatus

};