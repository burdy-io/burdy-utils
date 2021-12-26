import { Key, pathToRegexp } from 'path-to-regexp';
import deepcopy from 'deepcopy';
import { Rewrites, RewritesMap, RewritesReturn } from '../types';

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

export const matchAndRewrite = (path: string, map: Rewrites[]): string => {
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

  return rewrite(rule?.rewrite || '', params);
};

export const matchAndRewriteMap = <T>(path: string, map: RewritesMap<T>[] = [], baseUrl = ''): RewritesReturn<T> => {
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
    return Object.keys(map).reduce(
      (previousValue, currentValue) => ({
        ...previousValue,
        [currentValue]: null,
      }),
      {}
    ) as RewritesReturn<T>;
  }

  const params: Record<Key['name'], string | undefined> = {};

  keys.forEach((key, index) => {
    params[key.name] = resultArray?.[index + 1];
  });

  Object.keys(rule.rewrites || {}).forEach((key) => {
    rule.rewrites = {
      ...(rule.rewrites || {}),
      [key]: baseUrl.replace(/\/$/i, '') + rewrite((rule.rewrites as any)?.[key] as string, params),
    } as any;
  });

  return rule.rewrites;
};
