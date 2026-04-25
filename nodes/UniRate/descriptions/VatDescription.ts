import type { INodeProperties } from 'n8n-workflow';

const showOnlyForVat = {
	resource: ['vat'],
};

export const vatOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForVat },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get the VAT rate for a country',
				description: 'Get the VAT rate for a single country by ISO-3166 alpha-2 code',
				routing: {
					request: {
						method: 'GET',
						url: '/api/vat/rates',
						qs: {
							country: '={{$parameter.country.toString().toUpperCase()}}',
						},
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get VAT rates for all countries',
				description: 'Get the latest VAT rates for every supported country',
				routing: {
					request: {
						method: 'GET',
						url: '/api/vat/rates',
					},
				},
			},
		],
		default: 'get',
	},
];

export const vatFields: INodeProperties[] = [
	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		default: 'DE',
		required: true,
		placeholder: 'DE',
		description: 'Two-letter ISO-3166 alpha-2 country code (e.g. DE, FR, GB)',
		displayOptions: {
			show: {
				resource: ['vat'],
				operation: ['get'],
			},
		},
	},
];
