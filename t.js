const { getRankings, getStanding, resetExp } = require('./db.js')
const { getPoints } = require('./submit.js')
const axios = require('axios');
const db = require('./db.js');
const { expToLvl } = require('./math.js');

