import { IBurdyPage } from '../types';

export const updatePreview = <T = any>(page: IBurdyPage<T>): boolean => {
  if (!window.parent) return false;

  window.parent.postMessage(
    {
      source: 'burdy-data-change',
      page,
    },
    '*'
  );

  return true;
};
