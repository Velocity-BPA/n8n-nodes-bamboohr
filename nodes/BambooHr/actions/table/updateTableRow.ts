/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function updateTableRow(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const tableId = this.getNodeParameter('tableId', index) as string;
	const rowId = this.getNodeParameter('rowId', index) as string;
	const rowDataInput = this.getNodeParameter('rowData', index) as string;

	// Parse row data - should be JSON object
	let rowData: IDataObject;
	try {
		rowData = JSON.parse(rowDataInput);
	} catch {
		throw new Error('Row data must be valid JSON');
	}

	const response = await bambooHrApiRequest.call(
		this,
		'POST',
		`/employees/${employeeId}/tables/${tableId}/${rowId}`,
		rowData,
	);

	return [{
		json: {
			success: true,
			employeeId,
			tableId,
			rowId,
			...(response as IDataObject || {}),
		},
	}];
}
