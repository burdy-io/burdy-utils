import { IBurdyPage } from '../types';
import axios from 'axios';

type GetPageOptions = {
  token?: string;
  includeChildren?: boolean;
  perPage?: number;
  page?: number;
};

export const BurdyApi = {
  getPage: async <T = any>(url: string, options?: GetPageOptions): Promise<IBurdyPage<T>> => {
    const token = options?.token;
    const headers: Record<string, string> = {};

    const params: Record<string, boolean | number | string> = {};

    if (options?.includeChildren) params.includeChildren = options.includeChildren;
    if (options?.perPage) params.perPage = options.perPage;
    if (options?.page) params.page = options.page;

    if (token) {
      headers.token = token;
      params.allowUnpublished = true;
    }

    const { data: page } = await axios.get<IBurdyPage<T>>(url, {
      params,
      headers,
    });

    return page;
  },
};
