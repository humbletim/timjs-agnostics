// post env.js patches
// Copyright 2009 Tim Dedischew, under the MIT License

var _createENV = createENV; // this was added directly to env.js
createENV = function(window) {
  var ret = _createENV.apply(this, arguments);
  var old = window.DOMDocument;
  window.DOMDocument = function(file) { 
	//weld.printf('DOMDocument('+file+')'); 
	this._dom = xmlParse(''+file); 
	this._dom.ownerDocument=this;
	if ( !window.obj_nodes.containsKey( this._dom ) )
	  window.obj_nodes.put( this._dom, this );
  };
  window.DOMDocument.prototype = old.prototype;
  window.DOMDocument.prototype.createComment = function(txt) {
	//FIXME
	return this.createTextNode("<!--"+txt+"-->");
  };

  
  window.DOMElement.prototype.__defineGetter__("tagName", function() { return this._dom.getTagName(); });
  
  window.navigator.__defineGetter__("appName", function(){ return "Netscape"; });
  window.navigator.__defineGetter__("appVersion", function(){ return "5.0 (X11; en-US)"; });
  window.navigator.__defineGetter__("language", function(){ return "en-us"; });
  return ret;
};


