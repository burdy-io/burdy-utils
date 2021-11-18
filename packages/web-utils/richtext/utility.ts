/**
 * Utility function to execute callback for each key->value pair.
 */
export const forEach = (obj: Record<string, any>, callback: (key: string, value: any) => void) => {
  if (obj) {
    for (const key in obj) {
      if ({}.hasOwnProperty.call(obj, key)) {
        callback(key, obj[key]);
      }
    }
  }
};

/**
 * The function returns true if the string passed to it has no content.
 */
export const isEmptyString = (str: string) => {
  if (str === undefined || str === null || str.length === 0 || str.trim().length === 0) {
    return true;
  }
  return false;
};
