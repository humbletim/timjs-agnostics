PACKAGE = vdom-js
VERSION = 0.0

SLURP = \
	__init__.js \
	libs/ajaxslt-0.8.1/xmltoken.js \
	libs/ajaxslt-0.8.1/util.js \
	libs/ajaxslt-0.8.1/dom.js \
	src/preenv.js \
	src/vdom-env.js \
	src/postenv.js \
	src/vdom.js \
	examples/sizzle/testASizzle.js

SLURP_NAME = $(PACKAGE)-$(VERSION)

$(SLURP_NAME).temp.js: $(SLURP)
	@echo "slurping up files into $(SLURP_NAME).temp.js..."
	@echo "var _MAKED = '$(SLURP)'.split(' ');\n" > $(SLURP_NAME).temp.js
	@cat $(SLURP) >> $(SLURP_NAME).temp.js

clean: 
	@rm $(SLURP_NAME).temp.js

test: $(SLURP_NAME).temp.js	

test-smjs: clean test
	smjs $(SLURP_NAME).temp.js 2>&1 | fgrep '[]'

test-rhino: clean test
	rhino $(SLURP_NAME).temp.js 2>&1 | fgrep '[]'

test-node: clean test
	/opt/bin/node $(SLURP_NAME).temp.js 2>&1 | fgrep '[]'
