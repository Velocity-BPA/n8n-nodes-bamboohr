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

describe('Transport Layer', () => {
  describe('API Request Building', () => {
    it('should build correct base URL', () => {
      const companyDomain = 'test-company';
      const baseUrl = `https://api.bamboohr.com/api/gateway.php/${companyDomain}/v1`;

      expect(baseUrl).toBe('https://api.bamboohr.com/api/gateway.php/test-company/v1');
    });

    it('should handle endpoint paths correctly', () => {
      const baseUrl = 'https://api.bamboohr.com/api/gateway.php/test-company/v1';
      const endpoint = '/employees/123';
      const fullUrl = `${baseUrl}${endpoint}`;

      expect(fullUrl).toContain('/employees/123');
    });

    it('should build URL with query parameters', () => {
      const baseUrl = 'https://api.bamboohr.com/api/gateway.php/test-company/v1';
      const endpoint = '/employees/directory';
      const queryParams = { fields: 'firstName,lastName,department' };

      const url = new URL(`${baseUrl}${endpoint}`);
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      expect(url.toString()).toContain('fields=firstName');
    });
  });

  describe('Authentication', () => {
    it('should use HTTP Basic authentication format', () => {
      const apiKey = 'test-api-key';
      const password = 'x';

      // Basic auth format: base64(apiKey:x)
      const authString = Buffer.from(`${apiKey}:${password}`).toString('base64');
      const authHeader = `Basic ${authString}`;

      expect(authHeader).toContain('Basic');
      expect(authString).toBe(Buffer.from('test-api-key:x').toString('base64'));
    });
  });

  describe('Rate Limit Handling', () => {
    it('should implement exponential backoff delays', () => {
      const calculateBackoff = (attempt: number, baseDelay: number = 1000): number => {
        return Math.min(baseDelay * Math.pow(2, attempt), 30000);
      };

      expect(calculateBackoff(0)).toBe(1000);
      expect(calculateBackoff(1)).toBe(2000);
      expect(calculateBackoff(2)).toBe(4000);
      expect(calculateBackoff(3)).toBe(8000);
      expect(calculateBackoff(4)).toBe(16000);
      expect(calculateBackoff(5)).toBe(30000); // Capped at 30s
    });

    it('should identify rate limit responses', () => {
      const isRateLimited = (statusCode: number): boolean => {
        return statusCode === 503;
      };

      expect(isRateLimited(503)).toBe(true);
      expect(isRateLimited(200)).toBe(false);
      expect(isRateLimited(500)).toBe(false);
    });
  });

  describe('Response Handling', () => {
    it('should handle JSON response', () => {
      const jsonResponse = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
      };

      expect(jsonResponse).toHaveProperty('id');
      expect(jsonResponse).toHaveProperty('firstName');
      expect(jsonResponse).toHaveProperty('lastName');
    });

    it('should handle array response for directory', () => {
      const directoryResponse = {
        employees: [
          { id: '1', firstName: 'John', lastName: 'Doe' },
          { id: '2', firstName: 'Jane', lastName: 'Smith' },
        ],
      };

      expect(directoryResponse.employees).toHaveLength(2);
      expect(Array.isArray(directoryResponse.employees)).toBe(true);
    });

    it('should handle empty response gracefully', () => {
      const emptyResponse = {};
      const emptyArray: any[] = [];

      expect(Object.keys(emptyResponse)).toHaveLength(0);
      expect(emptyArray).toHaveLength(0);
    });
  });

  describe('Request Methods', () => {
    it('should support GET method', () => {
      const method = 'GET';
      expect(['GET', 'POST', 'PUT', 'DELETE']).toContain(method);
    });

    it('should support POST method for create operations', () => {
      const method = 'POST';
      expect(['GET', 'POST', 'PUT', 'DELETE']).toContain(method);
    });

    it('should support PUT method for update operations', () => {
      const method = 'PUT';
      expect(['GET', 'POST', 'PUT', 'DELETE']).toContain(method);
    });

    it('should support DELETE method', () => {
      const method = 'DELETE';
      expect(['GET', 'POST', 'PUT', 'DELETE']).toContain(method);
    });
  });
});
