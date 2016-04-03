export function hyphenToCamel(name) {
  return name.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

export function namespaceToCamel(namespace, name) {
  return namespace + name.charAt(0).toUpperCase() + name.slice(1);
}
