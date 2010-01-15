timeout = { 
  _idx: 0,
  prefix: 'python-timeout.py',
  idmap: {},
  _q: function(f,a,cb) {
	var k = (this._idx++)+"";
	for (var i=0; i < a.length; i++)
	  a[i] = typeof a[i] == 'number' ? a[i] : '"'+a[i].toString().replace(/\"/g, '\\"')+'"';
	var json = '['+a.join(",")+']';
	if (cb)
	  this.idmap[k] = cb;
	this.emit(k+" to "+f+" "+escape(json));
	return k;
  },
//   get: function( k, cb) {
// 	return this._q("get", [k], cb);
//   },
  setTimeout: function(cb, k) {
	return this._q("setTimeout", [k], cb);
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
	  cb.call(this, unescape(v));
	}
	else
	  stdio.writeError("discarding!");
  }
};
handlers[timeout.prefix] = timeout;
