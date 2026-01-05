/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { bambooHrApiRequest } from '../../transport';

export async function getBenefitDeductions(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const employeeId = this.getNodeParameter('employeeId', index) as string;

	const response = await bambooHrApiRequest.call(
		this,
		'GET',
		`/employees/${employeeId}/deductions`,
	);

	const deductions = response as IDataObject[];

	return deductions.map((deduction) => ({
		json: {
			employeeId,
			...deduction,
		},
	}));
}
