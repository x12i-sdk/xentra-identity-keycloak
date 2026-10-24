import assert from 'node:assert/strict';
import { createKeycloakAdapter, createKeycloakJwksValidator } from '@x12i/xentra-identity-keycloak';
import { generateKeyPairSync, sign } from 'node:crypto';
const issuer = 'https://identity.example.invalid/realms/fixture';
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'fixture-key', alg: 'RS256', use: 'sig' };
const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const payload = { sub: 'fixture-user', iss: issuer, aud: 'fixture-app', iat: now, exp: now + 300 };
const unsigned = encode({ alg: 'RS256', kid: 'fixture-key' }) + '.' + encode(payload);
const token = unsigned + '.' + sign('RSA-SHA256', Buffer.from(unsigned), privateKey).toString('base64url');
const originalFetch = globalThis.fetch;
globalThis.fetch = async url => { assert.equal(String(url), issuer + '/protocol/openid-connect/certs'); return Response.json({ keys: [jwk] }); };
try {
  const validator = createKeycloakJwksValidator({ baseUrl: 'https://identity.example.invalid', realm: 'fixture', audience: 'fixture-app' });
  const client = { createOrganization: async () => ({ provider: 'keycloak', externalId: 'fixture-org' }),
    createUser: async () => ({ provider: 'keycloak', externalId: 'fixture-user' }), createGroup: async () => ({ provider: 'keycloak', externalId: 'fixture-group' }),
    verifyToken: async ({ token }) => ({ externalUserId: (await validator.verify(token)).sub }),
  };
  const adapter = createKeycloakAdapter({ baseUrl: 'https://identity.example.invalid', realm: 'fixture', clientId: 'fixture-app' }, client);
  assert.equal((await adapter.verifyExternalToken({ token })).externalUserId, 'fixture-user');
  await assert.rejects(() => adapter.verifyExternalToken({ token: unsigned + '.invalid' }));
  console.log({ verifiedSubject: 'fixture-user', invalidSignatureRejected: true });
} finally { globalThis.fetch = originalFetch; }
