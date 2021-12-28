import { Key, pathToRegexp } from 'path-to-regexp';
import deepcopy from 'deepcopy';
import { RewriteDestination, RewritesMap } from '../types';

const RESERVED_KEY = '$__path';

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

const normalizeRewritesMap = <T>(rewrites: RewritesMap<T>[]): RewritesMap<T>[] =>
  rewrites.map<RewritesMap<any>>(rewrite => ({
    ...rewrite,
    destination: typeof rewrite.destination === 'string' ?
      { [RESERVED_KEY]: rewrite.destination } :
      rewrite.destination
  }));

const normalizeDestination = <T>(destination: RewriteDestination<T>): RewriteDestination<T> =>
  Object.keys(destination).length === 1 && destination?.[RESERVED_KEY] ?
    destination[RESERVED_KEY] :
    destination

export const matchAndRewriteMap = <T>(path: string, map: RewritesMap<T>[] = [], baseUrl = ''): RewriteDestination<T> => {
  let resultArray: RegExpExecArray | null;
  let keys: Key[] = [];
  map = deepcopy(map);
  map = normalizeRewritesMap(map);

  const rule = map.find((rule) => {
    keys = [];
    const regexp = pathToRegexp(rule.source, keys);
    resultArray = regexp.exec(path);
    return !!resultArray;
  });

  if (!rule) {
    const firstDestination = normalizeDestination(map?.[0]?.destination || '' as any);
    return typeof firstDestination === 'string' ?
      null :
      Object.keys(firstDestination).reduce(
        (previousValue, currentValue) => ({
          ...previousValue,
          [currentValue]: null
        }), {}
      ) as any;
  }

  const params: Record<Key['name'], string | undefined> = {};

  keys.forEach((key, index) => {
    params[key.name] = resultArray?.[index + 1];
  });

  Object.keys(rule.destination || {}).forEach((key) => {
    rule.destination[key] = baseUrl.replace(/\/$/i, '') + rewrite((rule.destination as any)?.[key] as string, params);
  });

  return normalizeDestination(rule.destination);
};
