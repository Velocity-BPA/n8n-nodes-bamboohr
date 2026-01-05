/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, INodeExecutionData } from 'n8n-workflow';

/**
 * Convert date string to BambooHR format (YYYY-MM-DD)
 */
export function formatDate(date: string | Date): string {
	if (date instanceof Date) {
		return date.toISOString().split('T')[0];
	}
	// If already in YYYY-MM-DD format, return as-is
	if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		return date;
	}
	// Try to parse and format
	const parsed = new Date(date);
	if (isNaN(parsed.getTime())) {
		throw new Error(`Invalid date format: ${date}`);
	}
	return parsed.toISOString().split('T')[0];
}

/**
 * Convert datetime string to BambooHR format (YYYY-MM-DDTHH:MM:SS)
 */
export function formatDateTime(datetime: string | Date): string {
	if (datetime instanceof Date) {
		return datetime.toISOString().replace('Z', '');
	}
	const parsed = new Date(datetime);
	if (isNaN(parsed.getTime())) {
		throw new Error(`Invalid datetime format: ${datetime}`);
	}
	return parsed.toISOString().replace('Z', '');
}

/**
 * Build query string for employee fields
 */
export function buildFieldsQuery(fields: string | string[]): string {
	if (Array.isArray(fields)) {
		return fields.join(',');
	}
	return fields;
}

/**
 * Parse employee data from BambooHR response
 */
export function parseEmployeeData(data: IDataObject): IDataObject {
	const result: IDataObject = {};
	
	for (const [key, value] of Object.entries(data)) {
		if (value !== null && value !== undefined && value !== '') {
			result[key] = value;
		}
	}
	
	return result;
}

/**
 * Convert node execution data to BambooHR employee create/update format
 */
export function buildEmployeePayload(data: IDataObject): IDataObject {
	const payload: IDataObject = {};
	
	const fieldMappings: IDataObject = {
		firstName: 'firstName',
		lastName: 'lastName',
		email: 'workEmail',
		workEmail: 'workEmail',
		personalEmail: 'homeEmail',
		homeEmail: 'homeEmail',
		mobilePhone: 'mobilePhone',
		workPhone: 'workPhone',
		department: 'department',
		division: 'division',
		location: 'location',
		jobTitle: 'jobTitle',
		hireDate: 'hireDate',
		startDate: 'startDate',
		employmentStatus: 'employmentHistoryStatus',
		supervisor: 'supervisor',
		supervisorId: 'supervisorId',
		address1: 'address1',
		address2: 'address2',
		city: 'city',
		state: 'state',
		zipCode: 'zipcode',
		country: 'country',
		dateOfBirth: 'dateOfBirth',
		gender: 'gender',
		maritalStatus: 'maritalStatus',
		ssn: 'ssn',
		payRate: 'payRate',
		payType: 'payType',
		payPer: 'payPer',
		exempt: 'exempt',
	};
	
	for (const [inputKey, apiKey] of Object.entries(fieldMappings)) {
		if (data[inputKey] !== undefined && data[inputKey] !== null && data[inputKey] !== '') {
			payload[apiKey as string] = data[inputKey];
		}
	}
	
	// Handle custom fields
	if (data.customFields && typeof data.customFields === 'object') {
		Object.assign(payload, data.customFields);
	}
	
	return payload;
}

/**
 * Build time off request payload
 */
export function buildTimeOffPayload(data: IDataObject): IDataObject {
	const payload: IDataObject = {};
	
	if (data.timeOffTypeId) payload.timeOffTypeId = data.timeOffTypeId;
	if (data.start) payload.start = formatDate(data.start as string);
	if (data.end) payload.end = formatDate(data.end as string);
	if (data.amount) payload.amount = data.amount;
	if (data.status) payload.status = data.status;
	if (data.notes || data.note) payload.notes = [{ note: data.notes || data.note }];
	if (data.previousRequest) payload.previousRequest = data.previousRequest;
	
	return payload;
}

/**
 * Build custom report payload
 */
export function buildCustomReportPayload(
	title: string,
	fields: string[],
	filters?: IDataObject,
): IDataObject {
	const payload: IDataObject = {
		title,
		fields,
	};
	
	if (filters && Object.keys(filters).length > 0) {
		payload.filters = filters;
	}
	
	return payload;
}

/**
 * Parse time off balance response
 */
export function parseTimeOffBalance(data: IDataObject): IDataObject[] {
	const balances: IDataObject[] = [];
	
	if (data && typeof data === 'object') {
		for (const [typeId, balance] of Object.entries(data)) {
			if (typeof balance === 'object' && balance !== null) {
				balances.push({
					timeOffTypeId: typeId,
					...balance,
				});
			}
		}
	}
	
	return balances;
}

/**
 * Build goal payload
 */
export function buildGoalPayload(data: IDataObject): IDataObject {
	const payload: IDataObject = {};
	
	if (data.title) payload.title = data.title;
	if (data.description) payload.description = data.description;
	if (data.dueDate) payload.dueDate = formatDate(data.dueDate as string);
	if (data.percentComplete !== undefined) payload.percentComplete = data.percentComplete;
	if (data.status) payload.status = data.status;
	if (data.alignsWithGoalId) payload.alignsWithGoalId = data.alignsWithGoalId;
	if (data.sharedWithEmployeeIds) payload.sharedWithEmployeeIds = data.sharedWithEmployeeIds;
	
	return payload;
}

/**
 * Build clock entry payload
 */
export function buildClockEntryPayload(data: IDataObject): IDataObject {
	const payload: IDataObject = {};
	
	if (data.employeeId) payload.employeeId = data.employeeId;
	if (data.date) payload.date = formatDate(data.date as string);
	if (data.start) payload.start = data.start;
	if (data.end) payload.end = data.end;
	if (data.clockIn) payload.clockIn = data.clockIn;
	if (data.clockOut) payload.clockOut = data.clockOut;
	if (data.projectId) payload.projectId = data.projectId;
	if (data.taskId) payload.taskId = data.taskId;
	if (data.note) payload.note = data.note;
	
	return payload;
}

/**
 * Convert response to n8n execution data format
 */
export function toExecutionData(data: IDataObject | IDataObject[]): INodeExecutionData[] {
	if (Array.isArray(data)) {
		return data.map((item) => ({ json: item }));
	}
	return [{ json: data }];
}

/**
 * Standard employee fields for BambooHR
 */
export const STANDARD_EMPLOYEE_FIELDS = [
	'id',
	'displayName',
	'firstName',
	'lastName',
	'preferredName',
	'gender',
	'jobTitle',
	'workPhone',
	'mobilePhone',
	'workEmail',
	'department',
	'location',
	'division',
	'supervisor',
	'photoUploaded',
	'photoUrl',
	'canUploadPhoto',
];

/**
 * All available employee fields for BambooHR
 */
export const ALL_EMPLOYEE_FIELDS = [
	'address1',
	'address2',
	'age',
	'bestEmail',
	'birthday',
	'city',
	'country',
	'dateOfBirth',
	'department',
	'division',
	'eeo',
	'employeeNumber',
	'employmentHistoryStatus',
	'ethnicity',
	'exempt',
	'firstName',
	'flsaCode',
	'fullName1',
	'fullName2',
	'fullName3',
	'fullName4',
	'fullName5',
	'displayName',
	'gender',
	'hireDate',
	'homeEmail',
	'homePhone',
	'id',
	'isPhotoUploaded',
	'jobTitle',
	'lastChanged',
	'lastName',
	'location',
	'maritalStatus',
	'middleName',
	'mobilePhone',
	'originalHireDate',
	'payChangeReason',
	'payGroup',
	'payGroupId',
	'payRate',
	'payRateEffectiveDate',
	'payType',
	'payPer',
	'paidPer',
	'paySchedule',
	'payScheduleId',
	'payFrequency',
	'includeInPayroll',
	'preferredName',
	'ssn',
	'sin',
	'state',
	'stateCode',
	'status',
	'supervisor',
	'supervisorId',
	'supervisorEId',
	'terminationDate',
	'workEmail',
	'workPhone',
	'workPhoneExtension',
	'workPhonePlusExtension',
	'zipcode',
];

/**
 * Time off status options
 */
export const TIME_OFF_STATUS_OPTIONS = [
	{ name: 'Approved', value: 'approved' },
	{ name: 'Denied', value: 'denied' },
	{ name: 'Requested', value: 'requested' },
	{ name: 'Canceled', value: 'canceled' },
	{ name: 'Superseded', value: 'superseded' },
];

/**
 * Report format options
 */
export const REPORT_FORMAT_OPTIONS = [
	{ name: 'JSON', value: 'JSON' },
	{ name: 'CSV', value: 'CSV' },
	{ name: 'XML', value: 'XML' },
	{ name: 'PDF', value: 'PDF' },
];

/**
 * Goal status options
 */
export const GOAL_STATUS_OPTIONS = [
	{ name: 'Open', value: 'open' },
	{ name: 'Closed', value: 'closed' },
];

/**
 * Webhook event options
 */
export const WEBHOOK_EVENT_OPTIONS = [
	{ name: 'Employee Created', value: 'employee.created' },
	{ name: 'Employee Updated', value: 'employee.updated' },
	{ name: 'Employee Deleted', value: 'employee.deleted' },
	{ name: 'Time Off Created', value: 'timeOff.created' },
	{ name: 'Time Off Updated', value: 'timeOff.updated' },
	{ name: 'Time Off Deleted', value: 'timeOff.deleted' },
	{ name: 'Job Created', value: 'job.created' },
	{ name: 'Job Updated', value: 'job.updated' },
	{ name: 'Job Deleted', value: 'job.deleted' },
];

/**
 * Common table names in BambooHR
 */
export const COMMON_TABLE_NAMES = [
	{ name: 'Job Info', value: 'jobInfo' },
	{ name: 'Employment Status', value: 'employmentStatus' },
	{ name: 'Compensation', value: 'compensation' },
	{ name: 'Direct Deposit', value: 'directDeposit' },
	{ name: 'Dependents', value: 'dependents' },
	{ name: 'Emergency Contacts', value: 'emergencyContacts' },
	{ name: 'Education', value: 'education' },
	{ name: 'Custom Table', value: 'customTable' },
];
