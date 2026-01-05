/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function deleteTableRow(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const tableId = this.getNodeParameter('tableId', index) as string;
	const rowId = this.getNodeParameter('rowId', index) as string;

	await bambooHrApiRequest.call(
		this,
		'DELETE',
		`/employees/${employeeId}/tables/${tableId}/${rowId}`,
	);

	return [{
		json: {
			success: true,
			employeeId,
			tableId,
			rowId,
			message: 'Table row deleted successfully',
		},
	}];
}
