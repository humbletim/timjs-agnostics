/*
  adapted from http://jackjs.org/writing-jsgi-applications.html example
*/
MyApp = function(something) {
  return function(env) {
	var ret= {
	  status : 200,
	  headers : {"Content-Type":"text/plain"},
	  body : ["Hello " + something + "!"]
	};
		
		
	if (/debug=/i.test(env['QUERY_STRING'])) {
	  for (var p in env)
		ret.body.push("\n"+p+": "+env[p]);
	}

	// JSGI is evolving fast, make headers lower-case
	if (env['jsgi.version'].join(".") > "0.2") {
	  var mcheaders = ret.headers;
	  ret.headers = {};
	  for (var p in mcheaders)
		ret.headers[p.toLowerCase()] = mcheaders[p];
	}
		
	return ret;
  }
}

app = MyApp("Fred");
