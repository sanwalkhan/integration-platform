const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // bcryptjs for password hashing

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  workEmail: { type: String, required: true, unique: true },
  password: { type: String },
  sapAuthToken: { type: String }, // SAP Auth Token
  sapCompanyUUID: { type: String }, // SAP Company UUID
  isEmailVerified: { type: Boolean, default: false },
  hubspotAccessToken: String,
  hubspotRefreshToken: String,
  hubspotConnected: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password); // Compare plaintext password with hashed password
  } catch (err) {
    throw new Error('Error comparing passwords');
  }
};

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // Hash password
  }
  next();
});

module.exports = mongoose.model('User', userSchema); // Export the User model



// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   workEmail: { type: String, required: true, unique: true },
//   password: { type: String },
//   hubspotAccessToken: { type: String },
//   hubspotRefreshToken: { type: String },
// }, { timestamps: true });

// userSchema.pre('save', async function (next) {
//   if (this.password && this.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);
