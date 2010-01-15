#!/bin/bash
if [ ! -d json-c-0.9 ] ; then
	tar xzf json-c-0.9.tar.gz
fi
cd json-c-0.9
if [ ! -f Makefile ] ; then 
	./configure
fi
make test1
cd ..
DOIT="gcc -I./json-c-0.9 -std=gnu99 factorial.c json-c-0.9/.libs/libjson.a -o factorial"
echo $DOIT
$DOIT
ls -l factorial

