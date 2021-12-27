import React, { FC, Fragment } from 'react';
import { BlockTypeProps } from './block';
import BlockInnerMarkup from './block-inner-markup';

const CodeBlock: FC<BlockTypeProps> = (props): JSX.Element | null => {
  const { block, entityMap, onRenderEntity } = props;
  return (
    <pre>
      <code>
        {(block?.items || []).map((item, index) => {
          return (
            <Fragment key={item?.key}>
              <BlockInnerMarkup block={item} entityMap={entityMap} onRenderEntity={onRenderEntity} />
              {index < block?.items?.length - 1 && '\n'}
            </Fragment>
          );
        })}
      </code>
    </pre>
  );
};

export default CodeBlock;
