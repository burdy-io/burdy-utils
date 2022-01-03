export * from './model';

export type Rewrites = {
  source: string;
  rewrite: string;
};

export type RewriteDestination<T> = T extends string ?
  string | null :
  { [key in keyof T]: string | null }

export type RewritesMap<T extends {} | string> = {
  source: string;
  destination: RewriteDestination<T>;
};

export type RewriteOptions<T extends {} | string> = {
  origin?: string;
  rewrite: RewritesMap<T>[];
}

export type RewritesObject<T extends {} | string> = {
  rewrite: (path: string) => string | null | T;
  getOrigin: () => string | undefined;
  getRewrite: () => RewritesMap<T>[];
}
