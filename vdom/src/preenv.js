// patches and class stubs against runtime env.js
// Copyright 2009 Tim Dedischew, under the MIT License

var dummyHTML = "<html><head><title>about:blank</title></head><body></body></html>";

var java = {
  nio: {
	ByteBuffer: {
	  wrap: function(n) { return n; }
	},
	charset: {
	  Charset: {
		forName: function() {
		  return {
			decode: function(s) { 
			  return s;
			}
		  };
		}
	  }
	}
  },
  io: {
	File: function() { return { toURL: function() { return 'about:blank'; } } },
	ByteArrayOutputStream: function(s) { this.s = s||""; },
	ByteArrayInputStream: function(s) { this.s = s||""; }
	
  },
  util: {
	HashMap: function() { return {
	  containsKey: function(k) { return this[k.nid]; },
	  put: function(k, v) { if (!k.nid) k.nid = Math.random(); this[k.nid] = v; },
	  get: function(k) { return this[k.nid]; }
	  }; }
  },
  lang: {
	Byte: function() {},
	Runnable: function(kw) { this.kw = kw; },
	String: function(s) { this.bytes = s; },
	Thread: function(runable) { this.runable=runable; },
	reflect: {
	  Array: { newInstance: function(){ return []; } }
	  }
  },
  net: {
	URL: function(cur, url) { 
	  this.cur = cur; 
	  this.url = url; 
	}
  }
};

java.lang.String.prototype = {
  getBytes: function() { return this.bytes; }
};
java.io.ByteArrayOutputStream.prototype = {
  write: function(buf, s, e) {
	this.s += buf.data.substr(s, e);
	},
  close: function() {},
  toByteArray: function() { return this.s; },
  toString: function() { return this.s; }
};
java.io.ByteArrayInputStream.prototype = {
  toString: function() { return this.s; }
};

java.net.URL.prototype = {
  toString: function() { return this.url; },
  getProtocol: function(){ return "http"; },
  openConnection: function(){ return { 
	URL: this,
	connect: function(){ if (this.URL.url != 'about:blank') throw new Error('java.net.URL.openConnection.connect mock only supports one URI: "about:blank"...'+this.URL.url); },
	setRequestMethod: function(method) { this.method = method; },
	getContentEncoding: function(i)
	{ 
	  var tmp = new String("UTF-8"); 
	  tmp.equalsIgnoreCase = function(s) {
		return this.toLowerCase() == s.toLowerCase(); 
	  };
	  return tmp; 
	},
	getHeaderFieldKey: function(i) { return; },
	getHeaderField: function(i) { return; },
	getInputStream: function() { return { 
	  URL: this.URL,
	  close: function(){}, 
	  read: function(buf) { 
		if(buf.data) return -1; 
		buf.data = this.URL.HTML||dummyHTML; 
		return buf.data.length; 
								   }}; }
  }; }
};

java.lang.Thread.prototype = {
  start: function() { 
	this.runable.kw.run();
  }
};

var map = {};
for (var p in this) {
  if (p.indexOf('DOM_') == 0)
	map[this[p]] = p;
}
function nt(n) {
  return map[n];
};

_XNodeList = function() { this.toString = function() { return "[_XNodeList "+this.length+"]"; } };
_XNodeList.prototype = Array.prototype;
XNodeList = function(arr) { if(arr)for(var i=0; i < arr.length; i++)this.push(arr[i]); };
XNodeList.prototype = new _XNodeList();
XNodeList.prototype.constructor = XNodeList;
XNodeList.prototype.getLength = function() { return this.length; };
XNodeList.prototype.item = function(i) { return this[i]; };

XNode.prototype.toString = function() { return '['+nt(this.nodeType)+' '+this.nodeName+']'; };
XNode.prototype.getFirstChild = function() { /*weld.debug("gfc:"+this); */ return this["firstChild"]; };
XNode.prototype.getParentNode = function() { return this["parentNode"]; };
XNode.prototype.getNextSibling = function() { return this["nextSibling"]; };
XNode.prototype.getPreviousSibling = function() { return this["previousSibling"]; };
XNode.prototype.getAttributes = function() { return new XNodeList(this.attributes); };
XNode.prototype.getChildNodes = function() { return new XNodeList(this.childNodes); };
XNode.prototype.getNodeType = function() { return this.nodeType; };
XNode.prototype.getNodeValue = function() { return this.nodeValue; };
XNode.prototype.getTagName = function() { return this.nodeName; };
XNode.prototype.getNodeName = XNode.prototype.getTagName;
XNode.prototype.hasAttribute = function(name) { return !!this.getAttribute(name); };

// rewrite original function from ajaxslt-0.8.1/dom.js to utilize new XNodeList() instead of []
// ... a kludge, but .toSource|toString appears to be portable across VMs w/getters and setters... -tim
(function() {
  var tmp = XNode.prototype.getElementsByTagName;
  var js;
  if (typeof(tmp.toSource) == 'function')
	js = tmp.toSource();
  else
	js = tmp.toString();

  XNode.prototype.getElementsByTagName = eval(js.replace('ret = []', 'ret = new XNodeList();'));
})();

/*
XNode.prototype._getElementsByTagName = XNode.prototype.getElementsByTagName;
XNode.prototype.getElementsByTagName = function(tn, list) {
  if (!list)
	list = new XNodeList();
  print("gebtn("+tn+","+list+")");
  return this._getElementsByTagName.call(this, tn, list);
};
*/ 

XDocument.prototype.getDocumentElement = function() { return this.childNodes[0]; };
XDocument.prototype.importNode = function(n,d) { return xmlParse(xmlText(n)).firstChild; };
