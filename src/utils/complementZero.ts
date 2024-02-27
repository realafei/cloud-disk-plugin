import { isString } from "@/utils/is";

// 补零
export const complementZero = (payload: number | string): string => {
  if (isString(payload)) {
    payload = parseInt(payload);
    if (isNaN(payload)) {
      return "";
    }
  }
  return (payload < 10 ? "0" : "") + payload;
};

export default complementZero;
