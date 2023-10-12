// requiring the database connection, the User and Thought models, and the data
require('dotenv').config();
const mongoose = require('mongoose');
const db = require('../config/connection');
const User = require('../models/User');
const Thought = require('../models/Thought');


const userData = [
    {
        username: 'morinc35',
        email: 'morinc35@gmail.com',
    },
    {
        username: 'aaronBrown',
        email: 'aaronBrown@gmail.com',
    }
];

const thoughtData = [
    {
        thoughtText: 'I love Forgotten Waters',
        username: 'morinc35',
        reactions: [
            {
                reactionBody: 'I love Forgotten Waters too!',
                username: 'aaronBrown'
            }
        ]
    },
    {
        thoughtText: 'I broke my elbow',
        username: 'aaronBrown',
        reactions: [
            {
                reactionBody: 'Thats not good!',
                username: 'morinc35'
            }
        ]
    }
];


db.connectDatabase()
    .then(() => {
        return User.deleteMany({});
    })
    .then(() => {
        return Thought.deleteMany({}); 
    })
    .then(() => {
        return User.insertMany(userData);
    })
    .then(() => {
        return Thought.insertMany(thoughtData);
    })
    .then(data => {
        console.log('Data seeded!');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });