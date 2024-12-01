# Helper Bot

A general purpose Discord bot with a flexible web interface for creating custom commands

## Getting Started

### Clone the repository and install dependencies

- `git clone git@github.com:cudd-io/helper-v2.git`
- `cd helper-v2`
- `bun install`

### Setup environment variables

- Copy `.env.example` to `.env`: `cp .env.example .env`
- Modify `.env`, providing your own credentials
- Run `bun run env:prepare` to copy `.env` to all projects within the monorepo

### Set up the database

- Build the db package: `bun run build:db`
- Push the database: `bun run db:push`
