#!/bin/sh
echo '100000000' | JSTIMEOUT=30 JSMAXCPU=10 ./test.factorial.jsx -c
