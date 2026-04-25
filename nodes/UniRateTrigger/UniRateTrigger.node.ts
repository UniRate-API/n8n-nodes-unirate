import type {
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
	INodeExecutionData,
} from 'n8n-workflow';

interface RateResponse {
	rate?: string | number;
}

interface PollState {
	lastRate?: number;
	lastTimestamp?: string;
}

export class UniRateTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'UniRate Trigger',
		name: 'uniRateTrigger',
		icon: { light: 'file:../../icons/unirate.svg', dark: 'file:../../icons/unirate.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["from"] + " → " + $parameter["to"]}}',
		description: 'Fires when an exchange rate changes — optionally above a threshold',
		defaults: {
			name: 'UniRate Trigger',
		},
		polling: true,
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'uniRateApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'From Currency',
				name: 'from',
				type: 'string',
				default: 'USD',
				required: true,
				placeholder: 'USD',
				description: 'Three-letter ISO 4217 base currency code',
			},
			{
				displayName: 'To Currency',
				name: 'to',
				type: 'string',
				default: 'EUR',
				required: true,
				placeholder: 'EUR',
				description: 'Three-letter ISO 4217 target currency code',
			},
			{
				displayName: 'Trigger Mode',
				name: 'triggerMode',
				type: 'options',
				default: 'changeAny',
				options: [
					{
						name: 'On Any Change',
						value: 'changeAny',
						description: 'Fire whenever the rate differs from the previous poll',
					},
					{
						name: 'On Threshold Crossed',
						value: 'changeThreshold',
						description: 'Fire only when the percent change exceeds the threshold',
					},
					{
						name: 'On Every Poll',
						value: 'always',
						description: 'Emit the latest rate on every poll, even if unchanged',
					},
				],
			},
			{
				displayName: 'Threshold (%)',
				name: 'threshold',
				type: 'number',
				default: 0.5,
				typeOptions: {
					minValue: 0,
					numberPrecision: 4,
				},
				description: 'Percent change (absolute) required to fire',
				displayOptions: {
					show: {
						triggerMode: ['changeThreshold'],
					},
				},
			},
			{
				displayName: 'Emit On First Poll',
				name: 'emitOnFirstPoll',
				type: 'boolean',
				default: true,
				description: 'Whether to emit a starting event on the first run so downstream nodes get a baseline',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const from = (this.getNodeParameter('from') as string).toUpperCase();
		const to = (this.getNodeParameter('to') as string).toUpperCase();
		const triggerMode = this.getNodeParameter('triggerMode') as
			| 'changeAny'
			| 'changeThreshold'
			| 'always';
		const threshold = this.getNodeParameter('threshold', 0) as number;
		const emitOnFirstPoll = this.getNodeParameter('emitOnFirstPoll', true) as boolean;

		const response = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'uniRateApi',
			{
				method: 'GET',
				url: 'https://api.unirateapi.com/api/rates',
				qs: { from, to },
				headers: { Accept: 'application/json' },
				json: true,
			},
		)) as RateResponse;

		if (response.rate === undefined || response.rate === null) {
			return null;
		}

		const currentRate =
			typeof response.rate === 'number' ? response.rate : parseFloat(String(response.rate));

		if (!Number.isFinite(currentRate)) {
			return null;
		}

		const staticData = this.getWorkflowStaticData('node') as PollState;
		const previousRate = staticData.lastRate;
		const isFirstPoll = previousRate === undefined;

		let shouldEmit = false;
		let percentChange = 0;
		let absoluteChange = 0;

		if (isFirstPoll) {
			shouldEmit = emitOnFirstPoll;
		} else {
			absoluteChange = currentRate - previousRate!;
			percentChange = previousRate! === 0 ? 0 : (absoluteChange / previousRate!) * 100;
			if (triggerMode === 'always') {
				shouldEmit = true;
			} else if (triggerMode === 'changeAny') {
				shouldEmit = currentRate !== previousRate;
			} else {
				shouldEmit = Math.abs(percentChange) >= threshold;
			}
		}

		const timestamp = new Date().toISOString();
		staticData.lastRate = currentRate;
		staticData.lastTimestamp = timestamp;

		if (!shouldEmit) {
			return null;
		}

		const item: INodeExecutionData = {
			json: {
				from,
				to,
				rate: currentRate,
				previousRate: isFirstPoll ? null : previousRate,
				absoluteChange: isFirstPoll ? null : absoluteChange,
				percentChange: isFirstPoll ? null : percentChange,
				timestamp,
			},
		};

		return [[item]];
	}
}
