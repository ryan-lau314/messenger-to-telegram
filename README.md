# messenger-to-telegram

## Setup

Install dependencies

```
npm install
```

Change the verify token in `.env` to a random string.

## Run server

```
./src/index.js
```

## Test

### Verify endpoint

```
curl -X GET "localhost:80/webhook?hub.verify_token=<YOUR_VERIFY_TOKEN>&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
```

### Submit messages

```
curl -H "Content-Type: application/json" -X POST "localhost:80/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}'
```
