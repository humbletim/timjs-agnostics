/* LD_PRELOAD shim to set stdout to line buffered mode when
   isatty is called  */

/*  "The  symbols  RTLD_DEFAULT  and RTLD_NEXT are defined by <dlfcn.h>
    only when _GNU_SOURCE was defined before including it. " */
#define _GNU_SOURCE
#include <stdlib.h>
#include <stdio.h>
#include <dlfcn.h>

int isatty (int __fd) {
  int (*real_isatty)(int __fd);
  real_isatty = dlsym(RTLD_NEXT, "isatty");
  int ret = real_isatty(__fd);
  if (!ret) setlinebuf(stdout);
  return ret;
}

