// A function, so tsc checks the whole project with its tsconfig instead of only the staged files.
export default { "*.{ts,tsx}": () => "npm run typecheck" };
