#/bin/sh
# test.equalfuncsrc.sh:
#    demonstrates function source equivalence across serialization (via toString)
# Copyright (c) 2010 Tim Dedischew
# LICENSE-MIT

JSTEST="
func = function module(a,b,c) {
  function myfunc(x,y,z) {
	function yourfunc(p,q,r) {
	  return Infinity;
	}	
	return NaN;
  }
  return null;
};
 
print(func.toString() == eval('1,'+func.toString()).toString());
quit();
"

# my runtimes are in /opt/bin, update this list and /opt/bin below to yours
for JSCLI in jsc rhino smjs v8-shell ; do
	echo "-- $JSCLI --"
	echo $JSTEST | /opt/bin/$JSCLI
done
