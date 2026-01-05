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

// Mock n8n-workflow types and interfaces for testing

export interface INodeProperties {
  displayName: string;
  name: string;
  type: string;
  default?: any;
  description?: string;
  required?: boolean;
  displayOptions?: any;
  options?: any[];
  placeholder?: string;
  typeOptions?: any;
}

export interface INodePropertyOptions {
  name: string;
  value: string | number;
  description?: string;
}

export interface IExecuteFunctions {
  getInputData(): any[];
  getNodeParameter(parameterName: string, itemIndex: number, fallbackValue?: any): any;
  getCredentials(type: string): Promise<any>;
  helpers: {
    request(options: any): Promise<any>;
    requestWithAuthentication(credentialsType: string, options: any): Promise<any>;
    httpRequest(options: any): Promise<any>;
    httpRequestWithAuthentication(credentialsType: string, options: any): Promise<any>;
    prepareBinaryData(buffer: Buffer, fileName?: string, mimeType?: string): Promise<any>;
    returnJsonArray(items: any[]): any[];
  };
  continueOnFail(): boolean;
}

export interface ICredentialTestFunctions {
  helpers: {
    request(options: any): Promise<any>;
  };
}

export interface ICredentialDataDecryptedObject {
  [key: string]: any;
}

export interface INodeCredentialTestResult {
  status: 'OK' | 'Error';
  message: string;
}

export interface INodeTypeDescription {
  displayName: string;
  name: string;
  icon: string;
  group: string[];
  version: number;
  subtitle?: string;
  description: string;
  defaults: {
    name: string;
  };
  inputs: string[];
  outputs: string[];
  credentials?: any[];
  properties: INodeProperties[];
}

export interface INodeType {
  description: INodeTypeDescription;
  execute?(this: IExecuteFunctions): Promise<any[][]>;
}

export interface ICredentialType {
  name: string;
  displayName: string;
  documentationUrl?: string;
  properties: INodeProperties[];
  authenticate?: any;
  test?: any;
}

export interface IHttpRequestOptions {
  url: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  qs?: Record<string, any>;
  json?: boolean;
}

export const NodeConnectionType = {
  Main: 'main',
};

// Mock helper functions
export function createMockExecuteFunctions(overrides?: Partial<IExecuteFunctions>): IExecuteFunctions {
  return {
    getInputData: jest.fn().mockReturnValue([{ json: {} }]),
    getNodeParameter: jest.fn(),
    getCredentials: jest.fn().mockResolvedValue({
      companyDomain: 'test-company',
      apiKey: 'test-api-key',
    }),
    helpers: {
      request: jest.fn().mockResolvedValue({}),
      requestWithAuthentication: jest.fn().mockResolvedValue({}),
      httpRequest: jest.fn().mockResolvedValue({}),
      httpRequestWithAuthentication: jest.fn().mockResolvedValue({}),
      prepareBinaryData: jest.fn().mockResolvedValue({
        data: '',
        mimeType: 'application/octet-stream',
        fileName: 'test.txt',
      }),
      returnJsonArray: jest.fn((items) => items.map((item: any) => ({ json: item }))),
    },
    continueOnFail: jest.fn().mockReturnValue(false),
    ...overrides,
  } as unknown as IExecuteFunctions;
}

export function createMockCredentialTestFunctions(): ICredentialTestFunctions {
  return {
    helpers: {
      request: jest.fn().mockResolvedValue({}),
    },
  };
}
