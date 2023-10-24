function toSnakeCase(string: string): string {
  return string.replace(/([A-Z])/g, "_$1").toLowerCase();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function keysToSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => keysToSnakeCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [toSnakeCase(key)]: keysToSnakeCase(obj[key]),
      }),
      {}
    );
  }
  return obj;
}
