const { Schema, model} = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/],
        },
        thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thoughts'}],
        friends: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    },
    {
        toJson: { virtual: true},
        id: false,
    }

);

//virtual to count the number of friends
userSchema.virtual("friendCount").get(() => this.friends ? this.friends.length : 0);

const User = model('User', userSchema);
module.exports = User;