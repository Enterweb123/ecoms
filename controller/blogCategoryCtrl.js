const BlogCategory = require('../models/blogCategoryModel');

const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validatemongodbid");


// 🔴 blog create Category ===================================================
const createBlogCategory = asyncHandler( async(req,res)=>{

   try {
    const createBlogCategory = await BlogCategory.create(req.body);
    res.json(createBlogCategory);

   } catch (error) {
    throw new Error(error);
   }

});


// 🔴 get single blog Category ===============================================
const getBlogCategory = asyncHandler( async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id)

    try {
     const getBlogCategory = await BlogCategory.findById(id);
     res.json(getBlogCategory);
 
    } catch (error) {
     throw new Error(error);
    }
 
 });


// 🔴 get all blog Category =================================================
const getallBlogCategory = asyncHandler( async(req,res)=>{

   try {
    const getallBlogCategory = await BlogCategory.find();
    res.json(getallBlogCategory);

   } catch (error) {
    throw new Error(error);
   }
   
});


// 🔴 update blog Category ==================================================
const updateBlogCategory = asyncHandler( async(req,res)=>{
   const {id} = req.params;
   validateMongoDbId(id)

   try {
    const updateBlogCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {new:true});
    res.json(updateBlogCategory);

   } catch (error) {
    throw new Error(error);
   }

});


// 🔴 delete blog Category ==================================================
const deleteBlogCategory = asyncHandler( async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id)

   try {
    const deleteBlogCategory = await BlogCategory.findByIdAndDelete(id);
    res.json({
        "msg":"Blog Category deleted success",
        deleteBlogCategory
    });

   } catch (error) {
    throw new Error(error);
   }

});

module.exports = {
    createBlogCategory,
    getBlogCategory,
    getallBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
}