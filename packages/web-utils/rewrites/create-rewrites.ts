import { RewriteOptions, RewritesObject } from '../types';
import { matchAndRewriteMap } from './build-path';

export const createRewrites = <T extends {} | string>(options: RewriteOptions<T>): RewritesObject<T> => ({
  getOrigin: () => options?.origin || '',
  getRewrite: () => options?.rewrite || [],
  rewrite: (path: string) => matchAndRewriteMap(path, options.rewrite, options?.origin || '')
});
