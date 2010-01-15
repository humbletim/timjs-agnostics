var st = new Date().getTime();
debug = function(str) {
  return stdio.writeError((new Date().getTime() - st)+" "+str);
};

loop = function() {
  var a = true;
  while( a && !loop.done) {
	debug("loop()");
	stdio.emit("NOOP LOOP");
	a=stdio.read();
	ioroute(a);
  }
  if (loop.finale && loop.finale.close)
	loop.finale.close();
};
try {
  node;
  node.stdio.addListener("data", function(line) {
						   line=line.toString().replace(/\n$/,'');
						   var utils = require("/utils.js");
						   line.split('\n').forEach(function(line) {
													  utils.debug('line: ['+line+']');
													  ioroute(line);
													});
						   if (loop.done) {
							 node.stdio.listeners('data').pop();
							 if (loop.finale && loop.finale.close)
							   loop.finale.close();
							 obailout();
						   }
						 });
  loop = function(){};
} catch(e) {
  
}
loop.done = false;
exit = function(resp) {
  loop.finale = resp;
  loop.done = true;
  //throw new Error("global exit called");
};
stdio._oldWriteError = stdio.writeError;
stdio.writeError = function(str) { return this._oldWriteError.call(this, "stderr: "+str); };

stdio._oldWrite = stdio.write;
stdio.write = function(str) { return this._oldWriteError.call(this, "stdout: "+str); };

stdio.emit = stdio._oldWrite;
debug(__file__);

try {
  node;
} catch(e) {
  stdio.emit("<STDIN>");
  STDIN = [ ];
  try {
	var l = stdio.read().substr(8);
	STDIN = unescape(l).split('\n');
	if (STDIN.length && STDIN[STDIN.length-1] == '')
	  STDIN.pop(); // remove trailing \n
  } catch(e) { STDIN = [ e ] };
  for (var i=0;i < STDIN.length; i++) stdio.writeError("STDIN("+i+"): "+STDIN[i]);
}

handlers = {};
ioroute = function (msg) {
  if (!msg) return;
  stdio.writeError("msg: "+msg);
  for (var p in handlers) {
	if (msg.indexOf(p+":") == 0) {
	  msg = msg.substr(p.length+1);
	  return handlers[p].processResult(msg);
	  //msg = msg.match(/^jspr\/readline-curl:(.*)$/)[1];
// 	  msg=msg.split(' ');
// 	  if (msg.length >= 2) {
// 		var cmd = msg.shift().substr(1);
// 		var id = msg.shift();
// 		return handlers[p].processResult(id, cmd, msg.join(":"));
// 	  }
	}
  }
  stdio.writeError("discarding msg: "+msg);
};

stdio.writeError("JSPR-MULTIPIPE.JS LOADED");

//main();loop();
