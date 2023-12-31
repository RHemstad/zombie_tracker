const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    };

    const foundUser = await Users.findOne({ where: {username: username }  });
    if (!foundUser) {
        return res.sendStatus(401); //Unauthorized (no user found)
    }

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = foundUser.roles;
        //create JWTs
        const accessToken = jwt.sign(
           {
            //different namespace for jwt claims
            "UserInfo": {
                "username": foundUser.username,
                "roles": roles
            }
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' } //set later to expires in 10 seconds
        );

        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' } //expires in 1 day
        );

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
            const result = await foundUser.save();
            console.log(result);
            //console.log(roles);

        // Creates Secure Cookie with refresh token
        // for testing purposes only secure: true has to be removed but needed for production
        res.cookie('jwt', refreshToken, { 
            httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 
        }); //1 day max age

        //send the authorization roles and access token to the user
        //this is giving me grief on the client end.
        res.json({ roles, accessToken });
        //res.json({'success': `User ${username} is logged in!` }); for testing

    } else {
        res.sendStatus(401);
    }
}


module.exports = { handleLogin };