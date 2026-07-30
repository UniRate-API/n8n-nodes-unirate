/**
 * Lint configuration aligned with eslint-plugin-n8n-nodes-base, the rule set
 * the n8n team applies during the verified-publisher review.
 */
module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['./tsconfig.json'],
		sourceType: 'module',
		extraFileExtensions: ['.json'],
	},
	ignorePatterns: ['.eslintrc.js', '**/*.js', 'node_modules/**', 'dist/**'],
	overrides: [
		{
			files: ['package.json'],
			parserOptions: { project: null },
			plugins: ['eslint-plugin-n8n-nodes-base'],
			extends: ['plugin:n8n-nodes-base/community'],
			rules: {
				'n8n-nodes-base/community-package-json-name-still-default': 'off',
			},
		},
		{
			files: ['./credentials/**/*.ts'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			extends: ['plugin:n8n-nodes-base/credentials'],
			rules: {
				// "Only applicable to nodes in the main repository." — disable for community packages.
				'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',
			},
		},
		{
			files: ['./nodes/**/*.ts'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			extends: ['plugin:n8n-nodes-base/nodes'],
			rules: {
				// These three rules require the string literal `['main']`, but the
				// current verification scanner (@n8n/scan-community-package, which
				// runs @n8n/eslint-plugin-community-nodes) requires the opposite —
				// `NodeConnectionTypes.Main` — via `node-connection-type-literal`.
				// The two plugins directly contradict each other; the scanner is what
				// gates verification, so it wins and these stale rules are disabled.
				'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'off',
				'n8n-nodes-base/node-class-description-outputs-wrong': 'off',
			},
		},
	],
};
