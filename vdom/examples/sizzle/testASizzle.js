// WARNING: NOT FIT FOR HUMAN CONSUMPTION!!
try {
  _DEBUG;
} catch(e) {
  _DEBUG = false;
}

/* ---------------------------------------------------------------------------
   this was just an expiriment, but most if not all of the parts are here to
    to harvest per-VM virtual DOM modules.

   for the brave, here is how this sorta all works below:
     [bootstrap]() -> main()+ -> probe()+
	   -> setup() -> load(vdom) -> [rig window/document globals]
	     -> load(sizzle) ->
	        -> testASizzle(window)

   ughhhhly, but someone had to try an agnostic approach! ;)
   ------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------- */
// GLUE: async (ie: node, xhr) vs. sync (ie: smjs) load considerations
// DUPLICATE: src/vdom.sj
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
				   }).addErrback(function(e){ vdom_debug(e); cb(); });
	};
	vdom_debug = require('/utils.js').debug;
	_DEBUG = true; // force debug on
  } else {
	vdom_debug = (('vdom_debug' in this) ? this.vdom_debug :
				  (!('document' in this) && typeof(print) == 'function' 
				   ? print : null));
  }
}
if (_DEBUG === false || !vdom_debug) vdom_debug = function(){};

/* ------------------------------------------------------------------------- */
// GLUE: i sorta like this style of exceptional-literal feature assertion
"a load() file loader function is required: " + load;
/* ------------------------------------------------------------------------- */
// GLUE: get this global-ish object
//       (not really used -- see [rig window/document globals] below
var g = typeof(exports) == 'object' ? exports : this;
/* ------------------------------------------------------------------------- */
// GLUE:
try { exports; } catch(e) { exports = {}; }
/* ------------------------------------------------------------------------- */

/* ========================================================================= */
/* ========================================================================= */
/* ========================================================================= */
/* ============================== NOW SOME SANITY ========================== */

function testASizzle(window) {
  var doc = window.document;
  doc.body
	.innerHTML = '<div class="foo">'+
	'<div class="baz">.foo.baz</div>'+
	'<div class="bar">.foo.bar</div>'+
	'</div>';
  var result = window.Sizzle(".foo .bar", doc.body)[0].innerHTML;
  vdom_debug(result);

  //GLUE: better way to make sure our user witnesses the test results?
  try { alert(result); } catch(e) {};
  throw new Error('\n[] ------------------------------------------------'+
				  '\n[] FIXME: how else to contact our user cross-VM??'+
				  '\n[] '+result+
				  '\n[] ------------------------------------------------');
}

/* ========================================================================= */
/* ========================================================================= */
/* ========================================================================= */
/* ------------------------------------------0-----0--1--010101001101010010A */
/*                                RESUME INSANITY                            */

// GLUE: ...
function main() {
// GLUE: i wonder why primordial attachment works for super-globals so far?
  if (!Function._VDOMROOT_found)
	return probe(main);
  setup(function() {
		  g.buildWindow({}, 'about:blank', 
						function() {
						  // GLUE:
						  var sizz = Function._VDOMROOT+'/examples/sizzle/sizzle.js';
						  if (! _ASYNC) {
							load(sizz);
							testASizzle(window);
						  } else {
							load(sizz, function() {
								   testASizzle(window);
								 });
						  }
						});
		});
  
};


/* ------------------------------------------------------------------------- */
// GLUE: this tries to auto-detect where a 'package' is rooted ...
// PREDICTION: js sniffing won't be going out of style anytime soon!

var sniffs = [ ".", "..", "../.." ].reverse();

Function._VDOMROOT_found = Function._VDOMROOT ? true : false;

function probe(cb) {
  if (Function._VDOMROOT_found) {
	return cb();
  }

  Function._VDOMROOT = sniffs.pop();
  do {
	var f = Function._VDOMROOT + '/__init__.js';
	vdom_debug(f);
	if (_ASYNC)
	  return load(f, function() { probe(cb); }); // break / defer
	else
	  try { load(f); } catch(e) {} // continue / sync
  } while (!Function._VDOMROOT_found && (Function._VDOMROOT=sniffs.pop()));
  
  if (!Function._VDOMROOT_found)
	throw new Error("couldn't deduce VDOMROOT!!");
  else
	return cb();
};

/* ------------------------------------------------------------------------- */
// GLUE: more sync vs. async vs. VM fun
function setup(cb) {
  var onload = [ ];
  function runonloads() { while(onload.length) onload.shift()(); }

  // GLUE: matches sjms/rhino's native load() toSource
  var nre = /\[native/;

  if (typeof(window) == 'object') // already browser-like (not sure what to do)
	mixinWindow = function(win, cb) { cb(); }
  else {
	var vd = Function._VDOMROOT+'/src/vdom.js';
	try {
	  if (_MAKED.indexOf(vd) == -1)
		throw new Error('not _MAKED');
	} catch(e) {
	  if ((''+load).match(nre)) // or ! _ASYNC maybe
		load(vd);
	  else
		load(vd, function() {
			   setTimeout(runonloads, 1); // hope for best since not real loader
			 });
	}
  }
  g.buildWindow = function(win, uri, cb) {
	function ready() {
	  mixinWindow(win, function() { // GLUE: [rig window/document globals]
					// we make everything global so cs scripts are happy(ier)
					g.window = win;
					g.document = win.document;
					g.navigator = win.navigator;
					try { // perhaps even more global than that
					  window = g.window;
					  document = g.document;
					  navigator = g.navigator;
					} catch(e) {};
					with (g) { // for example?
					  window.location = uri; // kickoff env.js, may be wrong
					  cb(win);
					}
				  });
	}
	if (typeof(mixinWindow)=='undefined') //could also be 'if (_ASYNC)'
	  onload.push(ready);                 
	else
	  ready();
  };
  //GLUE: messy, messy, messy
  onload.push(cb);

  if (! _ASYNC)
	runonloads();
}

/* ------------------------------------------------------------------------- */
// GLUE: bootstraping
main();
