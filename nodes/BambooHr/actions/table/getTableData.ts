/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function getTableData(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;
	const tableId = this.getNodeParameter('tableId', index) as string;

	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		`/employees/${employeeId}/tables/${tableId}`,
	);

	const rows = response as IDataObject[];

	return rows.map((row) => ({
		json: {
			employeeId,
			tableId,
			...row,
		},
	}));
}
