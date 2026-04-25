import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

import { rateOperations, rateFields } from './descriptions/RateDescription';
import { conversionOperations, conversionFields } from './descriptions/ConversionDescription';
import { currencyOperations, currencyFields } from './descriptions/CurrencyDescription';
import { historicalOperations, historicalFields } from './descriptions/HistoricalDescription';
import { vatOperations, vatFields } from './descriptions/VatDescription';

export class UniRate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'UniRate',
		name: 'uniRate',
		icon: { light: 'file:../../icons/unirate.svg', dark: 'file:../../icons/unirate.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Currency exchange rates, conversion, historical data, time series, and VAT rates from the UniRate API',
		defaults: {
			name: 'UniRate',
		},
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'uniRateApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.unirateapi.com',
			headers: {
				Accept: 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Conversion', value: 'conversion' },
					{ name: 'Currency', value: 'currency' },
					{ name: 'Historical', value: 'historical' },
					{ name: 'Rate', value: 'rate' },
					{ name: 'VAT', value: 'vat' },
				],
				default: 'rate',
			},
			...rateOperations,
			...rateFields,
			...conversionOperations,
			...conversionFields,
			...currencyOperations,
			...currencyFields,
			...historicalOperations,
			...historicalFields,
			...vatOperations,
			...vatFields,
		],
	};
}
