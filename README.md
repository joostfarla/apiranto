# Apiranto

## Introduction

The Apiranto project provides a full-featured and flexible documentation
generator for Swagger specs. This project is loosely inspired by the
[Aglio](https://github.com/danielgtaylor/aglio) project.

## Installation

Install Apiranto globally using NPM:

```bash
npm install -g apiranto
```

## Generate docs

Run the `generate` command to generate the documentation:

```bash
apiranto generate spec/swagger.json docs
```

This command takes the Swagger spec from the `/spec` directory and generates the
documentation in the `docs` directory.

## License

ISC License. See the [LICENSE](LICENSE) file.
