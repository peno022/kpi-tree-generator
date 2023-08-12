function toSnakeCase(string: string): string {
  return string.replace(/([A-Z])/g, "_$1").toLowerCase();
}

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
