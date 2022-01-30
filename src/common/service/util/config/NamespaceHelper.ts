
/** Small utility for appending and removing separator (".") separated parts. */

export const SEPARATOR = '.';

export const NamespaceHelper = {
  appendPart,
  removePart,
  splitParts,
  joinParts,
};

export function appendPart(part: string, base: string): string {
  // if any of params is empty return the second one
  if (!base) {
    return part;
  }
  if (!part) {
    return base;
  }

  return base + SEPARATOR + part;
}

export function removePart(base: string, count: number = 1): string {
  let newBase = base;
  for (let i = 0; i < count; i++) {
    if (newBase.length === 0) {
      break;
    }

    const lastSeparatorIndex = newBase.lastIndexOf('.');

    newBase = newBase.substring(0, lastSeparatorIndex >= 0 ? lastSeparatorIndex : 0);
  }

  return newBase;
}

export function splitParts(name: string): string[] {
  return name.split(SEPARATOR);
}

export function joinParts(name: string[]): string {
  return name.join(SEPARATOR);
}
