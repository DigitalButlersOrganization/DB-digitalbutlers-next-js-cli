const ROOT_ALIAS = 'root'; // TODO: move to constants somehow

module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['airbnb-base', 'plugin:unicorn/recommended', 'prettier'],
	plugins: ['prettier'],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	ignorePatterns: ['dist/**/*.*'],
	rules: {
		'prettier/prettier': [1],
		'no-restricted-imports': [
			2,
			{
				patterns: [`${ROOT_ALIAS}/*/*`, '../*'],
			},
		],
		'no-param-reassign': [
			2,
			{
				props: true,
				ignorePropertyModificationsForRegex: ['.*(Element|Node)$'],
			},
		],
		'no-implicit-coercion': [
			2,
			{
				boolean: true,
				number: true,
				string: true,
				disallowTemplateShorthand: true,
				allow: [],
			},
		],
		'import/order': [
			'error',
			{
				'newlines-between': 'always',
				alphabetize: {
					order: 'asc',
					caseInsensitive: true,
				},
				pathGroups: [
					{
						pattern: `${ROOT_ALIAS}/**/*`,
						group: 'parent',
					},
					{
						pattern: './*',
						group: 'sibling',
					},
				],
			},
		],
		'import/no-unresolved': [2, { ignore: ['\\.?inline$'] }],
		'import/prefer-default-export': 0,
		'unicorn/no-for-loop': 0,
		'unicorn/no-array-for-each': 0,
		'unicorn/explicit-length-check': 0,
	},
	settings: {
		'import/resolver': {
			alias: {
				map: [[ROOT_ALIAS, './src/']],
			},
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		},
	},
};
