/* eslint-disable max-len */
const defaultPasswordStrengthRules = [
	{
		pattern: /((?=.*[0-9])(?=.*[A-Z])(?=.*[!@#\$%\^&*\)\(+=._-]).+).{5,}|((?=.*[0-9])|(?=.*[A-Z])|(?=.*[!@#\$%\^&*\)\(+=._-])).{8,}|.{11,}/,
		score: 1,
	},
	{
		pattern: /((?=.*[0-9])(?=.*[A-Z])(?=.*[!@#\$%\^&*\)\(+=._-]).+).{7,}|((?=.*[0-9])|(?=.*[A-Z])|(?=.*[!@#\$%\^&*\)\(+=._-])).{10,}|.{16,}/,
		score: 1,
	},
];

const defaultPasswordStrengthMessages = [
	{
		minScore: 0,
		blissModifiers: 'weak',
		text: 'Weak',
	},
	{
		minScore: 1,
		blissModifiers: 'medium',
		text: 'Medium',
	},
	{
		minScore: 2,
		blissModifiers: 'strong',
		text: 'Strong',
	},
];

export {
	defaultPasswordStrengthRules,
	defaultPasswordStrengthMessages,
};
