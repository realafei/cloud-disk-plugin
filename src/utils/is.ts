export const is = <T = any>(val: unknown, type: string): val is T =>
  Object.prototype.toString.call(val) === `[object ${type}]`;

// export const isSet = (val: unknown): val is Set<any> => is<Set<any>>(val, "Set");

// export const isMap = (val: unknown): val is Map<any, any> => is<Map<any, any>>(val, "Map");

// export const isDate = (val: unknown): val is Date => is<Date>(val, "Date");

// export const isArray = (val: unknown): val is Array<any> => is<Array<any>>(val, "Array");

export const isString = (val: unknown): val is string =>
  is<string>(val, "String");

// export const isNumber = (val: unknown): val is number => is<number>(val, "Number");

// export const isWindow = (val: unknown): val is Window => is<Window>(val, "Window");

// export const isRegExp = (val: unknown): val is RegExp => is<RegExp>(val, "RegExp");

// export const isObject = (val: any): val is Record<any, any> => is<Record<any, any>>(val, "Object");

// export const isBoolean = (val: unknown): val is boolean => is<boolean>(val, "Boolean");

// export const isPromise = (val: unknown): val is Promise<any> => is<Promise<any>>(val, "Promise");

// export const isFunction = (val: unknown): val is Function => is<Function>(val, "Function");

export const isNull = (val: unknown): val is null => val === null;

export const isUndefined = (val: unknown): val is undefined =>
  val === undefined;

export const isVoid = (val: unknown): val is null | undefined =>
  isNull(val) || isUndefined(val);

export const isEmpty = (val: unknown): val is null | undefined | "" =>
  isVoid(val) || val === "";

// export const isEmptyValue = (val: unknown): boolean => {
//   if (isArray(val) || isString(val)) {
//     return val.length === 0;
//   } else if (isObject(val)) {
//     return Object.keys(val).length === 0;
//   } else if (isSet(val) || isMap(val)) {
//     return val.size === 0;
//   }
//   return false;
// };

// export const isMobile = (): boolean =>
//   !navigator.userAgent.match(
//     /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
//   );

// export const isImage = (url: string): boolean =>
//   url ? /.+\.(jpeg|jpg|png|gif)$/i.test(url.toLocaleLowerCase()) : false;

// export const isDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

// export const isLight = () => window.matchMedia("(prefers-color-scheme: light)").matches;
