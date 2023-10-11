# Distributed Key-Value Store (DKV) CLI in Typescript

This is a toy application I created to learn the ditto.live SDK and Typescript.

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
