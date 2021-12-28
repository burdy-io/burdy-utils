export type IBurdyAuthor = {
  firstName?: string;
  lastName?: string;
}

export type IBurdyContentType = {
  name: string;
  type: string;
  fields?: any[];
}

export interface IBurdyPage<T extends {} = any> {
  id: number;
  name: string;
  type: string;
  slug: string;
  slugPath: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  publishedFrom?: Date;
  publishedUntil?: Date;
  status?: string;
  parent?: IBurdyPage;
  contentType?: IBurdyContentType;
  author?: IBurdyAuthor;
  meta?: {
    content: T;
  } & any;
  tags?: IBurdyTag[];
}

export interface IBurdyTag {
  id: number;
  name: string;
  slug: string;
  slugPath: string;
  author?: IBurdyAuthor;
  parent?: Omit<IBurdyTag, 'parent'>;
}

export type IBurdySearch<T = any> = {
  count: number;
  results: T[];
  page?: number;
  limit?: number;
}

export interface IBurdyImage {
  id?: number;
  name?: string;
  height?: number;
  width?: number;
  mimeType?: string;
  tags?: IBurdyTag[];
  src: string;
  alt?: string;
}
