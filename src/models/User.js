import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import Token from "./Token";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "Please provide username"],
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Please provide email"],
            validate: {
                validator: validator.isEmail,
                message: 'Please provide valid email'
            }
        },
        password: {
            type: String,
            required: [true, "Please provide password"],
            minlength: 6,
        },
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role",
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

userSchema.pre('validate', function (next) {
    if (!this.username || !this.email || !this.password) {
        next(new Error('You should provide username or email or password'));
    } else {
        next();
    }
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.comparePassword = async function (password) {
    if (!password) throw new Error('Password is mission, can not compare!');
    try {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
    } catch (error) {
        console.log('Error while comparing password!', error.message);
    }
};

userSchema.pre('remove', async function(next) {
    const user = this;
    try {
      await Token.deleteMany({ user: user._id });
      next();
    } catch (err) {
      next(err);
    }
  });

export default mongoose.model("User", userSchema);
