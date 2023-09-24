/*
REGISTER TABLE
Users Table:
user_id (Primary key)
username
password (hashed and salted)
email
created_at
updated_at
*/

const {DataTypes} = require('sequelize');
const {connectToDb} = require('../config/conn');

const User = connectToDb.define('user', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});




module.exports = User
