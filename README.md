# n8n-nodes-unirate

This is an [n8n](https://n8n.io) community node. It lets you use the
[UniRate API](https://unirateapi.com) in your n8n workflows for currency
exchange rates, conversion, historical data, time series, and VAT rates.

UniRate offers free real-time and historical exchange rates for 170+
currencies — no credit card needed for the free tier.

[n8n](https://n8n.io) is a [fair-code licensed](https://docs.n8n.io/reference/license/)
workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[UniRate Node](#unirate-node)
[UniRate Trigger Node](#unirate-trigger-node)
[Compatibility](#compatibility)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/)
in the n8n community-nodes documentation.

In a self-hosted n8n instance:

1. Go to **Settings → Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-unirate` and confirm.

The package is also available on
[npm](https://www.npmjs.com/package/n8n-nodes-unirate).

## Credentials

You need a UniRate API key. The free tier covers latest rates,
conversion, the supported-currency list, and VAT rates. The Pro tier
adds historical rates and time series.

1. Sign up at [unirateapi.com](https://unirateapi.com).
2. Copy your API key from the dashboard.
3. In n8n, create a new credential of type **UniRate API** and paste the key.

The credential is sent as the `api_key` query parameter on every request.
The credential test calls `GET /api/currencies` to confirm the key.

## Operations

The package ships two nodes:

- **UniRate** — action node for one-shot lookups and conversions.
- **UniRate Trigger** — polling trigger that fires when a tracked
  currency pair's rate changes.

### UniRate Node

Resources and operations:

| Resource | Operation | Endpoint |
|---|---|---|
| Rate | Get | `GET /api/rates?from&to` |
| Rate | Get Many | `GET /api/rates?from` |
| Conversion | Convert | `GET /api/convert?from&to&amount` |
| Conversion | Convert Historical *(Pro)* | `GET /api/historical/rates?from&to&amount&date` |
| Currency | Get Many | `GET /api/currencies` |
| Historical *(Pro)* | Get Rate | `GET /api/historical/rates?date&from&to` |
| Historical *(Pro)* | Get Time Series | `GET /api/historical/timeseries?start_date&end_date&base&currencies` |
| Historical *(Pro)* | Get Limits | `GET /api/historical/limits` |
| VAT | Get | `GET /api/vat/rates?country` |
| VAT | Get Many | `GET /api/vat/rates` |

Pro endpoints return HTTP 403 on a free-tier key.

### UniRate Trigger Node

Polls the UniRate API on the schedule you configure (n8n's standard
trigger-schedule controls) and emits an event when the rate for a
tracked pair changes.

Trigger modes:

- **On Any Change** — fire when the rate differs from the previous poll.
- **On Threshold Crossed** — fire only when the percent change is at
  least the configured threshold (e.g. `0.5` = 0.5 %).
- **On Every Poll** — emit on every poll, even if the rate is unchanged.

Event payload:

```json
{
  "from": "USD",
  "to": "EUR",
  "rate": 0.9214,
  "previousRate": 0.9180,
  "absoluteChange": 0.0034,
  "percentChange": 0.3704,
  "timestamp": "2026-04-25T08:30:00.000Z"
}
```

`previousRate`, `absoluteChange`, and `percentChange` are `null` on the
first poll.

## Example workflows

**Convert an amount in a webhook:**

1. *Webhook* → receives `{ "amount": 100, "currency": "USD" }`.
2. *UniRate (Conversion → Convert)* → `from = {{$json.currency}}`,
   `to = "EUR"`, `amount = {{$json.amount}}`.
3. *Respond to Webhook* → `{ "amount_eur": {{$json.result}} }`.

**Alert on FX moves:**

1. *UniRate Trigger* → `from = USD`, `to = EUR`,
   trigger mode `On Threshold Crossed`, threshold `0.5`,
   poll interval `Every 15 minutes`.
2. *Slack* → post `"USD/EUR moved {{$json.percentChange}}% to {{$json.rate}}"`.

**Daily VAT-rate snapshot:**

1. *Schedule Trigger* → `0 6 * * *`.
2. *UniRate (VAT → Get Many)*.
3. *Spreadsheet File* → save to a dated CSV.

## Compatibility

- Tested on n8n `1.x`.
- Requires Node.js `>= 20.15`.

## Resources

- [n8n community-nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [UniRate API reference](https://unirateapi.com)
- [Source on GitHub](https://github.com/UniRate-API/n8n-nodes-unirate)
- [Issue tracker](https://github.com/UniRate-API/n8n-nodes-unirate/issues)

## Related

UniRate ships official client libraries for nine languages — Python, Node,
Swift, Java, Go, Rust, Ruby, PHP, and .NET. See the
[UniRate-API GitHub organisation](https://github.com/UniRate-API).

## Version history

### 0.1.0 (2026-04-25)

- Initial release.
- UniRate node: Rate, Conversion, Currency, Historical, VAT resources.
- UniRate Trigger: polling trigger with any-change / threshold modes.

## License

[MIT](LICENSE.md)
