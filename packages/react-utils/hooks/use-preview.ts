import { IBurdyPage, subscribeToPreview, updatePreview } from '@burdy-cms/web-utils';
import { useEffect, useState } from 'react';

const usePreview = <T>(originalPage: IBurdyPage<any>) => {
  const [page, setPage] = useState(originalPage);

  useEffect(() => {
    const subscription = subscribeToPreview({
      onEdit: post => setPage(post)
    });

    return () => subscription?.unsubscribe?.();
  }, []);

  useEffect(() => {
    updatePreview(page);
  }, [page]);

  useEffect(() => {
    setPage(originalPage);
  }, [originalPage]);

  return page;
};
