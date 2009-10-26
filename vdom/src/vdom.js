/*
 * Virtual DOM thingy
 *   By Tim Dedischew <http://github.com/timjs/>
 * Copyright 2009 Tim Dedischew, under the MIT License (see COPYING)
*/

// env-js components Copyright 2008 John Resig (see ../libs/COPYING.env-js)
// ajaxslt components Copyright 2005-2008 Google Inc. (see ../libs/COPYING.ajaxslt)

/* ------------------------------------------------------------------------- */
// GLUE: async (ie: node, xhr) vs. sync (ie: smjs) load considerations
// DUPLICATE CODE: see examples/sizzle/testASizzle.js
try {
  _ASYNC;
} catch(e) {
  _ASYNC = false;
  if (typeof(node) == 'object') {
	_ASYNC = true;
	load = function(f, cb) { 
	  return node.fs.cat(f, "utf8")
	  .addCallback(function(js) { 
					 try{node.compile(js, f);cb(); }catch(e){throw e; }
				   });
	};
	vdom_debug = require('/utils.js').debug;
  } else {
	vdom_debug = (('vdom_debug' in this) ? this.vdom_debug :
				  (!('document' in this) && typeof(print) == 'function' 
				   ? print : null));
  }
}

if (typeof(load) != 'function')
  throw new Error("a VM/global 'load' function is required for vdom!");

// define vdom_debug to emit any debugging info
if (typeof(vdom_debug) != 'function')
  vdom_debug = function(){};

// ServerJS-style exports
try { exports; } catch(e) { exports = {}; }
exports.mixinWindow = null;

(function() {
  //if (typeof(window) == 'object' || typeof(document) == 'object') 
  //  throw new Error("vdom.js: vdom is designed to provide window/document, but one or both already exist in global namespace!");

  var onload = [];
  
  var nre = /\[native/;
  var load_modules = function(mods) {
	var _load = load;
	if (_load.toString().match(nre)) {
	  // assume native implementations are synchronous w/o support for deferred callbacks
	  _load = function(uri, cb) {
		load(uri);
		cb();
	  };
	}
	function chain() {
	  vdom_debug('vdom.js chain:'+mods.length+'/'+mods[0]);
	  if (mods.length) {
		try {//GLUE: experimental preloading / Makefile stuff
		  if (_MAKED.indexOf(mods[0]) != -1) {
			vdom_debug('_MAKED: '+mods[0]);
			mods.shift();
			return chain();
		  } else
			vdom_debug('not _MAKED: '+mods[0]);
		} catch(e) {};
		return _load(Function._VDOMROOT+"/"+mods.shift(), chain);
	  } else
		while(onload.length) onload.shift()();
	}
	chain();
  };

  var deps = [];

  deps.push('libs/ajaxslt-0.8.1/xmltoken.js');
  deps.push('libs/ajaxslt-0.8.1/util.js');
  deps.push('libs/ajaxslt-0.8.1/dom.js');
  deps.push('src/preenv.js');
  deps.push('src/vdom-env.js');
  deps.push('src/postenv.js');

  load_modules(deps); // kickstart module loading at boot

  exports.mixinWindow = function(gob, cb) {
	vdom_debug('attachWindow', gob);
	if (typeof(window) == 'object') {
	  if (window !== gob) throw new Error("in browser environment, gob must === window when calling attachWindow(gob, cb)");
	  return cb(gob);
	}
	// set up virtual dom
	function ready() {
	  vdom_debug('attachWindow-ready', gob);
	  createENV(gob);
	  gob.location = "about:blank";
	  if (cb)
		cb(gob);
	}
	if (deps.length) // still loading
	  onload.push(ready);
	else
	  ready();
  }
})();

// global
mixinWindow = exports.mixinWindow;
