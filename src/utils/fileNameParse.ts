const regexp = /^((.|\n)+)\.([^.]+)$/;

export const fileNameParse = (
  payload: string
): { ext: string; fileName: string } => {
  const matchResult = payload.match(regexp);
  return {
    ext: matchResult?.[3] || "",
    fileName: matchResult?.[1] || payload,
  };
};

export const getFileName = (payload: string): string => {
  return payload.match(regexp)?.[1] || payload;
};

export const getExt = (payload: string): string => {
  return payload.match(regexp)?.[3] || "";
};

export default fileNameParse;
