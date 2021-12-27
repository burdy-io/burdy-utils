import React, { FC, useEffect } from 'react';

import Block, { BlockTypeProps } from './richtext/block';
import { reduceBlocks } from './richtext/utility';
import { CodeHighlight } from '@burdy-cms/web-utils';

export type RichTextProps = {
  as?: 'div' | 'article' | 'section';
  blocks?: any[];
  codeHighlight?: boolean;
} & Omit<BlockTypeProps, 'block'>;

const RichText: FC<RichTextProps> = (props) => {
  const { blocks, as, onRenderEntity, entityMap, codeHighlight } = props;

  const reduced = reduceBlocks(Array.isArray(blocks) ? blocks : []);
  const CustomAs = as || 'div';

  useEffect(() => {
    if (codeHighlight) {
      CodeHighlight.highlightAll();
    }
  }, [reduced, codeHighlight]);
  
  return (
    <CustomAs>
      {(reduced || []).map((block) => {
        return <Block key={block.key} block={block} entityMap={entityMap} onRenderEntity={onRenderEntity} />;
      })}
    </CustomAs>
  );
};

export default RichText;
