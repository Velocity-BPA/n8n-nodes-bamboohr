/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BambooHrApi implements ICredentialType {
	name = 'bambooHrApi';
	displayName = 'BambooHR API';
	documentationUrl = 'https://documentation.bamboohr.com/reference';
	properties: INodeProperties[] = [
		{
			displayName: 'Company Domain',
			name: 'companyDomain',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'yourcompany',
			description: 'Your BambooHR subdomain (e.g., "yourcompany" from yourcompany.bamboohr.com)',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API key from BambooHR Settings > API Keys',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.apiKey}}',
				password: 'x',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://api.bamboohr.com/api/gateway.php/{{$credentials.companyDomain}}/v1',
			url: '/employees/directory',
			headers: {
				Accept: 'application/json',
			},
		},
	};
}
