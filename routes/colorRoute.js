const express = require("express");
const router  = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const { createColor,
        getallColor,
        getColor,
        updateColor,
        deleteColor } = require("../controller/colorCtrl");

router.get("/",(req,res)=>res.send("Color home") );

router.post("/createcolor",authMiddleware,isAdmin,createColor);

router.get("/getcolor/:id",getColor);
router.get("/getallcolor",getallColor);

router.put("/updatecolor/:id",authMiddleware,isAdmin,updateColor);
router.delete("/deletecolor/:id",authMiddleware,isAdmin,deleteColor);

module.exports = router;