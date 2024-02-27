const regexp = /^(.+)\.([^.]+)$/;

export const fileNameParse = (
  payload: string
): { ext: string; fileName: string } => {
  const matchResult = payload.match(regexp);
  return {
    ext: matchResult?.[2] || "",
    fileName: matchResult?.[1] || payload,
  };
};

export const getFileName = (payload: string): string => {
  return payload.match(regexp)?.[0] || payload;
};

export const getExt = (payload: string): string => {
  return payload.match(regexp)?.[1] || "";
};

export default fileNameParse;
