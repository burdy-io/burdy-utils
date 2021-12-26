import React, { FC, ReactNode } from 'react';
import BlockInnerMarkup from './block-inner-markup';
import Entity, { EntityProps } from './entity';
import { isEmptyString } from './utility';
import ListBlock from './list-block';
import CodeBlock from './code-block';

/**
 * Function to check if the block is an atomic entity block.
 */
export const isAtomicEntityBlock = (block) => {
  if (block?.entityRanges?.length > 0 && (isEmptyString(block?.text) || block?.type === 'atomic')) {
    return true;
  }
  return false;
};

/**
 * Function to check if a block is of type list.
 */
const isListBlock = (block: any) => {
  return block?.type === 'unordered-list-item' || block?.type === 'ordered-list-item';
};

/**
 * Function to check if a block is of type code block
 */
const isCodeBlock = (block: any) => {
  return block?.type === 'code-block';
};

export const blockTypesMapping = {
  unstyled: 'p',
  'header-one': 'h1',
  'header-two': 'h2',
  'header-three': 'h3',
  'header-four': 'h4',
  'header-five': 'h5',
  'header-six': 'h6',
  blockquote: 'blockquote',
};

export type BlockTypeProps = {
  block?: any;
  entityMap?: any;
  onRenderEntity?: (entity: EntityProps, children?: ReactNode) => JSX.Element | null | undefined | void;
};

const Block: FC<BlockTypeProps> = (props): JSX.Element | null => {
  const { block } = props;

  const CustomTag = blockTypesMapping?.[block?.type as string];
  if (isAtomicEntityBlock(block)) {
    return <Entity {...props} entityKey={`${block.entityRanges[0].key}`} />;
  }

  if (isListBlock(block)) {
    return <ListBlock {...props} />;
  }

  if (isCodeBlock(block)) {
    return <CodeBlock {...props} />;
  }

  if (CustomTag) {
    return (
      <CustomTag>
        <BlockInnerMarkup {...props} />
      </CustomTag>
    );
  }
  return null;
};

export default Block;
