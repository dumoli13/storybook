import path from 'path';

const lintFix = (filenames) =>
  `yarn lint:fix ${filenames
    .filter((f) => !f.includes('make-executable.js'))
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`;

const prettierWrite = (filenames) =>
  `yarn prettier --config ./.prettierrc.json --ignore-unknown --write ${filenames
    .filter((f) => !f.includes('make-executable.js'))
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`;

export default {
  '**/*.ts?(x)': () => 'yarn type:check',
  '*.{js,jsx,ts,tsx}': lintFix,
  '**/*': prettierWrite,
};
