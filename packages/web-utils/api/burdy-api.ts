import { IBurdyPage, IBurdyTag } from '../types';
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
  xContentToken: string;
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
  xContentToken: string;
};

export const BurdyApi = {
  getPage: async <T = any>(url: string, options?: GetPageOptions): Promise<IBurdyPage<T>> => {
    const headers: Record<string, string> = {};
    const params: Record<string, boolean | number | string> = {};

    if (options?.includeChildren) params.includeChildren = options.includeChildren;
    if (options?.perPage) params.perPage = options.perPage;
    if (options?.page) params.page = options.page;

    if (options?.xContentToken) headers['x-content-token'] = options?.xContentToken;

    if (options?.versionId) params.versionId = options?.versionId;
    if (options?.relationsDepth) params.relationsDepth = options?.relationsDepth;
    if (options?.draft) params.draft = options?.draft;

    const { data: page } = await axios.get<IBurdyPage<T>>(url, {
      params,
      headers
    });

    return page;
  },
  searchPages: async <T = any>(host: string, options: SearchPagesOptions): Promise<IBurdyPage<T>[]> => {
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

    const { data: pages } = await axios.get<IBurdyPage[]>(`${host}/api/search/posts`, {
      params,
      headers
    });
    return pages;
  },
  searchTags: async (host: string, options: SearchTagsOptions): Promise<IBurdyTag[]> => {
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

    const { data: tags } = await axios.get<IBurdyTag[]>(`${host}/api/search/posts`, {
      params,
      headers
    });
    return tags;
  }
}
