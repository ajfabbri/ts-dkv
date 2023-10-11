# Distributed Key-Value Store (DKV) CLI in Typescript

This is a toy application I created to learn the ditto.live SDK and Typescript.

## Building

```
node run build
```
See also *Setup* section below.

## Running

```
Usage: node main.js --get <key> | --set <key> <value> | --list | --watch
```

e.g. To watch changes made to the DKV by other peers:

```
node src/main.js --watch
```

This will print changes to the DKV as they are made by other clients.
Hit Ctrl-C to exit.

```
node src/main.js --set dog "Very cute, but crazy."
```

This sets the value for key "dog" to "Very cute, but crazy."

```
node src/main.js --get cat
```

This will output the value associated with the key "cat", if any.

```
node src/main.js --list
```

This will list all key, value pairs in the DKV.

## Setup

You'll need to define the following environment variables:

| | |
| ---------------- | ------------------ |
| DITTO\_APP\_ID   | Application ID |
| DITTO\_PG\_TOKEN | Playground token |

See [ditto.live onboarding](https://docs.ditto.live/onboarding) for details on how to get these values.

## Tips
I'm using direnv to automatically load [.envrc](./.envrc), which will source
the file .secret.env (excluded in [.gitignore](./.gitignore)), where I've placed these values, e.g.:

In ./secret.env:
```
export DITTO_APP_ID="my-app-id-here"
export DITTO_PG_TOKEN="my-playground-token-here"
```
