import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BambooHRApi implements ICredentialType {
	name = 'bambooHRApi';
	displayName = 'BambooHR API';
	documentationUrl = 'https://documentation.bamboohr.com/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'Company Domain',
			name: 'companyDomain',
			type: 'string',
			default: '',
			required: true,
			description: 'Your BambooHR company domain (subdomain). For example, if your BambooHR URL is "mycompany.bamboohr.com", enter "mycompany".',
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
			description: 'BambooHR API key. Generate this from your BambooHR account settings under API Keys.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.bamboohr.com/api/gateway.php',
			required: true,
			description: 'Base URL for BambooHR API',
		},
	];
}