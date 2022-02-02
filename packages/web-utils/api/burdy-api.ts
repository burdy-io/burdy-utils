import { IBurdyPage, IBurdySearch, IBurdyTag, RewritesObject } from '../types';
import axios from 'axios';
import queryString from 'query-string';

export type GetPageOptions = {
  draft?: boolean;

  /**
   * @deprecated The param should not be used, check SearchPosts API
   */
  includeChildren?: boolean;
  /**
   * @deprecated The param should not be used, check SearchPosts API
   */
  perPage?: number;
  /**
   * @deprecated The param should not be used, check SearchPosts API
   */
  page?: number;

  versionId?: number | string;
  relationsDepth?: number;
  xContentToken?: string;
};

export type SearchPagesOptions = {
  draft?: boolean;
  type?: string;
  contentTypeName?: string;
  search?: string;
  parent?: string;
  onlyOrphans?: boolean;
  slugPath?: string;
  tags?: string;
  expand?: string;
  compile?: boolean;
  relationsDepth?: number;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
  limit?: number;
  page?: number;
  xContentToken?: string;
};

export type SearchTagsOptions = {
  search?: string;
  parent?: string;
  onlyOrphans?: boolean;
  slugPath?: string;
  expand?: string;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
  limit?: number;
  page?: number;
  xContentToken?: string;
};

export type OptimizeImageOptions = {
  // General
  animated?: boolean;
  progressive?: boolean;
  format?: 'auto' | 'avif' | 'webp' | 'jpeg' | 'jpg' | 'png';
  quality?: number;
  // Resizing
  width?: number;
  height?: number;
  fit?: 'fill' | 'cover' | 'contain' | 'inside' | 'outside';
  gravity?: 'north' | 'northeast' | 'southeast' | 'south' | 'southwest' | 'west' | 'northwest' | 'east' | 'center' | 'centre';
}

export const BurdyApi = {
  getPage: async <T = any>(host?: string, slugPath?: string, params: GetPageOptions = {}): Promise<IBurdyPage<T>> => {
    const headers: Record<string, string> = {};

    if (params?.xContentToken) headers['x-content-token'] = params?.xContentToken;

    const { data: page } = await axios.get<IBurdyPage<T>>(`${host}/api/content/${slugPath}`, {
      params,
      headers
    });

    return page;
  },
  searchPages: async <T = any>(host: string, params: SearchPagesOptions): Promise<IBurdySearch<IBurdyPage<T>>> => {
    const headers: Record<string, string> = {};

    if (params?.xContentToken) headers['x-content-token'] = params?.xContentToken;
    if (params?.draft) params.draft = true;

    const { data } = await axios.get<IBurdySearch<IBurdyPage<T>>>(`${host}/api/search/posts`, {
      params,
      headers
    });
    return data;
  },
  searchTags: async (host: string, params: SearchTagsOptions): Promise<IBurdySearch<IBurdyTag>> => {
    const headers: Record<string, string> = {};

    if (params?.xContentToken) headers['x-content-token'] = params?.xContentToken;

    const { data } = await axios.get<IBurdySearch<IBurdyTag>>(`${host}/api/search/tags`, {
      params,
      headers
    });
    return data;
  },
  optimizeImage: async (host: string, imageOptions: OptimizeImageOptions): string => {
    const query = queryString.stringify(imageOptions, {skipEmptyString: true, skipNull: true});
    return `${host}/api/image?${query}`;
  }
};

export type ApiConfig = {
  host: string;
  xContentToken?: string;
};

export type CreateApiType = {
  getPage: <T = any>(slugPath: string, options?: GetPageOptions) => Promise<IBurdyPage<T>>;
  searchPages: <T = any>(options: SearchPagesOptions) => Promise<IBurdySearch<IBurdyPage<T>>>;
  searchTags: (options: SearchTagsOptions) => Promise<IBurdySearch<IBurdyTag>>;
  optimizeImage: (options: OptimizeImageOptions) => string;
}
export const createApi = (apiConfig: ApiConfig): CreateApiType => ({
  getPage: async <T>(slugPath: string, options?: GetPageOptions): Promise<IBurdyPage<T>> => BurdyApi.getPage(apiConfig?.host, slugPath, {
    xContentToken: apiConfig?.xContentToken,
    ...(options || {})
  }),
  searchPages: async <T>(options: SearchPagesOptions): Promise<IBurdySearch<IBurdyPage<T>>> => BurdyApi.searchPages(apiConfig?.host, {
    xContentToken: apiConfig?.xContentToken,
    ...(options || {})
  }),
  searchTags: async (options: SearchTagsOptions): Promise<IBurdySearch<IBurdyTag>> => BurdyApi.searchTags(apiConfig?.host, {
    xContentToken: apiConfig?.xContentToken,
    ...(options || {})
  }),
  optimizeImage: (options: OptimizeImageOptions): string => BurdyApi.optimizeImage(apiConfig?.host, options)
});
