import bnStrings from '@/strings/bn.json';

type StringsType = typeof bnStrings;

export function t<K extends keyof StringsType>(section: K): StringsType[K] {
  return bnStrings[section];
}

export function formatString(template: string, values: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  return result;
}

export default bnStrings;
