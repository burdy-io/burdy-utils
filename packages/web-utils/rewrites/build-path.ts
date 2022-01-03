import { Key, pathToRegexp } from 'path-to-regexp';
import deepcopy from 'deepcopy';
import { RewriteDestination, RewritesMap } from '../types';

const escapeRegExp = (str: string) => {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
};

export const rewrite = (string: string, params: Record<Key['name'], string | undefined> = {}) => {
  let tmpString = string;
  Object.keys(params).forEach((key) => {
    tmpString = tmpString.replace(new RegExp(escapeRegExp(`{${key}}`), 'g'), params[key] || '');
  });
  return tmpString;
};

export const matchAndRewriteMap = <T = any>(path: string, map: RewritesMap<T>[] = [], baseUrl = ''): T | string | null => {
  let resultArray: RegExpExecArray | null;
  let keys: Key[] = [];
  map = deepcopy(map);

  const rule = map.find((rule) => {
    keys = [];
    const regexp = pathToRegexp(rule.source, keys);
    resultArray = regexp.exec(path);
    return !!resultArray;
  });

  if (!rule) {
    return null;
  }

  const params: Record<Key['name'], string | undefined> = {};
  keys.forEach((key, index) => {
    params[key.name] = resultArray?.[index + 1];
  });

  if (typeof rule?.destination === 'string') {
    return baseUrl.replace(/\/$/i, '') + rewrite(rule?.destination || '', params);
  }

  if (typeof rule?.destination === 'object') {
    let destination = {};
    Object.keys(rule.destination || {}).forEach((key) => {
      destination = {
        ...destination,
        [key]: baseUrl.replace(/\/$/i, '') + rewrite((rule.destination as any)?.[key] as string, params)
      }
    });
    return destination as T;
  }
  return null;
};
