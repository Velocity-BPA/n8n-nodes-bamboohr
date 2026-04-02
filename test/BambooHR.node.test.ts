/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { BambooHR } from '../nodes/BambooHR/BambooHR.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('BambooHR Node', () => {
  let node: BambooHR;

  beforeAll(() => {
    node = new BambooHR();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('BambooHR');
      expect(node.description.name).toBe('bamboohr');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Employee Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        companyDomain: 'test-company' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });
  
  describe('getDirectory operation', () => {
    it('should get employee directory successfully', async () => {
      const mockResponse = { employees: [{ id: 1, name: 'John Doe' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getDirectory');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const result = await executeEmployeeOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.bamboohr.com/api/gateway.php/test-company/v1/employees/directory',
        headers: expect.objectContaining({
          'Authorization': expect.stringContaining('Basic'),
          'Accept': 'application/json',
        }),
        json: true,
      });
    });
    
    it('should handle errors in getDirectory', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getDirectory');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      
      const result = await executeEmployeeOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
  
  describe('getEmployee operation', () => {
    it('should get specific employee successfully', async () => {
      const mockResponse = { id: 123, name: 'John Doe' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getEmployee')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('firstName,lastName');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const result = await executeEmployeeOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
  
  describe('createEmployee operation', () => {
    it('should create employee successfully', async () => {
      const mockResponse = { id: 456 };
      const employeeData = { firstName: 'Jane', lastName: 'Doe' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createEmployee')
        .mockReturnValueOnce(employeeData);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const result = await executeEmployeeOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
  
  describe('updateEmployee operation', () => {
    it('should update employee successfully', async () => {
      const mockResponse = { success: true };
      const employeeData = { firstName: 'Jane Updated' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateEmployee')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce(employeeData);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const result = await executeEmployeeOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
  
  describe('getPhoto operation', () => {
    it('should get employee photo successfully', async () => {
      const mockResponse = Buffer.from('photo-data');
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPhoto')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('medium');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const result = await executeEmployeeOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Time Off Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.bamboohr.com/api/gateway.php/test-company/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  test('getTimeOffRequests - success', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTimeOffRequests')
      .mockReturnValueOnce('2023-01-01')
      .mockReturnValueOnce('2023-12-31')
      .mockReturnValueOnce('vacation')
      .mockReturnValueOnce('approved');

    const mockResponse = [{ id: 1, status: 'approved', type: 'vacation' }];
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTimeOffOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: expect.stringContaining('/time_off/requests'),
      headers: expect.objectContaining({
        Authorization: expect.stringContaining('Basic'),
        Accept: 'application/json'
      }),
      json: true
    });
  });

  test('updateTimeOffStatus - success', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateTimeOffStatus')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce('approved')
      .mockReturnValueOnce('Looks good!');

    const mockResponse = { success: true };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTimeOffOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: expect.stringContaining('/time_off/requests/123/status'),
      headers: expect.objectContaining({
        Authorization: expect.stringContaining('Basic'),
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }),
      body: { status: 'approved', note: 'Looks good!' },
      json: true
    });
  });

  test('createTimeOffRequest - success', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createTimeOffRequest')
      .mockReturnValueOnce('456')
      .mockReturnValueOnce('2023-06-01')
      .mockReturnValueOnce('2023-06-05')
      .mockReturnValueOnce('1');

    const mockResponse = { id: 789, status: 'requested' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTimeOffOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: expect.stringContaining('/time_off/requests'),
      headers: expect.objectContaining({
        Authorization: expect.stringContaining('Basic'),
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }),
      body: {
        employeeId: '456',
        start: '2023-06-01',
        end: '2023-06-05',
        timeOffTypeId: '1'
      },
      json: true
    });
  });

  test('getTimeOffBalance - success', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTimeOffBalance')
      .mockReturnValueOnce('456')
      .mockReturnValueOnce('2023-12-31');

    const mockResponse = { balances: [{ type: 'vacation', balance: 15.5 }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTimeOffOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: expect.stringContaining('/employees/456/time_off/calculator'),
      headers: expect.objectContaining({
        Authorization: expect.stringContaining('Basic'),
        Accept: 'application/json'
      }),
      json: true
    });
  });

  test('error handling', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTimeOffRequests');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const items = [{ json: {} }];
    const result = await executeTimeOffOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });
});

describe('Report Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.bamboohr.com/api/gateway.php/testcompany/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getReport operation', () => {
		it('should get a report successfully', async () => {
			const mockResponse = { reportData: 'test data' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getReport')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('json')
				.mockReturnValueOnce(false);

			const result = await executeReportOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.bamboohr.com/api/gateway.php/testcompany/v1/reports/123',
				headers: {
					Authorization: 'Basic dGVzdC1hcGkta2V5Ong=',
					Accept: 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors when getting report', async () => {
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getReport')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('json')
				.mockReturnValueOnce(false);

			await expect(executeReportOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});

	describe('generateReport operation', () => {
		it('should generate a report successfully', async () => {
			const mockResponse = { reportId: '123', status: 'generated' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('generateReport')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('firstName,lastName')
				.mockReturnValueOnce('{"department": "Engineering"}');

			const result = await executeReportOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.bamboohr.com/api/gateway.php/testcompany/v1/reports/123',
				headers: {
					Authorization: 'Basic dGVzdC1hcGkta2V5Ong=',
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: {
					fields: ['firstName', 'lastName'],
					filters: { department: 'Engineering' },
				},
				json: true,
			});
		});

		it('should handle errors when generating report', async () => {
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Generate Error'));
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('generateReport')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('{}');

			await expect(executeReportOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Generate Error');
		});
	});

	describe('getCustomReports operation', () => {
		it('should get custom reports successfully', async () => {
			const mockResponse = { reports: [{ id: '1', name: 'Custom Report 1' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCustomReports');

			const result = await executeReportOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.bamboohr.com/api/gateway.php/testcompany/v1/reports/custom',
				headers: {
					Authorization: 'Basic dGVzdC1hcGkta2V5Ong=',
					Accept: 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors when getting custom reports', async () => {
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Custom Reports Error'));
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCustomReports');

			await expect(executeReportOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Custom Reports Error');
		});
	});
});

describe('Company File Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				companyDomain: 'test-company'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	it('should get employee files successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getEmployeeFiles')
			.mockReturnValueOnce('123');

		const mockResponse = {
			files: [
				{ id: '1', name: 'document1.pdf', category: 'general' },
				{ id: '2', name: 'document2.pdf', category: 'benefits' }
			]
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeCompanyFileOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.bamboohr.com/api/gateway.php/test-company/v1/employees/123/files/view/',
			headers: expect.objectContaining({
				'Authorization': expect.stringContaining('Basic'),
				'Accept': 'application/json'
			}),
			json: true
		});
	});

	it('should upload employee file successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('uploadEmployeeFile')
			.mockReturnValueOnce('123')
			.mockReturnValueOnce('base64filedata')
			.mockReturnValueOnce('general')
			.mockReturnValueOnce('test-file.pdf')
			.mockReturnValueOnce(true);

		const mockResponse = { fileId: '456', status: 'uploaded' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeCompanyFileOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
	});

	it('should download file successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('downloadFile')
			.mockReturnValueOnce('456');

		const mockFileData = Buffer.from('file content');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockFileData);

		const result = await executeCompanyFileOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockFileData);
	});

	it('should update file successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updateFile')
			.mockReturnValueOnce('123')
			.mockReturnValueOnce('456')
			.mockReturnValueOnce('updated-file.pdf')
			.mockReturnValueOnce(false);

		const mockResponse = { success: true };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeCompanyFileOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
	});

	it('should delete file successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('deleteFile')
			.mockReturnValueOnce('123')
			.mockReturnValueOnce('456');

		const mockResponse = { success: true };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeCompanyFileOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
	});

	it('should handle errors when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getEmployeeFiles');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeCompanyFileOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getEmployeeFiles');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(
			executeCompanyFileOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('API Error');
	});
});

describe('Goal Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				companyDomain: 'test-company',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getEmployeeGoals operation', () => {
		it('should get employee goals successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getEmployeeGoals');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('123');
			
			const mockResponse = {
				goals: [
					{ id: '1', title: 'Test Goal', status: 'in_progress' }
				]
			};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeGoalOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.bamboohr.com/api/gateway.php/test-company/v1/performance/employees/123/goals',
				headers: {
					'Authorization': expect.stringContaining('Basic '),
					'Accept': 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors when getting employee goals', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getEmployeeGoals');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('123');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			
			const error = new Error('API Error');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

			const result = await executeGoalOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('createGoal operation', () => {
		it('should create goal successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createGoal')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('New Goal')
				.mockReturnValueOnce('Goal description')
				.mockReturnValueOnce('not_started')
				.mockReturnValueOnce('2024-12-31')
				.mockReturnValueOnce(0);
			
			const mockResponse = { id: '456', title: 'New Goal' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeGoalOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.bamboohr.com/api/gateway.php/test-company/v1/performance/employees/123/goals',
				headers: {
					'Authorization': expect.stringContaining('Basic '),
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: {
					title: 'New Goal',
					description: 'Goal description',
					status: 'not_started',
					progressPercentage: 0,
					dueDate: '2024-12-31',
				},
				json: true,
			});
		});
	});

	describe('updateGoal operation', () => {
		it('should update goal successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateGoal')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('456')
				.mockReturnValueOnce('Updated Goal')
				.mockReturnValueOnce('Updated description')
				.mockReturnValueOnce('in_progress')
				.mockReturnValueOnce('2024-12-31')
				.mockReturnValueOnce(50);
			
			const mockResponse = { id: '456', title: 'Updated Goal' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeGoalOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PUT',
				url: 'https://api.bamboohr.com/api/gateway.php/test-company/v1/performance/employees/123/goals/456',
				headers: {
					'Authorization': expect.stringContaining('Basic '),
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: {
					title: 'Updated Goal',
					description: 'Updated description',
					status: 'in_progress',
					progressPercentage: 50,
					dueDate: '2024-12-31',
				},
				json: true,
			});
		});
	});

	describe('deleteGoal operation', () => {
		it('should delete goal successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteGoal')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('456');
			
			const mockResponse = { success: true };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeGoalOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.bamboohr.com/api/gateway.php/test-company/v1/performance/employees/123/goals/456',
				headers: {
					'Authorization': expect.stringContaining('Basic '),
					'Accept': 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors when deleting goal', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteGoal')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('456');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			
			const error = new Error('Delete failed');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

			const result = await executeGoalOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json.error).toBe('Delete failed');
		});
	});
});

describe('Time Tracking Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.bamboohr.com/api/gateway.php/{companyDomain}/v1',
				companyDomain: 'testcompany',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getTimesheet operation', () => {
		it('should get timesheet successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTimesheet')
				.mockReturnValueOnce('123');

			const mockResponse = { id: '123', employeeId: '456', hours: 8 };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executeTimeTrackingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.bamboohr.com/api/gateway.php/testcompany/v1/time_tracking/timesheets/123',
				headers: {
					'Authorization': expect.stringContaining('Basic'),
					'Accept': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle errors when getting timesheet', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTimesheet')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const error = new Error('Timesheet not found');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(error);

			const result = await executeTimeTrackingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'Timesheet not found' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('addTimeEntry operation', () => {
		it('should add time entry successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('addTimeEntry')
				.mockReturnValueOnce('456')
				.mockReturnValueOnce('2023-01-01T09:00:00Z')
				.mockReturnValueOnce('2023-01-01T17:00:00Z')
				.mockReturnValueOnce('America/New_York');

			const mockResponse = { id: '789', status: 'created' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executeTimeTrackingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.bamboohr.com/api/gateway.php/testcompany/v1/time_tracking/record',
				headers: {
					'Authorization': expect.stringContaining('Basic'),
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: {
					employeeId: '456',
					start: '2023-01-01T09:00:00Z',
					end: '2023-01-01T17:00:00Z',
					timezone: 'America/New_York',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('clockIn operation', () => {
		it('should clock in employee successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('clockIn')
				.mockReturnValueOnce('456')
				.mockReturnValueOnce('America/New_York');

			const mockResponse = { status: 'clocked_in', timestamp: '2023-01-01T09:00:00Z' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executeTimeTrackingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.bamboohr.com/api/gateway.php/testcompany/v1/time_tracking/clock_in',
				headers: {
					'Authorization': expect.stringContaining('Basic'),
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: {
					employeeId: '456',
					timezone: 'America/New_York',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('deleteTimeEntry operation', () => {
		it('should delete time entry successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteTimeEntry')
				.mockReturnValueOnce('123');

			const mockResponse = { status: 'deleted' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executeTimeTrackingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.bamboohr.com/api/gateway.php/testcompany/v1/time_tracking/record/123',
				headers: {
					'Authorization': expect.stringContaining('Basic'),
					'Accept': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});
	});
});
});
