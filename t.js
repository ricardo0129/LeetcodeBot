const { getRankings, getStanding } = require('./db.js')
const { getPoints } = require('./submit.js')
const axios = require('axios');
const db = require('./db.js');
const { expToLvl } = require('./math.js');

var x = expToLvl(3);
console.log(x)