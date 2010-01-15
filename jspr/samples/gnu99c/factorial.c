#include <stdio.h>
#include <stdlib.h>
#include <stddef.h>
#include <string.h>

#include "json.h"

#include "unescape.h"

// adapted from http://www.mattababy.org/~belmonte/Teaching/CCC/CrashCourseC.html#appendixC
unsigned long factorial(unsigned long n)
{
  unsigned long fact=1;
  for ( ; n>1; n--)
    fact *= n;
  return fact;
}

unsigned long factorial_r(unsigned long n)
{
  if (n>1)
    return n*factorial_r(n-1);
  else
    return 1;
}


int main(int argc, char **argv)
{
  json_tokener *tok;
  json_object *my_args;
  json_object *my_int;

  MC_SET_DEBUG(1);

  while (1) {
	fflush(stdout);
	char line[4096] = {0};
	char id[1024] = {0};
	char cmd[1024] = {0};
	char json[4096] = {0};

	fgets(line, 4096, stdin);
	if (!line[0]) break;

	char *s1 = strchr(line, ' ');
	if (s1 == NULL) {
	  printf("ERROR: bad json\n");
	  continue;
	}
	*s1 = 0;
	char *s2 = strchr(s1+1, ' ');
	if (s2 == NULL)  {
	  printf("ERROR: bad json\n");
	  continue;
	}
	*s2 = 0;
	strncpy(id, line, 1024);
	strncpy(cmd, s1+1, 1024);
	//  strncpy(json, s2+1, 4096);
	modp_burl_decode(json, s2+1, strlen(s2+1));

	if (json[strlen(json)-1] == '\n')
	  json[strlen(json)-1] = 0;
	fprintf(stderr, "id=%s,cmd=%s,json=%s\n", id, cmd, json);

	//  json_object_get_int(my_int)
	my_args = json_tokener_parse(json);
	if(is_error(my_args)) 
	  printf("ERROR: json error\n");
	else {
	  if (!json_object_is_type(my_args, json_type_array))
		printf("ERROR: bad json\n");
	  else {
		json_object *obj = json_object_array_get_idx(my_args, 0);
		json_object *repeat = json_object_array_get_idx(my_args, 1);
		unsigned long ret = 0;
		if (obj != NULL && repeat != NULL) {
		  int n = json_object_get_int(obj);
		  int r = json_object_get_int(repeat);
		  if (r < 0) r = 0;
		  json_object_put(obj);
		  json_object_put(repeat);
		  fprintf(stderr, "\t[%d]=%s\n", n, json_object_to_json_string(obj));
		  if (0 == strcmp(cmd, "factorial")) {
			while (r-- > 0)
			  ret = factorial(n);
		  } else if (0 == strcmp(cmd, "factorial_r")) {
			while (r-- > 0)
			  ret = factorial_r(n);
		  } else {
			printf("ERROR: bad json\n");
		  }
		}
		printf("%s %s %lu\n", id, cmd, ret);
		json_object_put(my_args);
	  }
	}
  }
  return 0;
}
