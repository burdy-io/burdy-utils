import { RewriteOptions, RewritesObject } from '../types';
import { matchAndRewrite, matchAndRewriteMap } from './build-path';

export const createRewrites = <T extends {}>(options: RewriteOptions<T>): RewritesObject<T> => ({
  getOrigin: () => options?.origin || '',
  getRewriteMap: () => options.rewriteMap,
  getRewrite: () => options.rewrite,
  rewrite: (path: string) => matchAndRewrite(path, options.rewrite),
  rewriteMap: (path: string) => matchAndRewriteMap(path, options.rewriteMap, options?.origin || '')
});
