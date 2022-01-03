import { IBurdyPage, IBurdySearch, IBurdyTag, RewritesObject } from '../types';
import axios from 'axios';

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

export const BurdyApi = {
  getPage: async <T = any>(host?: string, slugPath?: string, options?: GetPageOptions): Promise<IBurdyPage<T>> => {
    const headers: Record<string, string> = {};
    const params: Record<string, boolean | number | string> = {};

    if (options?.includeChildren) params.includeChildren = options.includeChildren;
    if (options?.perPage) params.perPage = options.perPage;
    if (options?.page) params.page = options.page;

    if (options?.xContentToken) headers['x-content-token'] = options?.xContentToken;

    if (options?.versionId) params.versionId = options?.versionId;
    if (options?.relationsDepth) params.relationsDepth = options?.relationsDepth;
    if (options?.draft) params.draft = options?.draft;

    const { data: page } = await axios.get<IBurdyPage<T>>(`${host}/api/content/${slugPath}`, {
      params,
      headers
    });

    return page;
  },
  searchPages: async <T = any>(host: string, options: SearchPagesOptions): Promise<IBurdySearch<IBurdyPage<T>>> => {
    const headers: Record<string, string> = {};
    const params: Record<string, boolean | number | string> = {};

    if (options?.xContentToken) headers['x-content-token'] = options?.xContentToken;

    if (options?.draft) params.draft = true;
    if (options?.type) params.type = options.type;
    if (options?.contentTypeName) params.contentTypeName = options.contentTypeName;
    if (options?.search) params.search = options.search;
    if (options?.parent) params.parent = options.parent;
    if (options?.onlyOrphans) params.onlyOrphans = options.onlyOrphans;
    if (options?.slugPath) params.slugPath = options.slugPath;
    if (options?.tags) params.tags = options.tags;
    if (options?.expand) params.expand = options.expand;
    if (options?.compile) params.compile = options.compile;
    if (options?.relationsDepth) params.relationsDepth = options.relationsDepth;
    if (options?.orderBy) params.orderBy = options.orderBy;
    if (options?.order) params.order = options.order;
    if (options?.limit) params.limit = options.limit;
    if (options?.page) params.page = options.page;

    const { data } = await axios.get<IBurdySearch<IBurdyPage<T>>>(`${host}/api/search/posts`, {
      params,
      headers
    });
    return data;
  },
  searchTags: async (host: string, options: SearchTagsOptions): Promise<IBurdySearch<IBurdyTag>> => {
    const headers: Record<string, string> = {};
    const params: Record<string, boolean | number | string> = {};

    if (options?.xContentToken) headers['x-content-token'] = options?.xContentToken;

    if (options?.search) params.search = options.search;
    if (options?.parent) params.parent = options.parent;
    if (options?.onlyOrphans) params.onlyOrphans = options.onlyOrphans;
    if (options?.slugPath) params.slugPath = options.slugPath;
    if (options?.expand) params.expand = options.expand;
    if (options?.orderBy) params.orderBy = options.orderBy;
    if (options?.order) params.order = options.order;
    if (options?.limit) params.limit = options.limit;
    if (options?.page) params.page = options.page;

    const { data } = await axios.get<IBurdySearch<IBurdyTag>>(`${host}/api/search/tags`, {
      params,
      headers
    });
    return data;
  }
};

export type ApiConfig = {
  host: string;
  xContentToken?: string;
};

export interface CreateApiType {
  getPage: (slugPath: string, options?: GetPageOptions) => Promise<IBurdyPage>;
  searchPages: (options: SearchPagesOptions) => Promise<IBurdySearch<IBurdyPage>>;
  searchTags: (options: SearchTagsOptions) => Promise<IBurdySearch<IBurdyTag>>;
}
export const createApi = (apiConfig: ApiConfig): CreateApiType => ({
  getPage: async (slugPath: string, options?: GetPageOptions): Promise<IBurdyPage> => BurdyApi.getPage(apiConfig?.host, slugPath, {
    xContentToken: apiConfig?.xContentToken,
    ...(options || {})
  }),
  searchPages: async (options: SearchPagesOptions): Promise<IBurdySearch<IBurdyPage>> => BurdyApi.searchPages(apiConfig?.host, {
    xContentToken: apiConfig?.xContentToken,
    ...(options || {})
  }),
  searchTags: async (options: SearchTagsOptions): Promise<IBurdySearch<IBurdyTag>> => BurdyApi.searchTags(apiConfig?.host, {
    xContentToken: apiConfig?.xContentToken,
    ...(options || {})
  })
});
