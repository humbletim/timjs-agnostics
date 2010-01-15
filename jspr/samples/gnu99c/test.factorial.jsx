#! ../../bin/jspr-multipipe ./factorial
// -*- mode: javascript; coding: utf-8; -*-

function jsfactorial(n)
{
  var fact=1;
  for ( ; n>1; n--)
    fact *= n;
  return fact;
}

function jsfactorial_r(n)
{
  if (n>1)
    return n*jsfactorial_r(n-1);
  else
    return 1;
}

var st;
function main() {  
  var r = STDIN[0] > 0 ? parseInt(STDIN[0]) : 1000000; // 10M reptitions

  // slowest (sample 1/1000th and interpolate)
  st = new Date().getTime();
  for (var i=0; i < r/1000; i++)
	ret = jsfactorial_r(5);
  stdio.write("~"+(new Date().getTime() - st)+" s / "+r+
			  ": jsfactorial_r(5): "+ret);

  // slower (sample 1/1000th and interpolate)
  st = new Date().getTime();
  for (var i=0; i < r/1000; i++)
	ret = jsfactorial(5);
  stdio.write("~"+(new Date().getTime() - st)+" s / "+r+
			  ": jsfactorial(5): "+ret);

  // faster
  st = new Date().getTime();
  factorial.factorial_r(
	5, r, function(f) {
	  stdio.write("="+(new Date().getTime() - st)+"ms / "+r+
				  ": factorial_r(5): "+f);
	  
	  // fastest
	  st = new Date().getTime();
	  factorial.factorial(
		5,r, function(f) {
		  stdio.write("="+(new Date().getTime() - st)+"ms / "+r+
					  ": factorial(5): "+f);
		  exit();
		}
	  );
	}
  );
}
