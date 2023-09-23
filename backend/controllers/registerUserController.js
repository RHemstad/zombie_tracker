//Get the data from the database
const Users = require('../models/userModel');

/* *************************** */
/* *** GET ALL REGISTERED USERS ********* */

//http://localhost:3500/users/
async function getAllRegisteredUsers(req, res) {
    try {
        const results = await Users.findAll()
        //res.status(200).json("this is our home route")
        res.status(200).json(results)
    } catch (error) {
        //console.log(error)
        res.status(500).json({message: error})
    }
};

module.exports = {getAllRegisteredUsers}