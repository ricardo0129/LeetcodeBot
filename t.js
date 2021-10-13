const { getRankings, getStanding } = require('./db.js')
const { getPoints } = require('./submit.js')
const axios = require('axios');
const db = require('./db.js');

async function doThing(){
    await db.addExperience("123","12");
}

doThing();