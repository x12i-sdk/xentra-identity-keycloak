# @x12i/xentra-identity-keycloak usage example

Keycloak identity adapter for Xentra.

This consuming application demonstrates **verify a locally signed token through an explicit keycloak client** using the published npm package, pinned to `0.2.0`.

## Run

Requires Node.js 24 or newer and npm. The example needs no service credentials.

```sh
npm install --ignore-scripts
npm start
```

## Example

[`src/index.mjs`](src/index.mjs) contains the complete example. Assertions check the demonstrated behavior and the program prints a small result.

## When to use the package

- Connect Keycloak identity data through the Xentra identity adapter.
- Use the adapter in a host that already configures Keycloak authentication.

## Links

- [npm package](https://www.npmjs.com/package/@x12i/xentra-identity-keycloak)
- [Implementation monorepo](https://github.com/x12i/xentra)
- [Reviewed package source](https://github.com/x12i/xentra/tree/004372e6695509bf2e95d2e4e53d4534e81dd312/packages/identity-keycloak)

The `package.json` in this repository is private to prevent accidental publication of the example application under an npm package name.

## Local fixture scope

All identifiers, tokens, responses and records in this example are synthetic. Injected transports and in-memory stores do not contact a real identity provider, broker, VPN, or cloud service. File workflows create their own temporary directory and remove only that directory. The HTTP example binds a temporary loopback listener.

## Explicit verification client

Supply an explicit client that verifies signatures, issuer, audience and expiry. The pinned adapter's fallback when no client is supplied only decodes JWT claims, and several administrative methods are empty. This example uses the separately exported JWKS validator, ephemeral signing keys, and an injected public-key response. It checks a valid signature and rejects a changed signature; it does not prove a live Keycloak deployment or administrative lifecycle.
