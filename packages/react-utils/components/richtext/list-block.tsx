import React, { FC, Fragment } from 'react';
import BlockInnerMarkup from './block-inner-markup';
import { BlockTypeProps } from './block';

export const listTypesMapping = {
  'unordered-list-item': 'ul',
  'ordered-list-item': 'ol',
};

const ListBlock: FC<BlockTypeProps> = (props): JSX.Element | null => {
  const { block } = props;
  const CustomTag = listTypesMapping?.[block?.type as string];
  if (CustomTag) {
    return (
      <CustomTag>
        {(block?.items || []).map((item) => {
          const subItems = item?.items || [];
          return (
            <Fragment key={item?.key}>
              <li>
                <BlockInnerMarkup {...props} block={item} />
              </li>
              {subItems?.length > 0 && <ListBlock {...props} block={item} />}
            </Fragment>
          );
        })}
      </CustomTag>
    );
  }
  return null;
};

export default ListBlock;
