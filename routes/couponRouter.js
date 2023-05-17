const express = require("express");
const router  = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const { 
    createCoupon,
    getCoupon,
    getallCoupon,
    updateCoupon,
    deleteCoupon, } = require("../controller/couponCtrl");

router.get("/", (req,res) => res.send("Coupon home") );

router.post("/createcoupon", authMiddleware,isAdmin,createCoupon);

router.get("/getcoupon/:id", getCoupon);
router.get("/getallcoupon", getallCoupon);

router.put("/updatecoupon/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/deletecoupon/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;