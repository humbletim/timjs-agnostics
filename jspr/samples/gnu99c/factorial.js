factorial = { 
  _idx: 0,
  prefix: 'factorial',
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
  factorial: function(k, n, cb) {
	return this._q("factorial", [k,n], cb);
  },
  factorial_r: function(k,n, cb) {
	return this._q("factorial_r", [k,n], cb);
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
	  return cb.call(this, parseInt(v));
	}
	else
	  stdio.writeError("discarding!");
  }
};
handlers[factorial.prefix] = factorial;
