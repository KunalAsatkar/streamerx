const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'user name is required'],
        trim: [true],
        unique: [true, 'username already taken'],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9_]+$/.test(v);
            },
            message: props => `${props.value} is not a valid username!`
        }
    },
    fname: {
        type: String,
        required: [true, 'first name is required'],
        trim: true
    },
    lname: {
        type: String,
        required: [true, 'last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'already registered']
    },
    contactno: {
        type: String,
        required: true,
        unique: [true, 'already registered'],
        // min, max check length in case of type = string, and value when type = number
        minLength: [10, 'to few digits'],
        maxLength: [10, 'to many digits'],
        validate: {
            validator: (v) => {
                return /^[0-9]+$/.test(v);
            },
            message: props => `${props.value} is not valid, contactno should only contain digits`
        }
    },
    password: {
        type: String,
        required: true
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordExpiryDate: {
        type: Date
    },
}, {
    timestamps: true
}
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

userSchema.methods = {
    jwtToken() {
        return JWT.sign(
            { id: this._id, email: this.email },
            process.env.SECRET,
            { expiresIn: '24h' }
        )
    }
}


const userModel = mongoose.model('user', userSchema);

module.exports = { userModel };



