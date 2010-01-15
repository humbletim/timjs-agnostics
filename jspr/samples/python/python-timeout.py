#!/usr/bin/env python

# JavaScript Portable Runtime
# -----------------------------------------------------------------------------
# python-timeout: line-based setTimeout / setInterval
# Copyright 2009 (c) Tim
# Released under the MIT license
# -----------------------------------------------------------------------------

import sys, urllib, json

null = {}

class TO(object):
	permitted = [ 'setTimeout', 'clearTimeout' ]
	def __init__(self): pass
	def setTimeout(self, k):
		return k

to = TO()

while True:
	sys.stdout.flush()
	line = sys.stdin.readline().rstrip()
	if (not line):
		break
	elif (line == "<STDIN>"):
		sys.stdout.write("\n")
		continue
	sys.stderr.write("["+line+"]\n")
	parts = line.split(" ") + ["","",""]
	try:
		idx, ob, meth, rawargs = [ urllib.unquote(x) for x in parts[:4] ]
		try:
			args = json.loads(rawargs)
		except:
			args = []
		if (not isinstance(args, list)):
			args = []
		ret = None
		if (ob == "to"):
			sys.stderr.write(str((ob, meth, rawargs))+"\n")
			if (meth in to.permitted and hasattr(to, meth)):
				ret = getattr(to, meth)(*args)

		sys.stdout.write("NOOP\n")
		sys.stdout.flush()
		s = "%s %s\n" % (
				" ".join(parts[:3]),
				urllib.quote(json.dumps(ret))
				)
		if (meth == 'setTimeout'):
			import threading
			def comp(s):
				sys.stdout.write(s)
				sys.stdout.flush()
			t = threading.Timer(float(args[0]) / 1000.0, comp, [s])
			t.start()
		else:
			completion()

		#sys.stdout.write("%d ERROR\n" % len(line))
	except Exception, e:
		sys.stdout.write("EXCEPTION: "+repr(e)+"\n")

