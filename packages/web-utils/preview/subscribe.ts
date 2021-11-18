import { IBurdyPage } from '../types';

export type PreviewMessageEvent<T = any> = MessageEvent<{
  source?: 'burdy-post-edit';
  payload: IBurdyPage<T>;
}>;

export type PreviewListener<T = any> = {
  onEdit?: (post: IBurdyPage<T>) => void;
};

export const subscribeToPreview = <T = any>(previewListener: PreviewListener<T>) => {
  if (!window || !window.parent) return null;

  const handler = (event: PreviewMessageEvent<T>) => {
    if (event.data?.source === 'burdy-post-edit') {
      previewListener?.onEdit?.(event.data.payload);
    }
  };

  window.addEventListener('message', handler);

  return {
    unsubscribe: () => window.removeEventListener('message', handler),
  };
};
