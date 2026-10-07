# Fix: `invalid length of startup packet` on `callbook_db`

## Symptom

Running `sudo docker compose up --build` starts the API correctly:

```
callbook_api  | [Nest] LOG [NestApplication] Nest application successfully started
callbook_api  | API is running in http://localhost:3015
```

But shortly after, the `callbook_db` container repeatedly logs:

```
callbook_db   | LOG:  invalid length of startup packet
```

## Root cause

In `docker-compose.yaml`, the `db` service published its port as:

```yaml
ports:
  - "${POSTGRES_PORT}:${POSTGRES_PORT}"
```

Docker's default bind address for a published port is `0.0.0.0`, meaning Postgres
was listening on **every** network interface of the host, not just `localhost`.

On this machine that includes the LAN interface (`10.1.22.10/24`) and several other
Docker bridge networks already in use for other projects. Any stray TCP traffic
that reaches port 5432 from those networks — scans, health checks, or any client
that isn't speaking the Postgres wire protocol — gets a few raw bytes read as the
first 4-byte length field of a startup packet. If those bytes don't form a sane
length, Postgres logs exactly `invalid length of startup packet` and drops the
connection.

This is not a crash and doesn't stop the API from working (it already connects
successfully over the internal Docker network using `POSTGRES_HOST=db`), but it is
log noise caused by unnecessarily exposing the database to the whole network, and a
real security concern on a shared LAN.

## Fix

Bind the published Postgres port to the loopback interface only, so it's reachable
from the host machine (e.g. `psql -h localhost -p 5432`, DBeaver, etc.) but not
from the LAN or other Docker networks:

```yaml
ports:
  - "127.0.0.1:${POSTGRES_PORT}:${POSTGRES_PORT}"
```

The `app` service doesn't need this change — it talks to the database over the
internal Compose network via the `db` hostname and never uses the published port.

## Other changes already present in the working tree (kept as-is)

- `pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}` — healthcheck was checking
  against `${POSTGRES_NAME}` (the container name) instead of `${POSTGRES_DB}` (the
  actual database name), which could make the healthcheck unreliable.
- Added a named volume (`postgres_data`) so database data survives
  `docker compose down` / container recreation.
- Quoted the port mapping value.

## Verification

```sh
sudo docker compose up --build
# callbook_db no longer logs "invalid length of startup packet"
psql -h 127.0.0.1 -p 5432 -U test -d callbook_db   # still works from the host
```
