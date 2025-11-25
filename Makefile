# SHELL=bash


# lock
#
# dev
# - start databases
# - start backend
# - start app

clean: clean-ts clean-python

clean-python:
	@echo "Cleaning Python packages..."
	find -name __pycache__ -prune | xargs -i rm -r {}

clean-ts:
	@echo "Cleaning Typescript packages..."
	find -name node_modules -prune | xargs -i rm -r {}
	find -name dist -prune | xargs -i rm -r {}

install: install-ts

install-ts:
	@echo "Installing Typescript package dependencies..."
	npm install --workspaces

build: build-ts

build-ts:
	@echo "Building Typescript packages..."
	npm run build

test: test-ts

test-ts:
	@echo "Testing Typescript packages..."
	npm run test