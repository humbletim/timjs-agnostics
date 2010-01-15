ruby = { 
  _idx: 0,
  prefix: 'ruby.rb',
  idmap: {},
  _q: function(f,a,cb) {
	var k = (this._idx++)+"";
	for (var i=0; i < a.length; i++)
	  a[i] = typeof a[i] == 'number' ? a[i] : 
		'"'+a[i].toString().replace(/\\/g,'\\\\').replace(/\"/g, '\\"')+'"';
	var json = '['+a.join(",")+']';
	if (cb)
	  this.idmap[k] = cb;
	this.emit(k+" "+f+" "+escape(json));
	return k;
  },
  now: function(cb) {
	return this._q("getNow", [], cb);
  },
  md5hex: function(k, cb) {
	return this._q("md5hex", [k], cb);
  },
  version: function( cb) {
	return this._q("getVersion", [], cb);
  },
  emit: function(s) {
	stdio.writeError(this.prefix+":"+s);
	return stdio.emit(this.prefix+":"+s);
  },
  processResult: function (data) {
	var kv = data.split(' ');
	var k = kv[0], v=kv.pop();
	stdio.writeError("result: ["+k+"]="+unescape(v));
	var cb;
	if (cb=this.idmap[k]) {
	  delete this.idmap[k];
	  v = unescape(v);
	  try {
		var tmp = eval("(function() { return "+v+";})()");
		return cb.call(this, tmp);
	  } catch(e) {
		return cb.call(this, e);
	  }
	}
	else
	  stdio.writeError("discarding!");
  }
};
handlers[ruby.prefix] = ruby;
