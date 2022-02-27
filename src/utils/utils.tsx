import { isEqual } from "lodash";

export function distanceBetweenPoints([x1, y1, z1], [x2, y2, z2]) {
  return Math.sqrt(
    Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
  );
}
/** remove adjacent repeats in a repetitive array */
export function dedupeRepetitiveArray(arr: any[]) {
  return arr.reduce((acc, cur) => {
    const last = acc[acc.length - 1];
    if (!isEqual(last, cur)) {
      acc.push(cur);
    }
    return acc;
  }, []);
}
