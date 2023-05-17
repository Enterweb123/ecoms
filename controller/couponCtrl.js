const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validatemongodbid");

// 🔴 create Coupon
const createCoupon = asyncHandler( async(req,res)=>{

    try {
     const CreateCoupon = await Coupon.create(req.body);
     res.json(CreateCoupon);
 
    } catch (error) {
     throw new Error(error);
    }

 })

 // 🔴 get single Coupon
const getCoupon = asyncHandler( async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id)

    try {
     const getCoupon = await Coupon.findById(id);
     res.json(getCoupon);
 
    } catch (error) {
     throw new Error(error);
    }
 
 })

// 🔴 get all Coupon
const getallCoupon = asyncHandler( async(req,res)=>{

   try {
    const getallCoupon = await Coupon.find();
    res.json(getallCoupon);

   } catch (error) {
    throw new Error(error);
   }
   
})

// 🔴 update Coupon
const updateCoupon = asyncHandler( async(req,res)=>{
   const {id} = req.params;
   validateMongoDbId(id)

   try {
    const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {new:true});
    res.json(updateCoupon);

   } catch (error) {
    throw new Error(error);
   }

})


// 🔴 delete Coupon
const deleteCoupon = asyncHandler( async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id)

   try {
    const deleteCoupon = await Coupon.findByIdAndDelete(id);
    res.json({
        "msg":"Coupon delete success",
        deleteCoupon
    });
   } catch (error) {
    throw new Error(error);
   }

})

module.exports = {
    createCoupon,
    getCoupon,
    getallCoupon,
    updateCoupon,
    deleteCoupon,
}