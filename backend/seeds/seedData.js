const usersList = require('./seedUsers');
const Users = require('../models/userModel');
const zombiesList = require('./seedZombies');
const Zombies = require('../models/zombieModel');
const zombieTrackersList = require('./seedZombieTrackers');
const ZombieTrackers = require('../models/zombieTrackersModel');

async function addDataToDB(){
    //TODO get refresh token to add to it
    await Users.bulkCreate(usersList);
    await Zombies.bulkCreate(zombiesList);
    await ZombieTrackers.bulkCreate(zombieTrackersList);
}

addDataToDB()

