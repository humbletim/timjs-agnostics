#!/bin/sh
#// -*- mode: javascript; coding: utf-8; -*-
python ../bin/jspr-multipipe ./python/python-timeout.py ./ruby/ruby.rb $0 $*
exit
__CODE__
// -*- mode: javascript; coding: utf-8; -*-
function main() {
  var st = new Date().getTime();
  stdio.write(st);

  ruby.md5hex('ruby', function(str) {
				stdio.write((new Date().getTime() - st)+": ruby.md5hex('ruby'): "+str);
			  });
  timeout.setTimeout(
	function() { 
	  stdio.write((new Date().getTime() - st)+": c TIMEOUT (1.5 sec)"); 
	  timeout.setTimeout(exit, 0.1);
	}, 1500);

  timeout.setTimeout(
	function() { 
	  stdio.write((new Date().getTime() - st)+": a TIMEOUT (0.5 sec)"); 
	}, 500);

  timeout.setTimeout(
	function() { 
	  stdio.write((new Date().getTime() - st)+": b TIMEOUT (1 sec)"); 
	  ruby.version(function(rv) {
					stdio.write((new Date().getTime() - st)+": RUBY_VERSION: "+rv.version);
				  });
	}, 1000);
}

