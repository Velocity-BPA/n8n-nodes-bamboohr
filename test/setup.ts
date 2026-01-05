/**
 * [Velocity BPA Licensing Notice]
 *
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 *
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 *
 * For licensing information, visit https://velobpa.com/licensing
 * or contact licensing@velobpa.com.
 */

// Jest test setup file
beforeAll(() => {
  // Suppress console.warn for licensing notice during tests
  jest.spyOn(console, 'warn').mockImplementation((message) => {
    if (!message?.includes?.('Velocity BPA Licensing Notice')) {
      console.log(message);
    }
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

// Global test timeout
jest.setTimeout(10000);
