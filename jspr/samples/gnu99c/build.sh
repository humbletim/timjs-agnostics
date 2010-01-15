#!/bin/sh
# tar xzf json-c-0.9.tar.gz
# cd json-c-0.9
# ./configure && make test1
# cd ..
# gcc -I./json-c-0.9 -std=gnu99 factorial.c json-c-0.9/.libs/libjson.a -o factorial
cat build.sh | tail -2|head -1|dd bs=1 skip=1 2>/dev/null
