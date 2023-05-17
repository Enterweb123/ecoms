const express = require("express");
const router  = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const { CreateCategory,
        getallCategory,
        getCategory,
        updateCategory,
        deleteCategory } = require("../controller/CategoryCtrl");

router.get("/",(req,res)=>res.send("Category home") );

router.post("/createcategory",authMiddleware,isAdmin,CreateCategory);

router.get("/getcategory/:id",getCategory);
router.get("/getallcategory",getallCategory);

router.put("/updatecategory/:id",authMiddleware,isAdmin,updateCategory);
router.delete("/deletecategory/:id",authMiddleware,isAdmin,deleteCategory);

module.exports = router;