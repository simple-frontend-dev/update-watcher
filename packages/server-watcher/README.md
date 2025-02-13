# Server Watcher

Watches frontend repositories releases and creates [issues](https://github.com/simple-frontend-dev/update-watcher/issues)

## Setup

### Dependencies

Managed with pnpm workspaces: `pnpm install` at the root

### Postgres

```bash
sudo service postgresql start
sudo -u postgres psql
```

in psql:

```psql
CREATE ROLE %USERNAME% SUPERUSER LOGIN;
```

```bash
createdb local_db_server_watcher
psql -U %USERNAME% -d local_db_server_watcher
```

in psql:

```psql
CREATE USER local_user WITH PASSWORD 'local_password';
GRANT CREATE ON SCHEMA public TO local_user;
```

## Architecture

Can initialize a release database with the last 10 releases of a given repository

Polls every 4 hours these repoositories for updates and if found then it creates an issue in https://github.com/simple-frontend-dev/update-watcher/issues with the release metadata

Uses fastify as it speeds up pg access, server does not need to listen to any requests.
