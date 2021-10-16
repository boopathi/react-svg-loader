export function hyphenToCamel(name: string) {
  return name.replace(/-([a-z])/g, g => g[1].toUpperCase())
}

export function namespaceToCamel(namespace: string, name: string) {
  return namespace + name.charAt(0).toUpperCase() + name.slice(1)
}
