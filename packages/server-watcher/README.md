## Postgres

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
