export default function cssToObj(css?: string) {
  const o: { [key: string]: string } = {}
  if (css !== undefined) {
    css
      .split(';')
      .filter(el => !!el)
      .map(el => {
        const s = el.split(':')
        o[s.shift().trim()] = s.join(':').trim()
      })
  }
  return o
}
