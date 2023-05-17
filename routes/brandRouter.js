const express = require("express");
const router  = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const { createBrand,
        getallBrand,
        getBrand,
        updateBrand,
        deleteBrand } = require("../controller/brandCtrl");

router.get("/",(req,res)=>res.send("Brand home") );

router.post("/createbrand",authMiddleware,isAdmin,createBrand);

router.get("/getbrand/:id",getBrand);
router.get("/getallbrand",getallBrand);

router.put("/updatebrand/:id",authMiddleware,isAdmin,updateBrand);
router.delete("/deletebrand/:id",authMiddleware,isAdmin,deleteBrand);

module.exports = router;