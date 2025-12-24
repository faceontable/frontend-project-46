gendiff-help:
	node ./bin/gendiff.js -h
lint:
	npx eslint .
test:
	npx jest --coverage