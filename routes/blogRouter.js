const express = require("express");
const router  = express.Router();

// authendication verify
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { blogImgResize, uploadPhoto } = require("../middlewares/uploadimages");

const { 
    createBlog, 
    updateBlog,
    getAllBlogs, 
    getBlog, 
    deleteBlog , 
    LiketheBlog, 
    disliketheBlog } 
 =  require("../controller/blogCtrl");

router.get("/",(req,res)=>res.send("blog home"))


// 🔴ADMIN BLOG CONTROL START =============================================

  // create new blog only admin
    router.post("/createblog",authMiddleware,isAdmin,createBlog)

  // delete blog only for admin
    router.delete("/deleteBlog/:id",authMiddleware,isAdmin,deleteBlog)

  // update blog only admin
    router.put("/updateBlog/:id",authMiddleware,isAdmin,updateBlog)

// 🔴ADMIN BLOG CONTROL END ===============================================


// 🟢blog user control start ==============================================

  // get single blog
    router.get("/getblog/:id",getBlog)

  // get all blog
    router.get("/getallblogs",getAllBlogs)

  // like and dislikes
    router.put("/likes",authMiddleware, LiketheBlog)
    router.put("/dislikes",authMiddleware, disliketheBlog)

// 🟢blog user control end ===============================================




module.exports = router;