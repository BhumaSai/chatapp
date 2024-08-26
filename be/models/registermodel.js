const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    confirmpassword: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: false,
        default: 'https://res.cloudinary.com/bhuma00sai/image/upload/v1690276911/fnuexdv9nsdsbw1tyfpo.png'
    },
    friends: {
        type: Array,
    },
    gender: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: true
    }
)

User.pre("save", async function (next) {
    if (this.isModified("password")) {
        const securepass = await bcrypt.hash(this.password, 10)
        this.password = securepass
        this.confirmpassword = securepass
    }
    next()
})

// User.methods.ismatch = async function(pass){
//   return await bcrypt.compare(pass,this.password)
// }



module.exports = mongoose.model('user', User)
