#!/bin/sh
python ../../bin/jspr-multipipe ./python-timeout.py $0 $*
exit
__CODE__
// -*- mode: javascript; coding: utf-8; -*-

function main() {
  var st = new Date().getTime();
  stdio.write(st);

  timeout.setTimeout(
	function() { 
	  stdio.write((new Date().getTime() - st)+": c TIMEOUT (1.5 sec)"); 
	  timeout.setTimeout(exit, 0.1);
	}, 1500);

  timeout.setTimeout(
	function() { 
	  stdio.write((new Date().getTime() - st)+": a TIMEOUT (0.5 sec)"); 
	}, 500);

  timeout.setTimeout(
	function() { 
	  stdio.write((new Date().getTime() - st)+": b TIMEOUT (1 sec)"); 
	}, 1000);
}

