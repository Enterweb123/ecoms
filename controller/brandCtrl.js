const Brand = require('../models/brandModel');

const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validatemongodbid");

// 🔴 create Brand
const createBrand = asyncHandler( async(req,res)=>{

   try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);

   } catch (error) {
    throw new Error(error);
   }
})

// 🔴 get single Brand
const getBrand = asyncHandler( async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id)

    try {
     const getBrand = await Brand.findById(id);
     res.json(getBrand);
 
    } catch (error) {
     throw new Error(error);
    }
 
 })

// 🔴 get all Brand
const getallBrand = asyncHandler( async(req,res)=>{

   try {
    const getallBrand = await Brand.find();
    res.json(getallBrand);

   } catch (error) {
    throw new Error(error);
   }
   
})

// 🔴 update Brand
const updateBrand = asyncHandler( async(req,res)=>{
   const {id} = req.params;
   validateMongoDbId(id)

   try {
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {new:true});
    res.json(updateBrand);

   } catch (error) {
    throw new Error(error);
   }

})


// 🔴 delete Brand
const deleteBrand = asyncHandler( async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id)

   try {
    const deleteBrand = await Brand.findByIdAndDelete(id);
    res.json({
        "msg":"Brand delete success",
        deleteBrand
    });
   } catch (error) {
    throw new Error(error);
   }

})

module.exports = {
    createBrand,
    getBrand,
    getallBrand,
    updateBrand,
    deleteBrand,
}