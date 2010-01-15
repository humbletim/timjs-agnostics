
stdio = { err: [], writeError: function(d) { this.err.push(d.toString().replace(/\n/g,'\\N')); } };

stdio.lines = [];

node.stdio.open();

stdio.write = function(s) {
  node.stdio.write(s+"\n");
};

var obailout = bailout;
bailout = function() {
  var utils = require("/utils.js");
  utils.debug('bailout');
}

