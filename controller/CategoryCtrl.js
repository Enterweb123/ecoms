const Category = require('../models/categoryModel');

const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validatemongodbid");

// 🔴 create Category
const CreateCategory = asyncHandler( async(req,res)=>{

   try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);

   } catch (error) {
    throw new Error(error);
   }

 });

// 🔴 get single Category
const getCategory = asyncHandler( async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id)

    try {
     const getCategory = await Category.findById(id);
     res.json(getCategory);
 
    } catch (error) {
     throw new Error(error);
    }
 
 })

// 🔴 get all Category
const getallCategory = asyncHandler( async(req,res)=>{

   try {
    const getallCategory = await Category.find();
    res.json(getallCategory);

   } catch (error) {
    throw new Error(error);
   }
   
})

// 🔴 update Category
const updateCategory = asyncHandler( async(req,res)=>{
   const {id} = req.params;
   validateMongoDbId(id)

   try {
    const updateCategory = await Category.findByIdAndUpdate(id, req.body, {new:true});
    res.json(updateCategory);

   } catch (error) {
    throw new Error(error);
   }

})


// 🔴 delete Category
const deleteCategory = asyncHandler( async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id)

   try {
    const deleteCategory = await Category.findByIdAndDelete(id);
    res.json({
        "msg":"Category delete success",
        deleteCategory
    });
   } catch (error) {
    throw new Error(error);
   }

})

module.exports = {
    CreateCategory,
    getCategory,
    getallCategory,
    updateCategory,
    deleteCategory,
}