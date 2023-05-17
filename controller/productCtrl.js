// *) Product Models
const Product = require('../models/productModels');
// *) user
const UserModel = require("../models/userModel");
// *) Error Handler
const asyncHandler = require("express-async-handler");
// *) slugify
const slugify = require('slugify');
const validateMongoDbId = require("../utils/validatemongodbid");



const createProduct = asyncHandler(async (req, res) => {

  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);

  } catch (error) {
    throw new Error(error);
  }
})


const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateproduct = await Product.findByIdAndUpdate(id, req.body, { new: true })
    res.json(updateproduct);
  }
  catch (error) {
    throw new Error(error);
  }
})
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteproduct = await Product.findByIdAndDelete(id)
    res.json(deleteproduct);
  }
  catch (error) {
    throw new Error(error);
  }
})

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
})


// way - 1 = filter
// const getAllProduct = asyncHandler( async(req,res)=>{
//         // console.log(req.query);
//         try {
//            const findAllProduct = await Product.find(req.query);
//            res.json(findAllProduct);
//         } 
//         catch (error){
//            throw new Error(error);
//         }
// });

// way - 2 = filter
// const getAllProduct = asyncHandler( async(req,res)=>{
//         // console.log(req.query);
//         try {
//            const findAllProduct = await Product.find({
//                 brand : req.query.brand,
//                 category: req.query.category
//            });
//            res.json(findAllProduct);
//         } 
//         catch (error){
//            throw new Error(error);
//         }
// });

// way - 3 = filter
// const getAllProduct = asyncHandler( async(req,res)=>{

//         try {
//            const queryObj = { ...req.query };
//            const excludeFields = [ 'page', 'sort', 'limit', 'fields' ];
//            excludeFields.forEach( (el) => delete queryObj[el] );

//            console.log( queryObj, req.query );

//            const findAllProduct = await Product.where("category").equals(req.query.category);
//            res.json(findAllProduct);
//         } 
//         catch (error){
//            throw new Error(error);
//         }
// });

// way - 4 = filter


const getAllProduct = asyncHandler(async (req, res) => {

  try {
    // 1) filtering price and get all:
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    // 2) sort:
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) limiting the field :
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) pagination :
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error('This Page does not exists');
    }

    console.log("page -", page, "limit -", limit, "skip -", skip);

    const product = await query;
    res.json(product);
  }

  catch (error) {
    throw new Error(error);
  }

});


const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  const { product_id } = req.body;
  try {
    const user = await UserModel.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === product_id);
    if (alreadyadded) {
      let user = await UserModel.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: product_id },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await UserModel.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: product_id },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});


const rating = asyncHandler(async (req, res) => {

  const { _id } = req.user;
  validateMongoDbId(_id);

  const { star, product_id, comment } = req.body;

  try {

    const product = await Product.findById(product_id);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );

    // if already reated it will be update rating and comment
    if (alreadyRated) {
      const update_Rating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );

    } else {

      // if first reated it will be newly add rating and comment
      const rate_Product = await Product.findByIdAndUpdate(
        product_id,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }


    const get_all_ratings = await Product.findById(product_id);

    let totalRating_array_count = get_all_ratings.ratings.length;

    let sum_of_all_rating = get_all_ratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);

    let actualRating = Math.round(sum_of_all_rating / totalRating_array_count);

    
    let final_rated_product = await Product.findByIdAndUpdate(
      product_id,
      {
        totalRating: actualRating,
      },
      { new: true }
    );

    res.json(final_rated_product);

  } catch (error) {
    throw new Error(error);
  }
});


module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating
}