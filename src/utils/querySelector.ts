export const querySelector = (
  payload: string,
  count: number = 0,
  timeout: number = 100
): Promise<Element> => {
  let element = document.querySelector(payload);
  if (element) {
    return Promise.resolve(element);
  } else if (count > 0) {
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        element = document.querySelector(payload);
        if (element) {
          resolve(element);
          window.clearInterval(timer);
        } else if (--count <= 0) {
          reject();
          window.clearInterval(timer);
        }
      }, timeout);
    });
  } else {
    return Promise.reject();
  }
};

export default querySelector;
