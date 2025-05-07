const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  aadharCardNumber:{
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
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre('save', async function (next) {
    const person = this;
      // If the password has not been modified, skip the hashing process
    if (!person.isModified('password')) return next();
    try {
        //SALT  generation
        const salt = await bcrypt.genSalt(10) 
        //hash password gen using person and salt
        const hashPassword = await bcrypt.hash(person.password, salt);
        //overrride the the plain pwd with the hashed password
        person.password = hashPassword;
        next();
    }
    catch (err) {
        return next(err)
    }
})
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch
     }
    catch (err) {
        throw err;
    }
}

const User = mongoose.model('User',userSchema );
module.exports = User;




// {
//     "name": "John Doe",
//     "age": 30,
//     "email": "john.doe@example.com",
//     "number": 1234567890,
//     "aadharCardNumber": 123456789012,
//     "password": "123",
//     "role": "voter"
// }
// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2NhNTkyMGVhYjQwYWM5NzQ1YjdhZSIsImlhdCI6MTcyNDY4Nzc2Mn0.Ai-CULanNb-VcsMXuCbhLJo-JPSq8PwnIvBoHJ1wT-Y"

// -----------------------------------------------------------------ADMIN--------------------
// {
//     "response": {
//         "name": "dua Doe",
//         "age": 30,
//         "email": "john.doe@example.com",
//         "number": 1234567890,
//         "aadharCardNumber": 123456789013,
//         "password": "$2b$10$xbx84tz6oaozOlL/SyrFWeNXf1sfELQcrm.mWhSdcwhpHrvbZrlwe",
//         "role": "admin",
//         "isVoted": false,
//         "_id": "66cca5cb0eab40ac9745b7b0",
//         "__v": 0
//     },
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2NhNWNiMGVhYjQwYWM5NzQ1YjdiMCIsImlhdCI6MTcyNDY4NzgxOX0.PX-q-OfqzcKmxmPzOC-RnrL997JqeYfHWrL_TbC4zGQ"
// }