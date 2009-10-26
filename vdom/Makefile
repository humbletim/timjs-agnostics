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

$(SLURP_NAME).broken.js: $(SLURP)
	echo "var _MAKED = '$(SLURP)'.split(' ');\n" > $(SLURP_NAME).broken.js
	cat $(SLURP) >> $(SLURP_NAME).broken.js

clean: 
	rm $(SLURP_NAME).broken.js
