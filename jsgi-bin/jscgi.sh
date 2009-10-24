#!/bin/sh
# jscgi.sh -- a /cgi-bin JSGI experiment!
# copyright (c) 2009 tim
# released under the same terms as the JSGI spec

MYJSGIAPP="myapp.js"

SMJS="/usr/bin/smjs"   #spidermonkey-bin
RHINO="/usr/bin/rhino" #rhino
V8="/opt/bin/node"     # v8-shell / derivatives
CSCRIPT="/cygdrive/c/WINDOWS/system32/cscript.exe"  # cygwin/WSH

#JSCLI=$SMJS

JSCLI_ARGS="-f"
_PREJS="var exports = {};\n"

# do some simple auto-detection
if [ "$JSCLI" = "" ] ; then
	if [ -x $SMJS ] ; then
		JSCLI=$SMJS
	elif [ -x $RHINO ] ; then
		JSCLI=$RHINO
	elif [ -x $V8 ] ; then
		JSCLI=$V8
		JSCLI_ARGS="" # don't want -f
		# node's print doens't emit trailing newline like smjs/rhino, so fudge it
		_PREJS="$_PREJS;oprint=print;print=function(){oprint.apply(this,arguments);oprint('\\\n');}"
	elif [ -x $CSCRIPT ] ; then
		JSCLI=$CSCRIPT
		JSCLI_ARGS="//Nologo"
		# implement print() via WScript.Echo, .forEach
		_PREJS="$_PREJS;print=function(){WScript.Echo(Array.apply({},arguments));};Array.prototype.forEach=function(f){for(var i=0;i<this.length;i++)f(this[i]);};"
	fi
fi

######

# shell option to treat input whitespace indifferently
IFS=

# this part is untested, but might work!
if [ "$REQUEST_METHOD" = "POST" ] \
	&& [ "$CONTENT_TYPE" = "application/x-www-form-urlencoded" ] \
	&& [ ! -z "$CONTENT_LENGTH" ] ; then
 	#read -n $CONTENT_LENGTH POST_DATA #-n option available in bash but not sh
 	read POST_DATA
fi

#### pass through HTTP_ environment vars
httpenv=$(env|grep -E '^HTTP'|sed -e "s/^\(.*\?\)=\(.*$\)/'\1':'\2',/")

#### here's the inline adaptor code
envjs=";
var env = { 
  $httpenv
  JSCLI: '$JSCLI'
};
env['REQUEST_METHOD'] = '$REQUEST_METHOD';
env['SCRIPT_NAME'] = '$SCRIPT_NAME';
env['PATH_INFO'] = '$PATH_INFO';
if (env['SCRIPT_NAME'] == '/')
  env['SCRIPT_NAME'] == '';
if (env['SCRIPT_NAME'] == '')
  env['PATH_INFO'] = '/';
env['QUERY_STRING'] = '$QUERY_STRING';
env['SERVER_NAME'] = '$SERVER_NAME';
env['SERVER_PORT'] = '$SERVER_PORT';
env['jsgi.version'] = [0,2];
env['jsgi.url_scheme'] = 'http';
env['jsgi.input'] = { read: function() { return '$POST_DATA'; } };
env['jsgi.errors'] = { write: function(s) { print('X-Error: '+s); } };
env['jsgi.multithread'] = false;
env['jsgi.multiprocess'] = false;
env['jsgi.run_once'] = true;
var out;
try {
	out = exports.app(env);
} catch(e) {
  out = {
        status : 500,
        headers : {'content-type':'text/plain'},
        body : ['server error: '+e.message]
    };

  }
print('Status: '+ out.status + ' TODO');

var body = '';
out.body.forEach(function(b){body+=b;});
out.headers['content-length'] = body.length;
for (var p in out.headers)
  print(p+': '+out.headers[p]);

print('');
print(body)
"

### create a temp file (js/rhino -e "$js" had issues)
tmpfile="/tmp/jscgi.$$"
(echo $_PREJS; cat $MYJSGIAPP; echo $envjs) > $tmpfile.js

### launch the JSGI app!
#echo "$JSCLI -f $tmpfile 1> $tmpfile.stdout 2> $tmpfile.stderr" >> /dev/stderr
$JSCLI $JSCLI_ARGS $tmpfile.js 1> $tmpfile.stdout 2> $tmpfile.stderr

OUTPUT=`cat $tmpfile.stdout`	
if [ "$OUTPUT" = "" ] ; then
	echo "Status: 500 no output"
	echo "Content-Type: text/plain"
	echo ""
	cat $tmpfile.stderr
else
	echo $OUTPUT
fi

### cleanup
rm -f $tmpfile.*
