.PHONY: all build run test clean help

all: build

build:
	zig build

run: build
	./zig-out/bin/basics

test: build
	zig build test

clean:
	rm -rf zig-out .zig-cache

help:
	@echo "Usage:"
	@echo "  make build  - Build the project"
	@echo "  make run    - Build and run the binary"
	@echo "  make test   - Run tests"
	@echo "  make clean  - Remove build artifacts"
	@echo "  make help   - Show this help"
