# Distributed Key-Value Store (DKV) CLI in Typescript

This is a toy application I created to learn the ditto.live SDK and Typescript.

### Set Up

```
npm install
npm run build
```

### Usage

```
main.ts --get <key> | --set <key> <value> | --list | --watch
```

e.g. To watch changes made to the DKV by other peers:

```
npm start --watch
```

This will print changes to the DKV as they are made by other clients.
Hit Ctrl-C to exit.

```
npm start --set dog "Very cute, but crazy."
```

This sets the value for key "dog" to "Very cute, but crazy."

```
npm start --get cat
```

This will output the value associated with the key "cat", if any.

```
npm start --list
```

This will list all key, value pairs in the DKV.

## Setup

### Configuration
You'll need to define the following environment variables:

| | |
| ---------------- | ------------------ |
| DITTO\_APP\_ID   | Application ID |
| DITTO\_PG\_TOKEN | Playground token |

See [ditto.live onboarding](https://docs.ditto.live/onboarding) for details on how to get these values.

### Ditto SDK from source

If you want to use a locally-built Ditto SDK package, follow the instructions
in ditto/js/README.md to build it, then use `npm link <path to ditto dist>` to
use it here. E.g.:

```
cd ditto/js                     # See readme here on prereqs.
npm install
variants=node npx jake dist
cd ../../ts-dkv                 # Your path may differ.
npm install
npm link ../ditto/js/dist       # so fix that afterward.
npm start
```

## Tips
I'm using direnv to automatically load [.envrc](./.envrc), which will source
the file .secret.env (excluded in [.gitignore](./.gitignore)), where I've placed these values, e.g.:

In ./secret.env:
```
export DITTO_APP_ID="my-app-id-here"
export DITTO_PG_TOKEN="my-playground-token-here"
```
