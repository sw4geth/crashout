// Empty fs module for browser environments
export default {
  readFileSync: () => null,
  writeFileSync: () => null,
  readFile: () => null,
  writeFile: () => null,
  existsSync: () => false,
  stat: () => ({}),
  statSync: () => ({}),
};