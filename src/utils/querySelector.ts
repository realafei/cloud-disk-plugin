import { isBoolean, isUndefined } from "@/utils/is";

function querySelector(selectors: string): Element | null;
function querySelector(
  selectors: string,
  isPromise: boolean | number,
  timeout?: number
): Promise<Element>;
function querySelector(
  selectors: string,
  isPromise?: boolean | number,
  timeout: number = 100
): Promise<Element> | Element | null {
  let element = document.querySelector(selectors);
  if (isUndefined(isPromise)) {
    return element;
  } else if (isBoolean(isPromise)) {
    if (isPromise) {
      return element
        ? Promise.resolve(element)
        : Promise.reject(selectors + " is not found");
    }
    return element;
  } else if (element) {
    return Promise.resolve(element);
  } else if (isPromise > 0) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        element = document.querySelector(selectors);
        if (element) {
          resolve(element);
          clearInterval(timer);
        } else if (--(isPromise as number) <= 0) {
          reject(selectors + " is not found");
          clearInterval(timer);
        }
      }, timeout);
    });
  } else {
    return Promise.reject(selectors + " is not found");
  };
}

export default querySelector;
