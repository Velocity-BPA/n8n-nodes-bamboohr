/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import * as actions from './actions';

// Emit licensing notice once on module load
const hasLoggedLicenseNotice = Symbol.for('bambooHr.licenseNoticeLogged');
if (!(global as Record<symbol, boolean>)[hasLoggedLicenseNotice]) {
	console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
	(global as Record<symbol, boolean>)[hasLoggedLicenseNotice] = true;
}

export class BambooHr implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BambooHR',
		name: 'bambooHr',
		icon: 'file:bamboohr.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with BambooHR API for HR management',
		defaults: {
			name: 'BambooHR',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'bambooHrApi',
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
						description: 'Manage employees',
					},
					{
						name: 'Employee File',
						value: 'employeeFile',
						description: 'Manage employee files',
					},
					{
						name: 'Time Off',
						value: 'timeOff',
						description: 'Manage time off requests and balances',
					},
					{
						name: 'Report',
						value: 'report',
						description: 'Generate and retrieve reports',
					},
					{
						name: 'Table',
						value: 'table',
						description: 'Manage custom table data',
					},
					{
						name: 'Benefit',
						value: 'benefit',
						description: 'Manage benefits and enrollments',
					},
					{
						name: 'Goal',
						value: 'goal',
						description: 'Manage employee goals',
					},
					{
						name: 'Time Tracking',
						value: 'timeTracking',
						description: 'Manage time tracking entries',
					},
					{
						name: 'Webhook',
						value: 'webhook',
						description: 'Manage webhooks',
					},
				],
				default: 'employee',
			},
			// Employee Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['employee'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new employee',
						action: 'Create an employee',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an employee by ID',
						action: 'Get an employee',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get multiple employees',
						action: 'Get many employees',
					},
					{
						name: 'Get Directory',
						value: 'getDirectory',
						description: 'Get employee directory',
						action: 'Get employee directory',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an employee',
						action: 'Update an employee',
					},
					{
						name: 'Get Fields',
						value: 'getFields',
						description: 'Get available employee fields',
						action: 'Get employee fields',
					},
					{
						name: 'Get Changed Employees',
						value: 'getChangedEmployees',
						description: 'Get recently changed employees',
						action: 'Get changed employees',
					},
					{
						name: 'Upload Photo',
						value: 'uploadPhoto',
						description: 'Upload employee photo',
						action: 'Upload employee photo',
					},
				],
				default: 'get',
			},
			// Employee File Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['employeeFile'],
					},
				},
				options: [
					{
						name: 'List Categories',
						value: 'listCategories',
						description: 'List file categories',
						action: 'List file categories',
					},
					{
						name: 'Add Category',
						value: 'addCategory',
						description: 'Add a file category',
						action: 'Add a file category',
					},
					{
						name: 'List Files',
						value: 'listFiles',
						description: 'List employee files',
						action: 'List employee files',
					},
					{
						name: 'Upload File',
						value: 'uploadFile',
						description: 'Upload a file',
						action: 'Upload a file',
					},
					{
						name: 'Get File',
						value: 'getFile',
						description: 'Download a file',
						action: 'Download a file',
					},
					{
						name: 'Update File',
						value: 'updateFile',
						description: 'Update file information',
						action: 'Update a file',
					},
					{
						name: 'Delete File',
						value: 'deleteFile',
						description: 'Delete a file',
						action: 'Delete a file',
					},
				],
				default: 'listFiles',
			},
			// Time Off Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['timeOff'],
					},
				},
				options: [
					{
						name: 'Get Requests',
						value: 'getRequests',
						description: 'Get time off requests',
						action: 'Get time off requests',
					},
					{
						name: 'Create Request',
						value: 'createRequest',
						description: 'Create a time off request',
						action: 'Create time off request',
					},
					{
						name: 'Update Request Status',
						value: 'updateRequestStatus',
						description: 'Approve or deny a request',
						action: 'Update request status',
					},
					{
						name: 'Get Balances',
						value: 'getBalances',
						description: 'Get time off balances',
						action: 'Get time off balances',
					},
					{
						name: 'Get Policies',
						value: 'getPolicies',
						description: 'Get time off policies',
						action: 'Get time off policies',
					},
					{
						name: 'Get Types',
						value: 'getTypes',
						description: 'Get time off types',
						action: 'Get time off types',
					},
					{
						name: 'Add History',
						value: 'addHistory',
						description: 'Add time off history',
						action: 'Add time off history',
					},
					{
						name: 'Estimate Future Balance',
						value: 'estimateFutureBalance',
						description: 'Estimate future time off balance',
						action: 'Estimate future balance',
					},
				],
				default: 'getRequests',
			},
			// Report Operations
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
						description: 'Get a standard report',
						action: 'Get a report',
					},
					{
						name: 'Create Custom Report',
						value: 'createCustomReport',
						description: 'Generate a custom report',
						action: 'Create custom report',
					},
					{
						name: 'List Reports',
						value: 'listReports',
						description: 'List available reports',
						action: 'List reports',
					},
				],
				default: 'listReports',
			},
			// Table Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['table'],
					},
				},
				options: [
					{
						name: 'Get Table Data',
						value: 'getTableData',
						description: 'Get table rows for an employee',
						action: 'Get table data',
					},
					{
						name: 'Add Table Row',
						value: 'addTableRow',
						description: 'Add a row to an employee table',
						action: 'Add table row',
					},
					{
						name: 'Update Table Row',
						value: 'updateTableRow',
						description: 'Update a table row',
						action: 'Update table row',
					},
					{
						name: 'Delete Table Row',
						value: 'deleteTableRow',
						description: 'Delete a table row',
						action: 'Delete table row',
					},
					{
						name: 'Get Table List',
						value: 'getTableList',
						description: 'List available tables',
						action: 'Get table list',
					},
				],
				default: 'getTableList',
			},
			// Benefit Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['benefit'],
					},
				},
				options: [
					{
						name: 'Get Benefit Plans',
						value: 'getBenefitPlans',
						description: 'Get benefit plans',
						action: 'Get benefit plans',
					},
					{
						name: 'Get Benefit Groups',
						value: 'getBenefitGroups',
						description: 'Get benefit groups',
						action: 'Get benefit groups',
					},
					{
						name: 'Get Enrollments',
						value: 'getEnrollments',
						description: 'Get benefit enrollments',
						action: 'Get enrollments',
					},
					{
						name: 'Update Enrollment',
						value: 'updateEnrollment',
						description: 'Update a benefit enrollment',
						action: 'Update enrollment',
					},
					{
						name: 'Get Deductions',
						value: 'getBenefitDeductions',
						description: 'Get benefit deductions',
						action: 'Get deductions',
					},
					{
						name: 'Get Dependents',
						value: 'getBenefitDependents',
						description: 'Get benefit dependents',
						action: 'Get dependents',
					},
				],
				default: 'getBenefitPlans',
			},
			// Goal Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['goal'],
					},
				},
				options: [
					{
						name: 'Get Goals',
						value: 'getGoals',
						description: 'Get employee goals',
						action: 'Get goals',
					},
					{
						name: 'Create Goal',
						value: 'createGoal',
						description: 'Create a goal',
						action: 'Create a goal',
					},
					{
						name: 'Update Goal',
						value: 'updateGoal',
						description: 'Update a goal',
						action: 'Update a goal',
					},
					{
						name: 'Delete Goal',
						value: 'deleteGoal',
						description: 'Delete a goal',
						action: 'Delete a goal',
					},
					{
						name: 'Get Goal Status',
						value: 'getGoalStatus',
						description: 'Get goal status',
						action: 'Get goal status',
					},
					{
						name: 'Update Goal Progress',
						value: 'updateGoalProgress',
						description: 'Update goal progress',
						action: 'Update goal progress',
					},
					{
						name: 'Close Goal',
						value: 'closeGoal',
						description: 'Close a goal',
						action: 'Close a goal',
					},
				],
				default: 'getGoals',
			},
			// Time Tracking Operations
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
						name: 'Get Timesheets',
						value: 'getTimesheets',
						description: 'Get timesheets',
						action: 'Get timesheets',
					},
					{
						name: 'Get Clock Entries',
						value: 'getClockEntries',
						description: 'Get clock entries',
						action: 'Get clock entries',
					},
					{
						name: 'Add Clock Entry',
						value: 'addClockEntry',
						description: 'Add a clock entry',
						action: 'Add clock entry',
					},
					{
						name: 'Update Clock Entry',
						value: 'updateClockEntry',
						description: 'Update a clock entry',
						action: 'Update clock entry',
					},
					{
						name: 'Delete Clock Entry',
						value: 'deleteClockEntry',
						description: 'Delete a clock entry',
						action: 'Delete clock entry',
					},
					{
						name: 'Get Daily Entries',
						value: 'getDailyEntries',
						description: 'Get daily time entries',
						action: 'Get daily entries',
					},
					{
						name: 'Approve Timesheets',
						value: 'approveTimesheets',
						description: 'Approve timesheets',
						action: 'Approve timesheets',
					},
				],
				default: 'getTimesheets',
			},
			// Webhook Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['webhook'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a webhook',
						action: 'Create a webhook',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all webhooks',
						action: 'Get all webhooks',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a webhook',
						action: 'Delete a webhook',
					},
				],
				default: 'getAll',
			},
			// Employee Parameters
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['get', 'update', 'uploadPhoto'],
					},
				},
				default: '',
				description: 'The ID of the employee',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'First name of the employee',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Last name of the employee',
			},
			{
				displayName: 'Since',
				name: 'since',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['getChangedEmployees'],
					},
				},
				default: '',
				description: 'Get employees changed since this date/time',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['uploadPhoto'],
					},
				},
				default: 'data',
				description: 'Name of the binary property containing the photo',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['create'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Work Email',
						name: 'workEmail',
						type: 'string',
						default: '',
						description: 'Work email address',
					},
					{
						displayName: 'Job Title',
						name: 'jobTitle',
						type: 'string',
						default: '',
						description: 'Job title',
					},
					{
						displayName: 'Department',
						name: 'department',
						type: 'string',
						default: '',
						description: 'Department name',
					},
					{
						displayName: 'Hire Date',
						name: 'hireDate',
						type: 'dateTime',
						default: '',
						description: 'Hire date',
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						description: 'Work location',
					},
					{
						displayName: 'Division',
						name: 'division',
						type: 'string',
						default: '',
						description: 'Division name',
					},
					{
						displayName: 'Mobile Phone',
						name: 'mobilePhone',
						type: 'string',
						default: '',
						description: 'Mobile phone number',
					},
					{
						displayName: 'Work Phone',
						name: 'workPhone',
						type: 'string',
						default: '',
						description: 'Work phone number',
					},
				],
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'First Name',
						name: 'firstName',
						type: 'string',
						default: '',
						description: 'First name',
					},
					{
						displayName: 'Last Name',
						name: 'lastName',
						type: 'string',
						default: '',
						description: 'Last name',
					},
					{
						displayName: 'Work Email',
						name: 'workEmail',
						type: 'string',
						default: '',
						description: 'Work email address',
					},
					{
						displayName: 'Job Title',
						name: 'jobTitle',
						type: 'string',
						default: '',
						description: 'Job title',
					},
					{
						displayName: 'Department',
						name: 'department',
						type: 'string',
						default: '',
						description: 'Department name',
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						description: 'Work location',
					},
					{
						displayName: 'Division',
						name: 'division',
						type: 'string',
						default: '',
						description: 'Division name',
					},
					{
						displayName: 'Mobile Phone',
						name: 'mobilePhone',
						type: 'string',
						default: '',
						description: 'Mobile phone number',
					},
					{
						displayName: 'Work Phone',
						name: 'workPhone',
						type: 'string',
						default: '',
						description: 'Work phone number',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['get', 'getAll', 'getChangedEmployees'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Fields',
						name: 'fields',
						type: 'string',
						default: '',
						description: 'Comma-separated list of fields to return',
						displayOptions: {
							show: {
								'/operation': ['get'],
							},
						},
					},
					{
						displayName: 'Only Current',
						name: 'onlyCurrent',
						type: 'boolean',
						default: true,
						description: 'Whether to include only current employees',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'All', value: 'all' },
							{ name: 'Inserted', value: 'inserted' },
							{ name: 'Updated', value: 'updated' },
							{ name: 'Deleted', value: 'deleted' },
						],
						default: 'all',
						description: 'Type of changes to return',
						displayOptions: {
							show: {
								'/operation': ['getChangedEmployees'],
							},
						},
					},
				],
			},
			// Employee File Parameters
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['employeeFile'],
						operation: ['listFiles', 'uploadFile', 'getFile', 'updateFile', 'deleteFile'],
					},
				},
				default: '',
				description: 'The ID of the employee',
			},
			{
				displayName: 'Category Name',
				name: 'categoryName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['employeeFile'],
						operation: ['addCategory'],
					},
				},
				default: '',
				description: 'Name of the file category',
			},
			{
				displayName: 'Category ID',
				name: 'categoryId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['employeeFile'],
						operation: ['uploadFile'],
					},
				},
				default: '',
				description: 'ID of the file category',
			},
			{
				displayName: 'File ID',
				name: 'fileId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['employeeFile'],
						operation: ['getFile', 'updateFile', 'deleteFile'],
					},
				},
				default: '',
				description: 'ID of the file',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['employeeFile'],
						operation: ['uploadFile', 'getFile'],
					},
				},
				default: 'data',
				description: 'Name of the binary property',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				displayOptions: {
					show: {
						resource: ['employeeFile'],
						operation: ['uploadFile'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'File Name',
						name: 'fileName',
						type: 'string',
						default: '',
						description: 'Name for the uploaded file',
					},
					{
						displayName: 'Share with Employee',
						name: 'shareWithEmployee',
						type: 'boolean',
						default: false,
						description: 'Whether to share the file with the employee',
					},
				],
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['employeeFile'],
						operation: ['updateFile'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'File Name',
						name: 'fileName',
						type: 'string',
						default: '',
						description: 'New file name',
					},
					{
						displayName: 'Category ID',
						name: 'categoryId',
						type: 'string',
						default: '',
						description: 'New category ID',
					},
					{
						displayName: 'Share with Employee',
						name: 'shareWithEmployee',
						type: 'boolean',
						default: false,
						description: 'Whether to share with employee',
					},
				],
			},
			// Time Off Parameters
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeOff'],
						operation: ['createRequest', 'getBalances', 'addHistory', 'estimateFutureBalance'],
					},
				},
				default: '',
				description: 'The ID of the employee',
			},
			{
				displayName: 'Request ID',
				name: 'requestId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeOff'],
						operation: ['updateRequestStatus'],
					},
				},
				default: '',
				description: 'The ID of the time off request',
			},
			{
				displayName: 'Start Date',
				name: 'start',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeOff'],
						operation: ['getRequests', 'createRequest'],
					},
				},
				default: '',
				description: 'Start date for the time off',
			},
			{
				displayName: 'End Date',
				name: 'end',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeOff'],
						operation: ['getRequests', 'createRequest'],
					},
				},
				default: '',
				description: 'End date for the time off',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeOff'],
						operation: ['estimateFutureBalance'],
					},
				},
				default: '',
				description: 'Date to estimate balance for',
			},
			{
				displayName: 'Time Off Type ID',
				name: 'timeOffTypeId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeOff'],
						operation: ['createRequest', 'addHistory'],
					},
				},
				default: '',
				description: 'ID of the time off type',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeOff'],
						operation: ['updateRequestStatus'],
					},
				},
				options: [
					{ name: 'Approved', value: 'approved' },
					{ name: 'Denied', value: 'denied' },
					{ name: 'Canceled', value: 'canceled' },
				],
				default: 'approved',
				description: 'New status for the request',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeOff'],
						operation: ['addHistory'],
					},
				},
				default: '',
				description: 'Date for the time off history entry',
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeOff'],
						operation: ['addHistory'],
					},
				},
				default: 0,
				description: 'Amount of time off (hours or days)',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['timeOff'],
						operation: ['createRequest'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Amount',
						name: 'amount',
						type: 'number',
						default: 0,
						description: 'Amount of time off',
					},
					{
						displayName: 'Notes',
						name: 'notes',
						type: 'string',
						default: '',
						description: 'Notes for the request',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{ name: 'Requested', value: 'requested' },
							{ name: 'Approved', value: 'approved' },
						],
						default: 'requested',
						description: 'Initial status',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				displayOptions: {
					show: {
						resource: ['timeOff'],
						operation: ['getRequests', 'updateRequestStatus', 'addHistory'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{ name: 'All', value: '' },
							{ name: 'Approved', value: 'approved' },
							{ name: 'Denied', value: 'denied' },
							{ name: 'Requested', value: 'requested' },
							{ name: 'Canceled', value: 'canceled' },
						],
						default: '',
						description: 'Filter by status',
						displayOptions: {
							show: {
								'/operation': ['getRequests'],
							},
						},
					},
					{
						displayName: 'Employee ID',
						name: 'employeeId',
						type: 'string',
						default: '',
						description: 'Filter by employee ID',
						displayOptions: {
							show: {
								'/operation': ['getRequests'],
							},
						},
					},
					{
						displayName: 'Note',
						name: 'note',
						type: 'string',
						default: '',
						description: 'Add a note',
					},
				],
			},
			// Report Parameters
			{
				displayName: 'Report ID',
				name: 'reportId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getReport'],
					},
				},
				default: '',
				description: 'ID of the report to get',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['createCustomReport'],
					},
				},
				default: 'Custom Report',
				description: 'Title for the custom report',
			},
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['createCustomReport'],
					},
				},
				default: 'firstName,lastName,department',
				description: 'Comma-separated list of fields or JSON array',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getReport', 'createCustomReport'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Format',
						name: 'format',
						type: 'options',
						options: [
							{ name: 'JSON', value: 'JSON' },
							{ name: 'CSV', value: 'CSV' },
							{ name: 'XML', value: 'XML' },
							{ name: 'PDF', value: 'PDF' },
						],
						default: 'JSON',
						description: 'Output format',
					},
					{
						displayName: 'Only Current Employees',
						name: 'onlyCurrent',
						type: 'boolean',
						default: true,
						description: 'Whether to include only current employees',
					},
					{
						displayName: 'Last Changed',
						name: 'lastChanged',
						type: 'dateTime',
						default: '',
						description: 'Filter employees changed since date',
						displayOptions: {
							show: {
								'/operation': ['createCustomReport'],
							},
						},
					},
				],
			},
			// Table Parameters
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['getTableData', 'addTableRow', 'updateTableRow', 'deleteTableRow'],
					},
				},
				default: '',
				description: 'The ID of the employee',
			},
			{
				displayName: 'Table ID',
				name: 'tableId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['getTableData', 'addTableRow', 'updateTableRow', 'deleteTableRow'],
					},
				},
				default: 'jobInfo',
				description: 'ID or name of the table (e.g., jobInfo, employmentStatus)',
			},
			{
				displayName: 'Row ID',
				name: 'rowId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['updateTableRow', 'deleteTableRow'],
					},
				},
				default: '',
				description: 'ID of the row to update or delete',
			},
			{
				displayName: 'Row Data (JSON)',
				name: 'rowData',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['addTableRow', 'updateTableRow'],
					},
				},
				default: '{}',
				description: 'JSON object with row data',
			},
			// Benefit Parameters
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['benefit'],
						operation: ['getEnrollments', 'updateEnrollment', 'getBenefitDeductions', 'getBenefitDependents'],
					},
				},
				default: '',
				description: 'The ID of the employee',
			},
			{
				displayName: 'Enrollment ID',
				name: 'enrollmentId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['benefit'],
						operation: ['updateEnrollment'],
					},
				},
				default: '',
				description: 'ID of the enrollment',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				displayOptions: {
					show: {
						resource: ['benefit'],
						operation: ['getEnrollments'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Enrollment Status',
						name: 'enrollmentStatus',
						type: 'options',
						options: [
							{ name: 'Current', value: 'current' },
							{ name: 'Historical', value: 'historical' },
						],
						default: 'current',
						description: 'Filter by enrollment status',
					},
				],
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['benefit'],
						operation: ['updateEnrollment'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Benefit Plan ID',
						name: 'benefitPlanId',
						type: 'string',
						default: '',
						description: 'New benefit plan ID',
					},
					{
						displayName: 'Start Date',
						name: 'startDate',
						type: 'dateTime',
						default: '',
						description: 'Start date',
					},
					{
						displayName: 'End Date',
						name: 'endDate',
						type: 'dateTime',
						default: '',
						description: 'End date',
					},
					{
						displayName: 'Amount',
						name: 'amount',
						type: 'number',
						default: 0,
						description: 'Amount',
					},
				],
			},
			// Goal Parameters
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['goal'],
						operation: ['getGoals', 'createGoal', 'updateGoal', 'deleteGoal', 'getGoalStatus', 'updateGoalProgress', 'closeGoal'],
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
						operation: ['updateGoal', 'deleteGoal', 'getGoalStatus', 'updateGoalProgress', 'closeGoal'],
					},
				},
				default: '',
				description: 'ID of the goal',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['goal'],
						operation: ['createGoal'],
					},
				},
				default: '',
				description: 'Goal title',
			},
			{
				displayName: 'Percent Complete',
				name: 'percentComplete',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['goal'],
						operation: ['updateGoalProgress'],
					},
				},
				typeOptions: {
					minValue: 0,
					maxValue: 100,
				},
				default: 0,
				description: 'Progress percentage (0-100)',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['goal'],
						operation: ['createGoal'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Goal description',
					},
					{
						displayName: 'Due Date',
						name: 'dueDate',
						type: 'dateTime',
						default: '',
						description: 'Target completion date',
					},
					{
						displayName: 'Percent Complete',
						name: 'percentComplete',
						type: 'number',
						typeOptions: {
							minValue: 0,
							maxValue: 100,
						},
						default: 0,
						description: 'Initial progress percentage',
					},
				],
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['goal'],
						operation: ['updateGoal'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'Goal title',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Goal description',
					},
					{
						displayName: 'Due Date',
						name: 'dueDate',
						type: 'dateTime',
						default: '',
						description: 'Target completion date',
					},
					{
						displayName: 'Percent Complete',
						name: 'percentComplete',
						type: 'number',
						typeOptions: {
							minValue: 0,
							maxValue: 100,
						},
						default: 0,
						description: 'Progress percentage',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				displayOptions: {
					show: {
						resource: ['goal'],
						operation: ['getGoals', 'updateGoalProgress', 'closeGoal'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Filter',
						name: 'filter',
						type: 'options',
						options: [
							{ name: 'All', value: '' },
							{ name: 'Open', value: 'open' },
							{ name: 'Closed', value: 'closed' },
						],
						default: '',
						description: 'Filter goals by status',
						displayOptions: {
							show: {
								'/operation': ['getGoals'],
							},
						},
					},
					{
						displayName: 'Comment',
						name: 'comment',
						type: 'string',
						default: '',
						description: 'Add a comment',
					},
				],
			},
			// Time Tracking Parameters
			{
				displayName: 'Start Date',
				name: 'start',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeTracking'],
						operation: ['getTimesheets', 'getClockEntries', 'addClockEntry', 'getDailyEntries'],
					},
				},
				default: '',
				description: 'Start date',
			},
			{
				displayName: 'End Date',
				name: 'end',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeTracking'],
						operation: ['getTimesheets', 'getClockEntries', 'addClockEntry', 'getDailyEntries'],
					},
				},
				default: '',
				description: 'End date',
			},
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeTracking'],
						operation: ['addClockEntry', 'getDailyEntries'],
					},
				},
				default: '',
				description: 'The ID of the employee',
			},
			{
				displayName: 'Entry ID',
				name: 'entryId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeTracking'],
						operation: ['updateClockEntry', 'deleteClockEntry'],
					},
				},
				default: '',
				description: 'ID of the clock entry',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeTracking'],
						operation: ['addClockEntry'],
					},
				},
				default: '',
				description: 'Date for the entry',
			},
			{
				displayName: 'Timesheet IDs',
				name: 'timesheetIds',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeTracking'],
						operation: ['approveTimesheets'],
					},
				},
				default: '',
				description: 'Comma-separated list of timesheet IDs',
			},
			{
				displayName: 'Last Changed',
				name: 'lastChanged',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						resource: ['timeTracking'],
						operation: ['approveTimesheets'],
					},
				},
				default: '',
				description: 'Last changed timestamp for concurrency',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['timeTracking'],
						operation: ['addClockEntry'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Project ID',
						name: 'projectId',
						type: 'string',
						default: '',
						description: 'Project ID',
					},
					{
						displayName: 'Task ID',
						name: 'taskId',
						type: 'string',
						default: '',
						description: 'Task ID',
					},
					{
						displayName: 'Note',
						name: 'note',
						type: 'string',
						default: '',
						description: 'Note for the entry',
					},
				],
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['timeTracking'],
						operation: ['updateClockEntry'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Start Time',
						name: 'start',
						type: 'string',
						default: '',
						description: 'Start time (HH:MM)',
					},
					{
						displayName: 'End Time',
						name: 'end',
						type: 'string',
						default: '',
						description: 'End time (HH:MM)',
					},
					{
						displayName: 'Project ID',
						name: 'projectId',
						type: 'string',
						default: '',
						description: 'Project ID',
					},
					{
						displayName: 'Task ID',
						name: 'taskId',
						type: 'string',
						default: '',
						description: 'Task ID',
					},
					{
						displayName: 'Note',
						name: 'note',
						type: 'string',
						default: '',
						description: 'Note',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				displayOptions: {
					show: {
						resource: ['timeTracking'],
						operation: ['getTimesheets', 'getClockEntries'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Employee IDs',
						name: 'employeeIds',
						type: 'string',
						default: '',
						description: 'Comma-separated employee IDs to filter',
						displayOptions: {
							show: {
								'/operation': ['getTimesheets'],
							},
						},
					},
					{
						displayName: 'Employee ID',
						name: 'employeeId',
						type: 'string',
						default: '',
						description: 'Employee ID to filter',
						displayOptions: {
							show: {
								'/operation': ['getClockEntries'],
							},
						},
					},
				],
			},
			// Webhook Parameters
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['webhook'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Name for the webhook',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['webhook'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Webhook endpoint URL',
			},
			{
				displayName: 'Monitor Fields',
				name: 'monitorFields',
				type: 'multiOptions',
				required: true,
				displayOptions: {
					show: {
						resource: ['webhook'],
						operation: ['create'],
					},
				},
				options: [
					{ name: 'First Name', value: 'firstName' },
					{ name: 'Last Name', value: 'lastName' },
					{ name: 'Work Email', value: 'workEmail' },
					{ name: 'Job Title', value: 'jobTitle' },
					{ name: 'Department', value: 'department' },
					{ name: 'Division', value: 'division' },
					{ name: 'Location', value: 'location' },
					{ name: 'Status', value: 'status' },
					{ name: 'Hire Date', value: 'hireDate' },
					{ name: 'Termination Date', value: 'terminationDate' },
				],
				default: [],
				description: 'Fields to monitor for changes',
			},
			{
				displayName: 'Webhook ID',
				name: 'webhookId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['webhook'],
						operation: ['delete'],
					},
				},
				default: '',
				description: 'ID of the webhook to delete',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['webhook'],
						operation: ['create'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Post Fields',
						name: 'postFields',
						type: 'string',
						default: '',
						description: 'Comma-separated fields to include in webhook payload',
					},
					{
						displayName: 'Include Company Domain',
						name: 'includeCompanyDomain',
						type: 'boolean',
						default: true,
						description: 'Whether to include company domain in payload',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: INodeExecutionData[] = [];

				switch (resource) {
					case 'employee':
						switch (operation) {
							case 'create':
								responseData = await actions.employee.create.call(this, i);
								break;
							case 'get':
								responseData = await actions.employee.get.call(this, i);
								break;
							case 'getAll':
								responseData = await actions.employee.getAll.call(this, i);
								break;
							case 'getDirectory':
								responseData = await actions.employee.getDirectory.call(this, i);
								break;
							case 'update':
								responseData = await actions.employee.update.call(this, i);
								break;
							case 'getFields':
								responseData = await actions.employee.getFields.call(this, i);
								break;
							case 'getChangedEmployees':
								responseData = await actions.employee.getChangedEmployees.call(this, i);
								break;
							case 'uploadPhoto':
								responseData = await actions.employee.uploadPhoto.call(this, i);
								break;
						}
						break;
					case 'employeeFile':
						switch (operation) {
							case 'listCategories':
								responseData = await actions.employeeFile.listCategories.call(this, i);
								break;
							case 'addCategory':
								responseData = await actions.employeeFile.addCategory.call(this, i);
								break;
							case 'listFiles':
								responseData = await actions.employeeFile.listFiles.call(this, i);
								break;
							case 'uploadFile':
								responseData = await actions.employeeFile.uploadFile.call(this, i);
								break;
							case 'getFile':
								responseData = await actions.employeeFile.getFile.call(this, i);
								break;
							case 'updateFile':
								responseData = await actions.employeeFile.updateFile.call(this, i);
								break;
							case 'deleteFile':
								responseData = await actions.employeeFile.deleteFile.call(this, i);
								break;
						}
						break;
					case 'timeOff':
						switch (operation) {
							case 'getRequests':
								responseData = await actions.timeOff.getRequests.call(this, i);
								break;
							case 'createRequest':
								responseData = await actions.timeOff.createRequest.call(this, i);
								break;
							case 'updateRequestStatus':
								responseData = await actions.timeOff.updateRequestStatus.call(this, i);
								break;
							case 'getBalances':
								responseData = await actions.timeOff.getBalances.call(this, i);
								break;
							case 'getPolicies':
								responseData = await actions.timeOff.getPolicies.call(this, i);
								break;
							case 'getTypes':
								responseData = await actions.timeOff.getTypes.call(this, i);
								break;
							case 'addHistory':
								responseData = await actions.timeOff.addHistory.call(this, i);
								break;
							case 'estimateFutureBalance':
								responseData = await actions.timeOff.estimateFutureBalance.call(this, i);
								break;
						}
						break;
					case 'report':
						switch (operation) {
							case 'getReport':
								responseData = await actions.report.getReport.call(this, i);
								break;
							case 'createCustomReport':
								responseData = await actions.report.createCustomReport.call(this, i);
								break;
							case 'listReports':
								responseData = await actions.report.listReports.call(this, i);
								break;
						}
						break;
					case 'table':
						switch (operation) {
							case 'getTableData':
								responseData = await actions.table.getTableData.call(this, i);
								break;
							case 'addTableRow':
								responseData = await actions.table.addTableRow.call(this, i);
								break;
							case 'updateTableRow':
								responseData = await actions.table.updateTableRow.call(this, i);
								break;
							case 'deleteTableRow':
								responseData = await actions.table.deleteTableRow.call(this, i);
								break;
							case 'getTableList':
								responseData = await actions.table.getTableList.call(this, i);
								break;
						}
						break;
					case 'benefit':
						switch (operation) {
							case 'getBenefitPlans':
								responseData = await actions.benefit.getBenefitPlans.call(this, i);
								break;
							case 'getBenefitGroups':
								responseData = await actions.benefit.getBenefitGroups.call(this, i);
								break;
							case 'getEnrollments':
								responseData = await actions.benefit.getEnrollments.call(this, i);
								break;
							case 'updateEnrollment':
								responseData = await actions.benefit.updateEnrollment.call(this, i);
								break;
							case 'getBenefitDeductions':
								responseData = await actions.benefit.getBenefitDeductions.call(this, i);
								break;
							case 'getBenefitDependents':
								responseData = await actions.benefit.getBenefitDependents.call(this, i);
								break;
						}
						break;
					case 'goal':
						switch (operation) {
							case 'getGoals':
								responseData = await actions.goal.getGoals.call(this, i);
								break;
							case 'createGoal':
								responseData = await actions.goal.createGoal.call(this, i);
								break;
							case 'updateGoal':
								responseData = await actions.goal.updateGoal.call(this, i);
								break;
							case 'deleteGoal':
								responseData = await actions.goal.deleteGoal.call(this, i);
								break;
							case 'getGoalStatus':
								responseData = await actions.goal.getGoalStatus.call(this, i);
								break;
							case 'updateGoalProgress':
								responseData = await actions.goal.updateGoalProgress.call(this, i);
								break;
							case 'closeGoal':
								responseData = await actions.goal.closeGoal.call(this, i);
								break;
						}
						break;
					case 'timeTracking':
						switch (operation) {
							case 'getTimesheets':
								responseData = await actions.timeTracking.getTimesheets.call(this, i);
								break;
							case 'getClockEntries':
								responseData = await actions.timeTracking.getClockEntries.call(this, i);
								break;
							case 'addClockEntry':
								responseData = await actions.timeTracking.addClockEntry.call(this, i);
								break;
							case 'updateClockEntry':
								responseData = await actions.timeTracking.updateClockEntry.call(this, i);
								break;
							case 'deleteClockEntry':
								responseData = await actions.timeTracking.deleteClockEntry.call(this, i);
								break;
							case 'getDailyEntries':
								responseData = await actions.timeTracking.getDailyEntries.call(this, i);
								break;
							case 'approveTimesheets':
								responseData = await actions.timeTracking.approveTimesheets.call(this, i);
								break;
						}
						break;
					case 'webhook':
						switch (operation) {
							case 'create':
								responseData = await actions.webhook.create.call(this, i);
								break;
							case 'getAll':
								responseData = await actions.webhook.getAll.call(this, i);
								break;
							case 'delete':
								responseData = await actions.webhook.deleteWebhook.call(this, i);
								break;
						}
						break;
				}

				returnData.push(...responseData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
