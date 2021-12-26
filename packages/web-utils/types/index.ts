export * from './model';

export type Rewrites = {
  source: string;
  rewrite: string;
};

export type RewritesMap<T extends {}> = {
  source: string;
  rewrites: {
    [key in keyof T]: string;
  }
};

export type RewriteOptions<T extends {}> = {
  origin?: string;
  rewrite?: Rewrites[];
  rewriteMap?: RewritesMap<T>[];
}

export type RewritesReturn<T> = {
  [key in keyof T]: string;
}

export type RewritesObject<T extends {}> = {
  rewriteMap: (path: string) => RewritesReturn<T>;
  rewrite: (path: string) => string | undefined;
  getOrigin: () => string | undefined;
  getRewrite: () => Rewrites[];
  getRewriteMap: () => RewritesMap<T>[];
}
