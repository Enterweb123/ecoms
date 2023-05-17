const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { create } = require("./productModels");
const crypto = require("crypto");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    cart: {
      type: Array,
      default: [],
    },
    address: {
      type: String,
    },

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    
    refreshToken: {
      type: String,
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true
  }
);

// ----------------------------------------------------------------------
// 1)-- modify that schema for password field en-cripty)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } 
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 2)-- modify that schema for password field de-cripty
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
// 3)-- modify that schema for password reset token create
userSchema.methods.createPasswordResetToken = async function () {
  //1) create random chereter reference
  const resettoken = crypto.randomBytes(32).toString("hex");

  //2) convert random chereter to hash - save to db - set that token expriced
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000 //10 min token token for password reset

  // this create randoms and hashings / retun that randoms cherectors
  return resettoken;
}
// ----------------------------------------------------------------------


//Export the model
module.exports = mongoose.model("User", userSchema);
