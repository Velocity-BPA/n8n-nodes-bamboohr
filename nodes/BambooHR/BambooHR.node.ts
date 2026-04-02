/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-bamboohr/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class BambooHR implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'BambooHR',
    name: 'bamboohr',
    icon: 'file:bamboohr.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the BambooHR API',
    defaults: {
      name: 'BambooHR',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'bamboohrApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Employee',
            value: 'employee',
          },
          {
            name: 'Time Off',
            value: 'timeOff',
          },
          {
            name: 'Report',
            value: 'report',
          },
          {
            name: 'Company File',
            value: 'companyFile',
          },
          {
            name: 'Goal',
            value: 'goal',
          },
          {
            name: 'Time Tracking',
            value: 'timeTracking',
          }
        ],
        default: 'employee',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['employee'] } },
  options: [
    { name: 'Get Directory', value: 'getDirectory', description: 'Get employee directory', action: 'Get employee directory' },
    { name: 'Get Employee', value: 'getEmployee', description: 'Get specific employee details', action: 'Get specific employee details' },
    { name: 'Create Employee', value: 'createEmployee', description: 'Add new employee', action: 'Add new employee' },
    { name: 'Update Employee', value: 'updateEmployee', description: 'Update employee information', action: 'Update employee information' },
    { name: 'Get Photo', value: 'getPhoto', description: 'Get employee photo', action: 'Get employee photo' }
  ],
  default: 'getDirectory',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['timeOff'] } },
  options: [
    { name: 'Get Time Off Requests', value: 'getTimeOffRequests', description: 'List time off requests', action: 'Get time off requests' },
    { name: 'Update Time Off Status', value: 'updateTimeOffStatus', description: 'Approve or deny time off request', action: 'Update time off status' },
    { name: 'Create Time Off Request', value: 'createTimeOffRequest', description: 'Submit new time off request', action: 'Create time off request' },
    { name: 'Get Time Off Balance', value: 'getTimeOffBalance', description: 'Get employee time off balances', action: 'Get time off balance' },
  ],
  default: 'getTimeOffRequests',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['report'],
		},
	},
	options: [
		{
			name: 'Get Report',
			value: 'getReport',
			description: 'Get a specific report by ID',
			action: 'Get a report',
		},
		{
			name: 'Generate Report',
			value: 'generateReport',
			description: 'Generate a custom report',
			action: 'Generate a report',
		},
		{
			name: 'Get Custom Reports',
			value: 'getCustomReports',
			description: 'List available custom reports',
			action: 'Get custom reports',
		},
	],
	default: 'getReport',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['companyFile'],
		},
	},
	options: [
		{
			name: 'Get Employee Files',
			value: 'getEmployeeFiles',
			description: 'List files for a specific employee',
			action: 'Get employee files',
		},
		{
			name: 'Upload Employee File',
			value: 'uploadEmployeeFile',
			description: 'Upload a file for an employee',
			action: 'Upload employee file',
		},
		{
			name: 'Download File',
			value: 'downloadFile',
			description: 'Download a specific file by ID',
			action: 'Download file',
		},
		{
			name: 'Update File',
			value: 'updateFile',
			description: 'Update file information',
			action: 'Update file',
		},
		{
			name: 'Delete File',
			value: 'deleteFile',
			description: 'Delete an employee file',
			action: 'Delete file',
		},
	],
	default: 'getEmployeeFiles',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['goal'] } },
	options: [
		{
			name: 'Get Employee Goals',
			value: 'getEmployeeGoals',
			description: 'Get goals for an employee',
			action: 'Get employee goals',
		},
		{
			name: 'Create Goal',
			value: 'createGoal',
			description: 'Create a new goal for an employee',
			action: 'Create goal',
		},
		{
			name: 'Update Goal',
			value: 'updateGoal',
			description: 'Update an existing goal',
			action: 'Update goal',
		},
		{
			name: 'Delete Goal',
			value: 'deleteGoal',
			description: 'Delete a goal',
			action: 'Delete goal',
		},
	],
	default: 'getEmployeeGoals',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['timeTracking'],
		},
	},
	options: [
		{
			name: 'Get Timesheet',
			value: 'getTimesheet',
			description: 'Get timesheet details',
			action: 'Get timesheet details',
		},
		{
			name: 'Add Time Entry',
			value: 'addTimeEntry',
			description: 'Add time tracking entry',
			action: 'Add time tracking entry',
		},
		{
			name: 'Update Time Entry',
			value: 'updateTimeEntry',
			description: 'Update time entry',
			action: 'Update time entry',
		},
		{
			name: 'Delete Time Entry',
			value: 'deleteTimeEntry',
			description: 'Delete time entry',
			action: 'Delete time entry',
		},
		{
			name: 'Clock In',
			value: 'clockIn',
			description: 'Clock in employee',
			action: 'Clock in employee',
		},
		{
			name: 'Clock Out',
			value: 'clockOut',
			description: 'Clock out employee',
			action: 'Clock out employee',
		},
	],
	default: 'getTimesheet',
},
{
  displayName: 'Employee ID',
  name: 'employeeId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['employee'], operation: ['getEmployee', 'updateEmployee', 'getPhoto'] } },
  default: '',
  description: 'The ID of the employee',
},
{
  displayName: 'Fields',
  name: 'fields',
  type: 'string',
  displayOptions: { show: { resource: ['employee'], operation: ['getEmployee'] } },
  default: '',
  description: 'Comma-separated list of fields to return',
},
{
  displayName: 'Employee Data',
  name: 'employeeData',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['employee'], operation: ['createEmployee', 'updateEmployee'] } },
  default: '{}',
  description: 'Employee information as JSON object',
},
{
  displayName: 'Photo Size',
  name: 'photoSize',
  type: 'options',
  displayOptions: { show: { resource: ['employee'], operation: ['getPhoto'] } },
  options: [
    { name: 'Small', value: 'small' },
    { name: 'Medium', value: 'medium' },
    { name: 'Large', value: 'large' },
    { name: 'Original', value: 'original' }
  ],
  default: 'medium',
  description: 'The size of the photo to retrieve',
},
{
  displayName: 'Start Date',
  name: 'start',
  type: 'dateTime',
  displayOptions: { show: { resource: ['timeOff'], operation: ['getTimeOffRequests'] } },
  default: '',
  description: 'Start date for time off requests filter',
},
{
  displayName: 'End Date',
  name: 'end',
  type: 'dateTime',
  displayOptions: { show: { resource: ['timeOff'], operation: ['getTimeOffRequests', 'getTimeOffBalance'] } },
  default: '',
  description: 'End date for time off requests filter or balance calculation',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'string',
  displayOptions: { show: { resource: ['timeOff'], operation: ['getTimeOffRequests'] } },
  default: '',
  description: 'Time off type to filter by',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: { show: { resource: ['timeOff'], operation: ['getTimeOffRequests', 'updateTimeOffStatus'] } },
  options: [
    { name: 'All', value: '' },
    { name: 'Requested', value: 'requested' },
    { name: 'Approved', value: 'approved' },
    { name: 'Denied', value: 'denied' },
    { name: 'Cancelled', value: 'cancelled' },
  ],
  default: '',
  description: 'Status of time off request',
},
{
  displayName: 'Request ID',
  name: 'requestId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['timeOff'], operation: ['updateTimeOffStatus'] } },
  default: '',
  description: 'ID of the time off request to update',
},
{
  displayName: 'Note',
  name: 'note',
  type: 'string',
  displayOptions: { show: { resource: ['timeOff'], operation: ['updateTimeOffStatus'] } },
  default: '',
  description: 'Optional note for status update',
},
{
  displayName: 'Employee ID',
  name: 'employeeId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['timeOff'], operation: ['createTimeOffRequest', 'getTimeOffBalance'] } },
  default: '',
  description: 'ID of the employee',
},
{
  displayName: 'Time Off Type ID',
  name: 'timeOffTypeId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['timeOff'], operation: ['createTimeOffRequest'] } },
  default: '',
  description: 'ID of the time off type',
},
{
	displayName: 'Report ID',
	name: 'reportId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getReport', 'generateReport'],
		},
	},
	default: '',
	description: 'The ID of the report to retrieve or generate',
},
{
	displayName: 'Format',
	name: 'format',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getReport'],
		},
	},
	options: [
		{
			name: 'JSON',
			value: 'json',
		},
		{
			name: 'XML',
			value: 'xml',
		},
		{
			name: 'CSV',
			value: 'csv',
		},
		{
			name: 'PDF',
			value: 'pdf',
		},
		{
			name: 'XLS',
			value: 'xls',
		},
	],
	default: 'json',
	description: 'The format to return the report in',
},
{
	displayName: 'Filter Duplicates',
	name: 'fd',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getReport'],
		},
	},
	default: false,
	description: 'Whether to filter duplicate records',
},
{
	displayName: 'Fields',
	name: 'fields',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['generateReport'],
		},
	},
	default: '',
	description: 'Comma-separated list of fields to include in the report',
	placeholder: 'firstName,lastName,jobTitle,department',
},
{
	displayName: 'Filters',
	name: 'filters',
	type: 'json',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['generateReport'],
		},
	},
	default: '{}',
	description: 'JSON object containing filter criteria for the report',
	placeholder: '{"department": "Engineering", "status": "Active"}',
},
{
	displayName: 'Employee ID',
	name: 'employeeId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['companyFile'],
			operation: ['getEmployeeFiles', 'uploadEmployeeFile', 'updateFile', 'deleteFile'],
		},
	},
	default: '',
	description: 'The ID of the employee',
},
{
	displayName: 'File ID',
	name: 'fileId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['companyFile'],
			operation: ['downloadFile', 'updateFile', 'deleteFile'],
		},
	},
	default: '',
	description: 'The ID of the file',
},
{
	displayName: 'File',
	name: 'file',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['companyFile'],
			operation: ['uploadEmployeeFile'],
		},
	},
	default: '',
	description: 'The file to upload (base64 encoded or file path)',
},
{
	displayName: 'Category',
	name: 'category',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['companyFile'],
			operation: ['uploadEmployeeFile'],
		},
	},
	options: [
		{
			name: 'General',
			value: 'general',
		},
		{
			name: 'Benefits',
			value: 'benefits',
		},
		{
			name: 'Performance',
			value: 'performance',
		},
		{
			name: 'Compensation',
			value: 'compensation',
		},
	],
	default: 'general',
	description: 'The category for the file',
},
{
	displayName: 'File Name',
	name: 'fileName',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['companyFile'],
			operation: ['uploadEmployeeFile', 'updateFile'],
		},
	},
	default: '',
	description: 'The name of the file',
},
{
	displayName: 'Share With Employee',
	name: 'shareWithEmployee',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['companyFile'],
			operation: ['uploadEmployeeFile', 'updateFile'],
		},
	},
	default: false,
	description: 'Whether to share the file with the employee',
},
{
	displayName: 'Employee ID',
	name: 'employeeId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['goal'],
			operation: ['getEmployeeGoals', 'createGoal', 'updateGoal', 'deleteGoal'],
		},
	},
	default: '',
	description: 'The ID of the employee',
},
{
	displayName: 'Goal ID',
	name: 'goalId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['goal'],
			operation: ['updateGoal', 'deleteGoal'],
		},
	},
	default: '',
	description: 'The ID of the goal',
},
{
	displayName: 'Goal Title',
	name: 'title',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['goal'],
			operation: ['createGoal', 'updateGoal'],
		},
	},
	default: '',
	description: 'The title of the goal',
},
{
	displayName: 'Goal Description',
	name: 'description',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['goal'],
			operation: ['createGoal', 'updateGoal'],
		},
	},
	default: '',
	description: 'The description of the goal',
},
{
	displayName: 'Goal Status',
	name: 'status',
	type: 'options',
	options: [
		{
			name: 'Not Started',
			value: 'not_started',
		},
		{
			name: 'In Progress',
			value: 'in_progress',
		},
		{
			name: 'Completed',
			value: 'completed',
		},
		{
			name: 'On Hold',
			value: 'on_hold',
		},
	],
	displayOptions: {
		show: {
			resource: ['goal'],
			operation: ['createGoal', 'updateGoal'],
		},
	},
	default: 'not_started',
	description: 'The status of the goal',
},
{
	displayName: 'Due Date',
	name: 'dueDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['goal'],
			operation: ['createGoal', 'updateGoal'],
		},
	},
	default: '',
	description: 'The due date for the goal',
},
{
	displayName: 'Progress Percentage',
	name: 'progressPercentage',
	type: 'number',
	typeOptions: {
		minValue: 0,
		maxValue: 100,
	},
	displayOptions: {
		show: {
			resource: ['goal'],
			operation: ['createGoal', 'updateGoal'],
		},
	},
	default: 0,
	description: 'The progress percentage of the goal (0-100)',
},
{
	displayName: 'Timesheet ID',
	name: 'timesheetId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['timeTracking'],
			operation: ['getTimesheet'],
		},
	},
	default: '',
	description: 'The ID of the timesheet to retrieve',
},
{
	displayName: 'Employee ID',
	name: 'employeeId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['timeTracking'],
			operation: ['addTimeEntry', 'clockIn', 'clockOut'],
		},
	},
	default: '',
	description: 'The ID of the employee',
},
{
	displayName: 'Start Time',
	name: 'start',
	type: 'dateTime',
	required: true,
	displayOptions: {
		show: {
			resource: ['timeTracking'],
			operation: ['addTimeEntry'],
		},
	},
	default: '',
	description: 'Start time of the time entry',
},
{
	displayName: 'End Time',
	name: 'end',
	type: 'dateTime',
	required: true,
	displayOptions: {
		show: {
			resource: ['timeTracking'],
			operation: ['addTimeEntry'],
		},
	},
	default: '',
	description: 'End time of the time entry',
},
{
	displayName: 'Timezone',
	name: 'timezone',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['timeTracking'],
			operation: ['addTimeEntry', 'clockIn', 'clockOut'],
		},
	},
	default: 'America/New_York',
	description: 'Timezone for the time entry',
},
{
	displayName: 'Timesheet ID',
	name: 'timesheetId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['timeTracking'],
			operation: ['updateTimeEntry', 'deleteTimeEntry'],
		},
	},
	default: '',
	description: 'The ID of the timesheet to update or delete',
},
{
	displayName: 'Start Time',
	name: 'start',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['timeTracking'],
			operation: ['updateTimeEntry'],
		},
	},
	default: '',
	description: 'Updated start time of the time entry',
},
{
	displayName: 'End Time',
	name: 'end',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['timeTracking'],
			operation: ['updateTimeEntry'],
		},
	},
	default: '',
	description: 'Updated end time of the time entry',
},
{
	displayName: 'Timezone',
	name: 'timezone',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['timeTracking'],
			operation: ['updateTimeEntry'],
		},
	},
	default: 'America/New_York',
	description: 'Timezone for the updated time entry',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'employee':
        return [await executeEmployeeOperations.call(this, items)];
      case 'timeOff':
        return [await executeTimeOffOperations.call(this, items)];
      case 'report':
        return [await executeReportOperations.call(this, items)];
      case 'companyFile':
        return [await executeCompanyFileOperations.call(this, items)];
      case 'goal':
        return [await executeGoalOperations.call(this, items)];
      case 'timeTracking':
        return [await executeTimeTrackingOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeEmployeeOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bamboohrApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = `https://api.bamboohr.com/api/gateway.php/${credentials.companyDomain}/v1`;
      const headers = {
        'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':x').toString('base64')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      switch (operation) {
        case 'getDirectory': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/employees/directory`,
            headers,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getEmployee': {
          const employeeId = this.getNodeParameter('employeeId', i) as string;
          const fields = this.getNodeParameter('fields', i) as string;
          let url = `${baseUrl}/employees/${employeeId}`;
          if (fields) {
            url += `?fields=${encodeURIComponent(fields)}`;
          }
          const options: any = {
            method: 'GET',
            url,
            headers,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createEmployee': {
          const employeeData = this.getNodeParameter('employeeData', i) as any;
          const options: any = {
            method: 'POST',
            url: `${baseUrl}/employees`,
            headers,
            body: employeeData,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'updateEmployee': {
          const employeeId = this.getNodeParameter('employeeId', i) as string;
          const employeeData = this.getNodeParameter('employeeData', i) as any;
          const options: any = {
            method: 'POST',
            url: `${baseUrl}/employees/${employeeId}`,
            headers,
            body: employeeData,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getPhoto': {
          const employeeId = this.getNodeParameter('employeeId', i) as string;
          const photoSize = this.getNodeParameter('photoSize', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/employees/${employeeId}/photo/${photoSize}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':x').toString('base64')}`,
            },
            encoding: null,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeTimeOffOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bamboohrApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getTimeOffRequests': {
          const start = this.getNodeParameter('start', i) as string;
          const end = this.getNodeParameter('end', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const status = this.getNodeParameter('status', i) as string;

          const queryParams = new URLSearchParams();
          if (start) queryParams.append('start', start);
          if (end) queryParams.append('end', end);
          if (type) queryParams.append('type', type);
          if (status) queryParams.append('status', status);

          const queryString = queryParams.toString();
          const url = `${credentials.baseUrl}/time_off/requests${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              Authorization: `Basic ${Buffer.from(credentials.apiKey + ':x').toString('base64')}`,
              Accept: 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateTimeOffStatus': {
          const requestId = this.getNodeParameter('requestId', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const note = this.getNodeParameter('note', i) as string;

          const url = `${credentials.baseUrl}/time_off/requests/${requestId}/status`;

          const body: any = { status };
          if (note) body.note = note;

          const options: any = {
            method: 'PUT',
            url,
            headers: {
              Authorization: `Basic ${Buffer.from(credentials.apiKey + ':x').toString('base64')}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createTimeOffRequest': {
          const employeeId = this.getNodeParameter('employeeId', i) as string;
          const start = this.getNodeParameter('start', i) as string;
          const end = this.getNodeParameter('end', i) as string;
          const timeOffTypeId = this.getNodeParameter('timeOffTypeId', i) as string;

          const url = `${credentials.baseUrl}/time_off/requests`;

          const body = {
            employeeId,
            start,
            end,
            timeOffTypeId,
          };

          const options: any = {
            method: 'POST',
            url,
            headers: {
              Authorization: `Basic ${Buffer.from(credentials.apiKey + ':x').toString('base64')}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTimeOffBalance': {
          const employeeId = this.getNodeParameter('employeeId', i) as string;
          const end = this.getNodeParameter('end', i) as string;

          const queryParams = new URLSearchParams();
          if (end) queryParams.append('end', end);

          const queryString = queryParams.toString();
          const url = `${credentials.baseUrl}/employees/${employeeId}/time_off/calculator${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              Authorization: `Basic ${Buffer.from(credentials.apiKey + ':x').toString('base64')}`,
              Accept: 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeReportOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('bamboohrApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getReport': {
					const reportId = this.getNodeParameter('reportId', i) as string;
					const format = this.getNodeParameter('format', i, 'json') as string;
					const fd = this.getNodeParameter('fd', i, false) as boolean;

					const queryParams = new URLSearchParams();
					if (fd) {
						queryParams.append('fd', 'yes');
					}
					if (format !== 'json') {
						queryParams.append('format', format);
					}

					const headers: any = {
						Authorization: `Basic ${Buffer.from(`${credentials.apiKey}:x`).toString('base64')}`,
					};

					if (format === 'json') {
						headers.Accept = 'application/json';
					}

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/reports/${reportId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
						headers,
						json: format === 'json',
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'generateReport': {
					const reportId = this.getNodeParameter('reportId', i) as string;
					const fields = this.getNodeParameter('fields', i, '') as string;
					const filters = this.getNodeParameter('filters', i, '{}') as string;

					let parsedFilters: any = {};
					try {
						parsedFilters = JSON.parse(filters);
					} catch (error: any) {
						throw new NodeOperationError(this.getNode(), `Invalid JSON in filters: ${error.message}`, { itemIndex: i });
					}

					const body: any = {};
					if (fields) {
						body.fields = fields.split(',').map((field: string) => field.trim());
					}
					if (Object.keys(parsedFilters).length > 0) {
						body.filters = parsedFilters;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/reports/${reportId}`,
						headers: {
							Authorization: `Basic ${Buffer.from(`${credentials.apiKey}:x`).toString('base64')}`,
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getCustomReports': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/reports/custom`,
						headers: {
							Authorization: `Basic ${Buffer.from(`${credentials.apiKey}:x`).toString('base64')}`,
							Accept: 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeCompanyFileOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('bamboohrApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			const baseUrl = `https://api.bamboohr.com/api/gateway.php/${credentials.companyDomain}/v1`;
			const headers = {
				'Authorization': `Basic ${Buffer.from(`${credentials.apiKey}:x`).toString('base64')}`,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			};

			switch (operation) {
				case 'getEmployeeFiles': {
					const employeeId = this.getNodeParameter('employeeId', i) as string;
					
					const options: any = {
						method: 'GET',
						url: `${baseUrl}/employees/${employeeId}/files/view/`,
						headers,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'uploadEmployeeFile': {
					const employeeId = this.getNodeParameter('employeeId', i) as string;
					const file = this.getNodeParameter('file', i) as string;
					const category = this.getNodeParameter('category', i) as string;
					const fileName = this.getNodeParameter('fileName', i, '') as string;
					const shareWithEmployee = this.getNodeParameter('shareWithEmployee', i, false) as boolean;

					const body: any = {
						file,
						category,
						shareWithEmployee,
					};

					if (fileName) {
						body.fileName = fileName;
					}

					const options: any = {
						method: 'POST',
						url: `${baseUrl}/employees/${employeeId}/files`,
						headers,
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'downloadFile': {
					const fileId = this.getNodeParameter('fileId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/files/${fileId}`,
						headers,
						json: false,
						encoding: null,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateFile': {
					const employeeId = this.getNodeParameter('employeeId', i) as string;
					const fileId = this.getNodeParameter('fileId', i) as string;
					const fileName = this.getNodeParameter('fileName', i, '') as string;
					const shareWithEmployee = this.getNodeParameter('shareWithEmployee', i, false) as boolean;

					const body: any = {
						shareWithEmployee,
					};

					if (fileName) {
						body.fileName = fileName;
					}

					const options: any = {
						method: 'POST',
						url: `${baseUrl}/employees/${employeeId}/files/${fileId}`,
						headers,
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteFile': {
					const employeeId = this.getNodeParameter('employeeId', i) as string;
					const fileId = this.getNodeParameter('fileId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${baseUrl}/employees/${employeeId}/files/${fileId}`,
						headers,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result || {},
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeGoalOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('bamboohrApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getEmployeeGoals': {
					const employeeId = this.getNodeParameter('employeeId', i) as string;
					
					const options: any = {
						method: 'GET',
						url: `https://api.bamboohr.com/api/gateway.php/${credentials.companyDomain}/v1/performance/employees/${employeeId}/goals`,
						headers: {
							'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':x').toString('base64')}`,
							'Accept': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createGoal': {
					const employeeId = this.getNodeParameter('employeeId', i) as string;
					const title = this.getNodeParameter('title', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const dueDate = this.getNodeParameter('dueDate', i) as string;
					const progressPercentage = this.getNodeParameter('progressPercentage', i) as number;

					const body: any = {
						title,
						description,
						status,
						progressPercentage,
					};

					if (dueDate) {
						body.dueDate = dueDate;
					}

					const options: any = {
						method: 'POST',
						url: `https://api.bamboohr.com/api/gateway.php/${credentials.companyDomain}/v1/performance/employees/${employeeId}/goals`,
						headers: {
							'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':x').toString('base64')}`,
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateGoal': {
					const employeeId = this.getNodeParameter('employeeId', i) as string;
					const goalId = this.getNodeParameter('goalId', i) as string;
					const title = this.getNodeParameter('title', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const dueDate = this.getNodeParameter('dueDate', i) as string;
					const progressPercentage = this.getNodeParameter('progressPercentage', i) as number;

					const body: any = {
						title,
						description,
						status,
						progressPercentage,
					};

					if (dueDate) {
						body.dueDate = dueDate;
					}

					const options: any = {
						method: 'PUT',
						url: `https://api.bamboohr.com/api/gateway.php/${credentials.companyDomain}/v1/performance/employees/${employeeId}/goals/${goalId}`,
						headers: {
							'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':x').toString('base64')}`,
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteGoal': {
					const employeeId = this.getNodeParameter('employeeId', i) as string;
					const goalId = this.getNodeParameter('goalId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `https://api.bamboohr.com/api/gateway.php/${credentials.companyDomain}/v1/performance/employees/${employeeId}/goals/${goalId}`,
						headers: {
							'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':x').toString('base64')}`,
							'Accept': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeTimeTrackingOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('bamboohrApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getTimesheet': {
					const timesheetId = this.getNodeParameter('timesheetId', i) as string;
					
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl.replace('{companyDomain}', credentials.companyDomain)}/time_tracking/timesheets/${timesheetId}`,
						headers: {
							'Authorization': `Basic ${Buffer.from(`${credentials.apiKey}:x`).toString('base64')}`,
							'Accept': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'addTimeEntry': {
					const employeeId = this.getNodeParameter('employeeId', i) as string;
					const start = this.getNodeParameter('start', i) as string;
					const end = this.getNodeParameter('end', i) as string;
					const timezone = this.getNodeParameter('timezone', i) as string;

					const body = {
						employeeId: employeeId,
						start: start,
						end: end,
						timezone: timezone,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl.replace('{companyDomain}', credentials.companyDomain)}/time_tracking/record`,
						headers: {
							'Authorization': `Basic ${Buffer.from(`${credentials.apiKey}:x`).toString('base64')}`,
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body: body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateTimeEntry': {
					const timesheetId = this.getNodeParameter('timesheetId', i) as string;
					const start = this.getNodeParameter('start', i) as string;
					const end = this.getNodeParameter('end', i) as string;
					const timezone = this.getNodeParameter('timezone', i) as string;

					const body: any = {};
					if (start) body.start = start;
					if (end) body.end = end;
					if (timezone) body.timezone = timezone;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl.replace('{companyDomain}', credentials.companyDomain)}/time_tracking/record/${timesheetId}`,
						headers: {
							'Authorization': `Basic ${Buffer.from(`${credentials.apiKey}:x`).toString('base64')}`,
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body: body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteTimeEntry': {
					const timesheetId = this.getNodeParameter('timesheetId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl.replace('{companyDomain}', credentials.companyDomain)}/time_tracking/record/${timesheetId}`,
						headers: {
							'Authorization': `Basic ${Buffer.from(`${credentials.apiKey}:x`).toString('base64')}`,
							'Accept': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'clockIn': {
					const employeeId = this.getNodeParameter('employeeId', i) as string;
					const timezone = this.getNodeParameter('timezone', i) as string;

					const body = {
						employeeId: employeeId,
						timezone: timezone,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl.replace('{companyDomain}', credentials.companyDomain)}/time_tracking/clock_in`,
						headers: {
							'Authorization': `Basic ${Buffer.from(`${credentials.apiKey}:x`).toString('base64')}`,
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body: body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'clockOut': {
					const employeeId = this.getNodeParameter('employeeId', i) as string;
					const timezone = this.getNodeParameter('timezone', i) as string;

					const body = {
						employeeId: employeeId,
						timezone: timezone,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl.replace('{companyDomain}', credentials.companyDomain)}/time_tracking/clock_out`,
						headers: {
							'Authorization': `Basic ${Buffer.from(`${credentials.apiKey}:x`).toString('base64')}`,
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body: body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
					);
			}

			returnData.push({
				json: result || {},
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
