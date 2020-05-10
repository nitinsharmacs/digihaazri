// file for providing path from the main directory of the project
const path = require('path');

module.exports = path.dirname(process.mainModule.filename);