import React, { FC, useEffect } from 'react';

import Block, { BlockTypeProps } from './richtext/block';
import { reduceBlocks } from './richtext/utility';
import { CodeHighlight } from '@burdy-cms/web-utils';

export type RichTextProps = {
  as?: 'div' | 'article' | 'section';
  blocks?: any[];
  richText?: {
    blocks?: any[];
    entityMap?: any;
  }
  codeHighlight?: boolean;
} & Pick<BlockTypeProps, 'onRenderEntity'>;

const RichText: FC<RichTextProps> = (props) => {
  const { richText, as, onRenderEntity, codeHighlight } = props;

  const reduced = reduceBlocks(Array.isArray(richText?.blocks) ? richText?.blocks : []);
  const CustomAs = as || 'div';

  useEffect(() => {
    if (codeHighlight) {
      CodeHighlight.highlightAll();
    }
  }, [reduced, codeHighlight]);
  
  return (
    <CustomAs>
      {(reduced || []).map((block) => {
        return <Block key={block.key} block={block} entityMap={richText?.entityMap} onRenderEntity={onRenderEntity} />;
      })}
    </CustomAs>
  );
};

export default RichText;
