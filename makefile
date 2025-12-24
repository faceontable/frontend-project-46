install:
	npm install
gendiff-help:
	node ./bin/gendiff.js -h
test:
	npm test
test-coverage:
	npm test -- --coverage
lint:
	npx eslint .
lint-fix:
	npx eslint . --fix