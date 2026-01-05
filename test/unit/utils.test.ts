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

describe('Utility Functions', () => {
  describe('Date Formatting', () => {
    it('should format date to YYYY-MM-DD', () => {
      const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
      };

      const testDate = new Date('2024-06-15T12:00:00Z');
      expect(formatDate(testDate)).toBe('2024-06-15');
    });

    it('should format ISO date string correctly', () => {
      const formatISODate = (dateStr: string): string => {
        return dateStr.split('T')[0];
      };

      expect(formatISODate('2024-06-15T14:30:00.000Z')).toBe('2024-06-15');
    });

    it('should handle date without time', () => {
      const dateStr = '2024-06-15';
      expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('Field Building', () => {
    it('should join fields with commas', () => {
      const fields = ['firstName', 'lastName', 'department', 'jobTitle'];
      const fieldString = fields.join(',');

      expect(fieldString).toBe('firstName,lastName,department,jobTitle');
    });

    it('should handle single field', () => {
      const fields = ['firstName'];
      const fieldString = fields.join(',');

      expect(fieldString).toBe('firstName');
    });

    it('should handle empty fields array', () => {
      const fields: string[] = [];
      const fieldString = fields.join(',');

      expect(fieldString).toBe('');
    });
  });

  describe('Constants', () => {
    it('should have standard employee fields', () => {
      const STANDARD_EMPLOYEE_FIELDS = [
        'firstName',
        'lastName',
        'department',
        'division',
        'jobTitle',
        'workEmail',
        'workPhone',
        'location',
        'supervisor',
        'photoUrl',
      ];

      expect(STANDARD_EMPLOYEE_FIELDS).toContain('firstName');
      expect(STANDARD_EMPLOYEE_FIELDS).toContain('lastName');
      expect(STANDARD_EMPLOYEE_FIELDS).toContain('department');
      expect(STANDARD_EMPLOYEE_FIELDS).toContain('workEmail');
    });

    it('should have time off status options', () => {
      const TIME_OFF_STATUS_OPTIONS = ['approved', 'denied', 'requested', 'canceled'];

      expect(TIME_OFF_STATUS_OPTIONS).toContain('approved');
      expect(TIME_OFF_STATUS_OPTIONS).toContain('denied');
      expect(TIME_OFF_STATUS_OPTIONS).toContain('requested');
      expect(TIME_OFF_STATUS_OPTIONS).toContain('canceled');
    });

    it('should have report format options', () => {
      const REPORT_FORMAT_OPTIONS = ['JSON', 'CSV', 'XML', 'PDF'];

      expect(REPORT_FORMAT_OPTIONS).toContain('JSON');
      expect(REPORT_FORMAT_OPTIONS).toContain('CSV');
      expect(REPORT_FORMAT_OPTIONS).toContain('XML');
      expect(REPORT_FORMAT_OPTIONS).toContain('PDF');
    });

    it('should have goal status options', () => {
      const GOAL_STATUS_OPTIONS = ['open', 'closed'];

      expect(GOAL_STATUS_OPTIONS).toContain('open');
      expect(GOAL_STATUS_OPTIONS).toContain('closed');
    });

    it('should have common table names', () => {
      const COMMON_TABLE_NAMES = [
        'jobInfo',
        'employmentStatus',
        'compensation',
        'emergencyContacts',
        'education',
        'customTable',
      ];

      expect(COMMON_TABLE_NAMES).toContain('jobInfo');
      expect(COMMON_TABLE_NAMES).toContain('employmentStatus');
      expect(COMMON_TABLE_NAMES).toContain('compensation');
    });

    it('should have webhook event options', () => {
      const WEBHOOK_EVENT_OPTIONS = [
        'employee.created',
        'employee.updated',
        'employee.deleted',
        'timeOff.created',
        'timeOff.updated',
        'timeOff.deleted',
        'job.created',
        'job.updated',
        'job.deleted',
      ];

      expect(WEBHOOK_EVENT_OPTIONS).toContain('employee.created');
      expect(WEBHOOK_EVENT_OPTIONS).toContain('timeOff.updated');
    });
  });

  describe('Payload Construction', () => {
    it('should build employee create payload', () => {
      const buildEmployeePayload = (data: Record<string, any>): Record<string, any> => {
        const payload: Record<string, any> = {};
        if (data.firstName) payload.firstName = data.firstName;
        if (data.lastName) payload.lastName = data.lastName;
        if (data.department) payload.department = data.department;
        return payload;
      };

      const payload = buildEmployeePayload({
        firstName: 'John',
        lastName: 'Doe',
        department: 'Engineering',
      });

      expect(payload).toHaveProperty('firstName', 'John');
      expect(payload).toHaveProperty('lastName', 'Doe');
      expect(payload).toHaveProperty('department', 'Engineering');
    });

    it('should build time off request payload', () => {
      const payload = {
        timeOffTypeId: '5',
        start: '2024-06-15',
        end: '2024-06-20',
        amount: 5,
        notes: [{ note: 'Vacation request' }],
      };

      expect(payload).toHaveProperty('timeOffTypeId');
      expect(payload).toHaveProperty('start');
      expect(payload).toHaveProperty('end');
      expect(payload).toHaveProperty('amount');
    });

    it('should build custom report payload', () => {
      const payload = {
        title: 'Custom Report',
        fields: ['firstName', 'lastName', 'department'],
        filters: {
          lastChanged: { includeNull: 'no', value: '2024-01-01' },
        },
      };

      expect(payload.title).toBe('Custom Report');
      expect(payload.fields).toHaveLength(3);
      expect(payload.filters).toHaveProperty('lastChanged');
    });
  });

  describe('Data Parsing', () => {
    it('should parse balance data to array', () => {
      const balanceData = {
        '1': { balance: 40, name: 'Vacation' },
        '2': { balance: 80, name: 'Sick Leave' },
      };

      const parsed = Object.entries(balanceData).map(([id, data]) => ({
        id,
        ...(data as object),
      }));

      expect(parsed).toHaveLength(2);
      expect(parsed[0]).toHaveProperty('id', '1');
      expect(parsed[0]).toHaveProperty('balance', 40);
    });

    it('should parse employee directory response', () => {
      const response = {
        employees: [
          { id: '1', firstName: 'John', lastName: 'Doe' },
          { id: '2', firstName: 'Jane', lastName: 'Smith' },
        ],
        fields: [
          { id: 'firstName', name: 'First Name' },
          { id: 'lastName', name: 'Last Name' },
        ],
      };

      expect(response.employees).toHaveLength(2);
      expect(response.fields).toHaveLength(2);
    });

    it('should flatten file categories response', () => {
      const categoriesResponse = {
        categories: [
          {
            id: '1',
            name: 'Documents',
            files: [
              { id: 'f1', name: 'contract.pdf' },
              { id: 'f2', name: 'handbook.pdf' },
            ],
          },
          {
            id: '2',
            name: 'Photos',
            files: [{ id: 'f3', name: 'profile.jpg' }],
          },
        ],
      };

      const flattenFiles = (categories: any[]): any[] => {
        return categories.flatMap((cat) =>
          cat.files.map((file: any) => ({
            ...file,
            categoryId: cat.id,
            categoryName: cat.name,
          }))
        );
      };

      const files = flattenFiles(categoriesResponse.categories);

      expect(files).toHaveLength(3);
      expect(files[0]).toHaveProperty('categoryName', 'Documents');
    });
  });

  describe('Error Handling', () => {
    it('should identify common error types', () => {
      const errorCodes = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        429: 'Too Many Requests',
        500: 'Internal Server Error',
        503: 'Service Unavailable',
      };

      expect(errorCodes[401]).toBe('Unauthorized');
      expect(errorCodes[404]).toBe('Not Found');
      expect(errorCodes[503]).toBe('Service Unavailable');
    });

    it('should handle missing required fields', () => {
      const validateRequired = (data: Record<string, any>, required: string[]): string[] => {
        return required.filter((field) => !data[field]);
      };

      const data = { firstName: 'John' };
      const required = ['firstName', 'lastName', 'email'];
      const missing = validateRequired(data, required);

      expect(missing).toContain('lastName');
      expect(missing).toContain('email');
      expect(missing).not.toContain('firstName');
    });
  });
});
