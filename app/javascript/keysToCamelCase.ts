function toCamelCase(string: string): string {
  return string.replace(/_([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

export default function keysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => keysToCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [toCamelCase(key)]: keysToCamelCase(obj[key]),
      }),
      {}
    );
  }
  return obj;
}
