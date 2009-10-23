#!/bin/sh
# jscgi.sh -- a /cgi-bin JSGI experiment!
# copyright (c) 2009 tim
# released under the same terms as the JSGI spec

MYJSGIAPP="myapp.js"

if [ "$JSCLI" = "" ] ; then
	JSCLI="js" # or rhino
fi

######

IFS=

if [ "$REQUEST_METHOD" = "POST" ] \
	&& [ "$CONTENT_TYPE" = "application/x-www-form-urlencoded" ] \
	&& [ ! -z "$CONTENT_LENGTH" ] ; then
 	read -n $CONTENT_LENGTH POST_DATA
fi

#### pass through HTTP_ environment vars
httpenv=$(env|grep -E '^HTTP'|sed -e "s/^\(.*\?\)=\(.*$\)/'\1':'\2',/")

#### here's the inline adaptor code
envjs=";
var env = { JSCLI: '$JSCLI', $httpenv };
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
	out = app(env);
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
(cat $MYJSGIAPP; echo $envjs) > $tmpfile.js

### launch the JSGI app!
#echo "$JSCLI -f $tmpfile 1> $tmpfile.stdout 2> $tmpfile.stderr" >> /dev/stderr
$JSCLI -f $tmpfile.js 1> $tmpfile.stdout 2> $tmpfile.stderr

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


