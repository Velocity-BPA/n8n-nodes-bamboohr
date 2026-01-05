/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';
import { buildCustomReportPayload } from '../../utils';

export async function createCustomReport(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const title = this.getNodeParameter('title', index) as string;
	const fieldsInput = this.getNodeParameter('fields', index) as string;
	const options = this.getNodeParameter('options', index) as IDataObject;

	// Parse fields - can be comma-separated or JSON array
	let fields: string[];
	try {
		fields = JSON.parse(fieldsInput);
	} catch {
		fields = fieldsInput.split(',').map((f) => f.trim());
	}

	const qs: IDataObject = {
		format: options.format || 'JSON',
	};

	if (options.onlyCurrent !== undefined) {
		qs.onlyCurrent = options.onlyCurrent ? 'true' : 'false';
	}

	// Build filters if provided
	let filters: IDataObject | undefined;
	if (options.lastChanged) {
		filters = {
			lastChanged: {
				includeNull: 'no',
				value: options.lastChanged,
			},
		};
	}

	const body = buildCustomReportPayload(title, fields, filters);

	const response = await bambooHrApiRequest.call(
		this,
		'POST',
		'/reports/custom',
		body,
		qs,
	);

	const result = response as IDataObject;
	const employees = result.employees as IDataObject[] || [];

	if (employees.length > 0) {
		return employees.map((employee) => ({ json: employee }));
	}

	return [{ json: result }];
}
