export default function hyphenToCamel(name) {
  return name.replace(/-([a-z])/g, g => g[1].toUpperCase());
}
