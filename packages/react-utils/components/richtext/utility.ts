/**
 * The function returns true if the string passed to it has no content.
 */
export const isEmptyString = (str: string | undefined | null) => {
  if (str === undefined || str === null || str.length === 0 || str.trim().length === 0) {
    return true;
  }
  return false;
};

/**
 * Reduces draft blocks and prepares them for React usage
 */
export const reduceBlocks = (blocks?: any[]) => {
  return (blocks || []).reduce<any[]>((acc, currentBlock, index) => {
    const previousBlock = acc?.[acc?.length - 1];
    if (currentBlock?.type === 'unordered-list-item' || currentBlock?.type === 'ordered-list-item') {
      if (currentBlock?.depth === 0) {
        if (previousBlock?.type === currentBlock?.type) {
          previousBlock.items.push({
            ...currentBlock,
            items: [],
          });
          return acc;
        } else {
          acc.push({
            ...currentBlock,
            items: [
              {
                ...currentBlock,
                items: [],
              },
            ],
          });
          return acc;
        }
      } else if (currentBlock?.depth > 0) {
        const lastSubItem = previousBlock?.items?.[previousBlock?.items?.length - 1];
        if (previousBlock.depth === currentBlock?.depth - 1 && lastSubItem) {
          if (
            lastSubItem?.items?.length === 0 ||
            lastSubItem?.items?.every((item) => item.type === currentBlock?.type)
          ) {
            lastSubItem.items.push(currentBlock);
            return acc;
          } else {
            return acc;
          }
        } else {
          return acc;
        }
      }
    }
    if (currentBlock?.type === 'code-block') {
      if (previousBlock?.type === 'code-block') {
        previousBlock.items.push(currentBlock);
        return acc;
      } else {
        acc.push({
          ...currentBlock,
          items: [currentBlock],
        });

        return acc;
      }
    }
    return [...acc, currentBlock];
  }, []);
};
