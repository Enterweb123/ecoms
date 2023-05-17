const Blog = require("../models/blogModel");
const User = require("../models/userModel");

const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validatemongodbid");

//1) createBlog ==================================================================
const createBlog = asyncHandler( async(req,res)=>{
   try { 
    const newBlog = await Blog.create(req.body);
    res.json({
        status : "success",
        newBlog,
    });
   } catch (error) {
    throw new Error(error)
   }
});

//2) get-Blog ====================================================================
const getBlog = asyncHandler( async(req,res)=>{
   const { id } = req.params;
   validateMongoDbId(id)

   try { 
    const getBlog = await Blog.findById(id).populate('likes','firstname -_id').populate('dislikes','firstname -_id');

    await Blog.findByIdAndUpdate(
        id,
        { $inc : {numViews:1} },
        { new :true }
    );

    res.json(getBlog);
   } 
   catch (error) {
    throw new Error(error);
   }
});

//3) get-all-Blog ===============================================================
const getAllBlogs = asyncHandler( async(req,res)=>{
   try { 
    const getAllBlog = await Blog.find();
    res.json({
        status : "success",
        getAllBlog,
    });
   } catch (error) {
    throw new Error(error)
   }
});

//4) update-Blog ===============================================================
const updateBlog = asyncHandler( async(req,res)=>{
   const {id} = req.params;
   validateMongoDbId(id)

   try { 
    const updateBlog = await Blog.findByIdAndUpdate( id, req.body, {new:true} );
    res.json(updateBlog);
   } 
   catch (error) {
    throw new Error(error)
   }

});

//5) delete-Blog ===============================================================
const deleteBlog = asyncHandler( async(req,res)=>{
   const {id} = req.params;
   validateMongoDbId(id);

   try { 
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.json({
        "msg":"blog delete success",
        deleteBlog
    });
   } 
   catch (error) {
    throw new Error(error)
   }
})

//6) blog like & dis-likes start ===============================================
const LiketheBlog = asyncHandler( async(req,res) => {

   const {blogId} = req.body;
   validateMongoDbId(blogId);

    //🔴 find the blog which you want to be liked :
    const blog = await Blog.findById(blogId);

    //🔴 find the login user :
    const loginUserId = req?.user?._id;

    //🔴 find if the user has liked the post (check model boolean value):
    const isLiked = blog?.isLiked;

    //🔴 find if the user has disliked the post :
    const alreadyDisliked = blog?.dislikes?.find(
        ( (userId)=> userId?.toString() === loginUserId?.toString() )
    );

    //▶ if you already dislike this post - remove ur dislike :
    if(alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            {
              $pull : {dislikes: loginUserId },
              isDisliked : false
            },
            { new:true }
       );
        res.json(blog);
    } 

    //▶ if you already liked remove your like
    //▶ if you already unliked add your like
    if(isLiked) {
        const blog = await Blog.findByIdAndUpdate( 
              blogId, 
              {
                $pull : { likes: loginUserId },
                isLiked : false, 
              }, 
              { new:true }
       );
        res.json(blog);

    } else {
        const blog = await Blog.findByIdAndUpdate( 
            blogId, 
            {
            $push : { likes: loginUserId },
            isLiked : true, 
            },  
            { new:true }
       );
      res.json(blog);
    }
     
})

//7) blog dislike
const disliketheBlog = asyncHandler( async(req,res)=>{
    const {blogId} = req.body;
    validateMongoDbId(blogId);
 
     //🔴 find the blog which you want to be liked :
     const blog = await Blog.findById(blogId);
 
     //🔴 find the login user :
     const loginUserId = req?.user?._id;
 
     //🔴 find if the user has liked the post :
     const isDisLiked = blog?.isDisliked;
 
     //🔴 find if the user has disliked the post :
     const alreadyLiked = blog?.likes?.find(
         ( (userId) => userId?.toString() === loginUserId?.toString() )
     );
 
    //▶ if you already like this post - remove ur like :
    if(alreadyLiked) {
         const blog = await Blog.findByIdAndUpdate(
             blogId, 
             {
               $pull : {likes: loginUserId },
               isLiked : false
             },
             { new:true }
        );
         res.json(blog);
     } 
 

    //▶ if you already Disliked this blog - remove your dislike
    //▶ if you already no-Disliked this blog - add your dislike

    if(isDisLiked) {
        const blog = await Blog.findByIdAndUpdate( 
               blogId, 
               {
                 $pull : { dislikes: loginUserId },
                 isDisliked : false, 
               }, 
               { new:true }
        );
         res.json(blog);
     } else {
         const blog = await Blog.findByIdAndUpdate( 
             blogId, 
             {
                $push : { dislikes: loginUserId },
                isDisliked : true, 
             },  
             { new:true }
        );
       res.json(blog);
     }
      
 })

//8) blog like & dis-likes end ===============================================
const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
      const uploader = (path) => cloudinaryUploadImg(path, "images");
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newpath = await uploader(path);
        console.log(newpath);
        urls.push(newpath);
        fs.unlinkSync(path);
      }
      const findBlog = await Blog.findByIdAndUpdate(
        id,
        {
          images: urls.map((file) => {
            return file;
          }),
        },
        {
          new: true,
        }
      );
      res.json(findBlog);

    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = {
    createBlog,
    updateBlog,       
    getAllBlogs,
    getBlog,
    deleteBlog,
    LiketheBlog,
    disliketheBlog,
    uploadImages
}