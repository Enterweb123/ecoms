const express = require("express");
const router  = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const { 
    createBlogCategory,
    getBlogCategory,
    getallBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
} = require("../controller/blogCategoryCtrl");

router.get("/",(req,res)=>res.send("Blog Category home") );

router.post("/createblogcategory", authMiddleware, isAdmin, createBlogCategory);

router.get("/getblogcategory/:id",getBlogCategory);
router.get("/getallblogcategory",getallBlogCategory);

router.put("/updateblogcategory/:id",authMiddleware,isAdmin,updateBlogCategory);
router.delete("/deleteblogcategory/:id",authMiddleware,isAdmin,deleteBlogCategory);

module.exports = router;