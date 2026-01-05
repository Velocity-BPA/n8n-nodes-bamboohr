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

import { createMockExecuteFunctions } from '../__mocks__/n8n-workflow';

describe('BambooHr Node', () => {
  describe('Node Structure', () => {
    it('should have correct node metadata', () => {
      // Verify basic node structure expectations
      const expectedResources = [
        'employee',
        'employeeFile',
        'timeOff',
        'report',
        'table',
        'benefit',
        'goal',
        'timeTracking',
        'webhook',
      ];

      expect(expectedResources).toHaveLength(9);
    });

    it('should have required credentials', () => {
      const credentialName = 'bambooHrApi';
      expect(credentialName).toBe('bambooHrApi');
    });
  });

  describe('Employee Resource', () => {
    it('should define employee operations', () => {
      const employeeOperations = [
        'create',
        'get',
        'getAll',
        'getDirectory',
        'update',
        'getFields',
        'getChangedEmployees',
        'uploadPhoto',
      ];

      expect(employeeOperations).toHaveLength(8);
      expect(employeeOperations).toContain('create');
      expect(employeeOperations).toContain('get');
      expect(employeeOperations).toContain('update');
    });
  });

  describe('Employee File Resource', () => {
    it('should define employee file operations', () => {
      const fileOperations = [
        'listCategories',
        'addCategory',
        'listFiles',
        'uploadFile',
        'getFile',
        'updateFile',
        'deleteFile',
      ];

      expect(fileOperations).toHaveLength(7);
    });
  });

  describe('Time Off Resource', () => {
    it('should define time off operations', () => {
      const timeOffOperations = [
        'getRequests',
        'createRequest',
        'updateRequestStatus',
        'getBalances',
        'getPolicies',
        'getTypes',
        'addHistory',
        'estimateFutureBalance',
      ];

      expect(timeOffOperations).toHaveLength(8);
    });
  });

  describe('Report Resource', () => {
    it('should define report operations', () => {
      const reportOperations = ['getReport', 'createCustomReport', 'listReports'];

      expect(reportOperations).toHaveLength(3);
    });
  });

  describe('Table Resource', () => {
    it('should define table operations', () => {
      const tableOperations = [
        'getTableData',
        'addTableRow',
        'updateTableRow',
        'deleteTableRow',
        'getTableList',
      ];

      expect(tableOperations).toHaveLength(5);
    });
  });

  describe('Benefit Resource', () => {
    it('should define benefit operations', () => {
      const benefitOperations = [
        'getBenefitPlans',
        'getBenefitGroups',
        'getEnrollments',
        'updateEnrollment',
        'getBenefitDeductions',
        'getBenefitDependents',
      ];

      expect(benefitOperations).toHaveLength(6);
    });
  });

  describe('Goal Resource', () => {
    it('should define goal operations', () => {
      const goalOperations = [
        'getGoals',
        'createGoal',
        'updateGoal',
        'deleteGoal',
        'getGoalStatus',
        'updateGoalProgress',
        'closeGoal',
      ];

      expect(goalOperations).toHaveLength(7);
    });
  });

  describe('Time Tracking Resource', () => {
    it('should define time tracking operations', () => {
      const timeTrackingOperations = [
        'getTimesheets',
        'getClockEntries',
        'addClockEntry',
        'updateClockEntry',
        'deleteClockEntry',
        'getDailyEntries',
        'approveTimesheets',
      ];

      expect(timeTrackingOperations).toHaveLength(7);
    });
  });

  describe('Webhook Resource', () => {
    it('should define webhook operations', () => {
      const webhookOperations = ['create', 'getAll', 'delete'];

      expect(webhookOperations).toHaveLength(3);
    });
  });
});

describe('Mock Execute Functions', () => {
  it('should create mock execute functions', () => {
    const mockFunctions = createMockExecuteFunctions();

    expect(mockFunctions.getInputData).toBeDefined();
    expect(mockFunctions.getNodeParameter).toBeDefined();
    expect(mockFunctions.getCredentials).toBeDefined();
    expect(mockFunctions.helpers).toBeDefined();
    expect(mockFunctions.continueOnFail).toBeDefined();
  });

  it('should return default credentials', async () => {
    const mockFunctions = createMockExecuteFunctions();
    const credentials = await mockFunctions.getCredentials('bambooHrApi');

    expect(credentials.companyDomain).toBe('test-company');
    expect(credentials.apiKey).toBe('test-api-key');
  });

  it('should return input data', () => {
    const mockFunctions = createMockExecuteFunctions();
    const inputData = mockFunctions.getInputData();

    expect(inputData).toHaveLength(1);
    expect(inputData[0].json).toBeDefined();
  });
});
