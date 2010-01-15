#! ../../bin/jspr-multipipe ./ruby.rb
// -*- mode: javascript; coding: utf-8; -*-

function main() {
  if (STDIN.length)
	stdio.write("STDIN: "+STDIN);
  
  ruby.version(
	function(rv) {

	  for (var p in rv)
		stdio.write(p+": "+rv[p]);
	  
	  ruby.md5hex("ruby",
				  function(str) {
					// ---------------
					stdio.write("md5('ruby'): "+str);
					exit();
				  });
	});
}
