isattylinebuf.so: isattylinebuf.c
	cc -o isattylinebuf.so -fpic -shared isattylinebuf.c -ldl -lc
