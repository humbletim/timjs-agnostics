#!/bin/sh
timeit='env time -o /dev/stdout -p'
echo "--------------------------------"
JSCLI=/opt/bin/v8-shell
echo 'quit()' | $JSCLI 2>&1 | head -1 #print version
echo $JSCLI
$timeit sh -c "echo '10000000' | env JSTIMEOUT=10 JSCLI=$JSCLI ./test.factorial.jsx -c " 

echo "--------------------------------"
JSCLI=/opt/bin/jsc
echo $JSCLI
$timeit sh -c "echo '10000000' | env JSTIMEOUT=10 JSCLI=$JSCLI ./test.factorial.jsx -c "

echo "--------------------------------"
JSCLI=/usr/bin/smjs
echo 'help()' | $JSCLI 2>&1 | head -1 #print version
echo $JSCLI
$timeit sh -c "echo '10000000' | env JSTIMEOUT=10 JSCLI=$JSCLI ./test.factorial.jsx -c "

echo "--------------------------------"
JSCLI=/usr/bin/rhino
echo 'quit()' | $JSCLI 2>&1 | head -1 #print version
echo $JSCLI
$timeit sh -c "echo '10000000' | env JSTIMEOUT=10 JSMAXCPU=5 JSCLI=$JSCLI ./test.factorial.jsx -c "

