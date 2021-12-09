var Module = require('module');
var fs     = require('fs');

Module._extensions['.png'] = function(module, fn) {
  var base64 = fs.readFileSync(fn).toString('base64');
  module._compile('module.exports="data:image/jpg;base64,' + base64 + '"', fn);
};

const avatar1 = require("./avatar1.png");
const avatar2 = require("./avatar2.png");
const avatar3 = require("./avatar4-mujer.png");
const avatar4 = require("./avatar5.png");
const avatar5 = require("./avatar6-mujer.png");
const avatar6 = require("./avatar7.png");
const avatar7 = require("./avatar8.png");
const avatar8 = require("./avatar9-mujer.png");
const avatar9 = require("./avatar10-mujer.png");
const avatar10 = require("./avatar12-mujer.png");
const avatar11 = require("./avatar13-mujer.png");
const avatar12 = require("./avatar14-mujer.png");
const avatar13 = require("./avatar15-mujer.png");
const avatar14 = require("./avatar16.png");
const avatar15 = require("./avatar17.png");
const avatar16 = require("./avatar18.png");
const avatar17 = require("./avatar19-cat.png");
const avatar18 = require("./avatar19-mujer.png");
const avatar19 = require("./avatar20-dog.png");
const avatar20 = require("./avatar21-alien.png");

const arr = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
  avatar11,
  avatar12,
  avatar13,
  avatar14,
  avatar15,
  avatar16,
  avatar17,
  avatar18,
  avatar19,
  avatar20,
];
module.exports = arr;
