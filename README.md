# Helper Bot

A general purpose Discord bot with a flexible web interface for creating custom commands

## Getting Started

### Clone the repository and install dependencies

```sh
git clone git@github.com:cudd-io/helper-v2.git
cd helper-v2
bun install
```

### Setup environment variables

Copy `.env.example` to `.env`:

```sh
cp .env.example .env
```

Modify `.env`, providing your own credentials  
Copy `.env` to all projects within the monorepo:

```sh
bun run env:prepare
```

### Setup the database

Build the db package:

```sh
bun run build:db
```

Push the database:

```sh
bun run db:push
```
