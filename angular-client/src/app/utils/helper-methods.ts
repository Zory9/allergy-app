export function stringsToArray(str: string): string[] {
  return str
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');
}

export function arrayToString(arr: string[]): string {
  return arr.join(', ');
}
