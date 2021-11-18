import { RewriteOptions, RewritesObject } from '../types';
import { buildPath } from './build-path';

export const createRewrites = <T extends {}>(options: RewriteOptions<T>): RewritesObject<T> => ({
  getOrigin: () => options?.origin || '',
  getRewriteMap: () => options.rewriteMap,
  rewrite: (path: string) => buildPath(path, options.rewriteMap, options?.origin || ''),
});
