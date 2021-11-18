export * from './model';

export type Rewrites<T extends {}> = {
  source: string;
  rewrites: {
    [key in keyof T]: string;
  }
};

export type RewriteOptions<T extends {}> = {
  origin?: string;
  rewriteMap: Rewrites<T>[];
}

export type RewritesReturn<T> = {
  [key in keyof T]: string;
}

export type RewritesObject<T extends {}> = {
  rewrite: (path: string) => RewritesReturn<T>;
  getOrigin: () => string | undefined;
  getRewriteMap: () => Rewrites<T>[];
}
