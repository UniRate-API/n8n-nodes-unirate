import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class UniRateApi implements ICredentialType {
	name = 'uniRateApi';

	displayName = 'UniRate API';

	icon: Icon = { light: 'file:../icons/unirate.svg', dark: 'file:../icons/unirate.dark.svg' };

	documentationUrl = 'https://github.com/UniRate-API/n8n-nodes-unirate#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'API key from <a href="https://unirateapi.com">unirateapi.com</a>. The free tier covers latest rates, conversion, currency list, and VAT rates; historical and time-series endpoints require a Pro key.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				api_key: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.unirateapi.com',
			url: '/api/currencies',
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		},
	};
}
