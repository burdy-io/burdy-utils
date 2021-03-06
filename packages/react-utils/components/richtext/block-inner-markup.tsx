import React, {FC, Fragment} from 'react';
import Entity from './entity';
import { nanoid } from 'nanoid';
import { BlockTypeProps } from './block';

/**
 * The function returns text for given section of block after doing required character replacements.
 */
function getSectionText(text) {
  if (text && text.length > 0) {
    return text.join('');
  }
  return '';
}

/**
 * Function returns true for a set of styles if the value of these styles at an offset
 * are same as that on the previous offset.
 */
export function sameStyleAsPrevious(inlineStyles, styles, index) {
  let sameStyled = true;
  if (index > 0 && index < inlineStyles.length) {
    styles.forEach((style) => {
      sameStyled = sameStyled && inlineStyles[style][index] === inlineStyles[style][index - 1];
    });
  } else {
    sameStyled = false;
  }
  return sameStyled;
}

/**
 * For a given section in a block the function will return a further list of sections,
 * with similar inline styles applicable to them.
 */
function getInlineStyleSections(block, styles, start, end) {
  const styleSections: any[] = [];
  const text = Array.from(block.text);
  if (text.length > 0) {
    const inlineStyles = getStyleArrayForBlock(block);
    let section: any;
    for (let i = start; i < end; i += 1) {
      if (i !== start && sameStyleAsPrevious(inlineStyles, styles, i)) {
        section.text.push(text[i]);
        section.end = i + 1;
      } else {
        section = {
          styles: getStylesAtOffset(inlineStyles, i),
          text: [text[i]],
          start: i,
          end: i + 1,
          key: nanoid(),
        };
        styleSections.push(section);
      }
    }
  }
  return styleSections;
}

/**
 * The function will return array of inline styles applicable to the block.
 */
function getStyleArrayForBlock(block) {
  const { text, inlineStyleRanges } = block;
  const inlineStyles = {
    BOLD: new Array(text.length),
    ITALIC: new Array(text.length),
    UNDERLINE: new Array(text.length),
    STRIKETHROUGH: new Array(text.length),
    CODE: new Array(text.length),
    SUPERSCRIPT: new Array(text.length),
    SUBSCRIPT: new Array(text.length),
    length: text.length,
  };
  if (inlineStyleRanges && inlineStyleRanges.length > 0) {
    inlineStyleRanges.forEach((range) => {
      const { offset } = range;
      const length = offset + range.length;
      for (let i = offset; i < length; i += 1) {
        if (inlineStyles[range.style]) {
          inlineStyles[range.style][i] = true;
        }
      }
    });
  }
  return inlineStyles;
}

/**
 * The function will return inline style applicable at some offset within a block.
 */
export function getStylesAtOffset(inlineStyles, offset) {
  const styles: any = {};
  if (inlineStyles?.UNDERLINE?.[offset]) {
    styles.UNDERLINE = true;
  }
  if (inlineStyles?.ITALIC?.[offset]) {
    styles.ITALIC = true;
  }
  if (inlineStyles?.BOLD?.[offset]) {
    styles.BOLD = true;
  }
  if (inlineStyles?.STRIKETHROUGH?.[offset]) {
    styles.STRIKETHROUGH = true;
  }
  if (inlineStyles?.CODE?.[offset]) {
    styles.CODE = true;
  }
  if (inlineStyles?.SUPERSCRIPT?.[offset]) {
    styles.SUPERSCRIPT = true;
  }
  if (inlineStyles?.SUBSCRIPT?.[offset]) {
    styles.SUBSCRIPT = true;
  }

  return styles;
}

/**
 * Function returns html for text depending on inline style tags applicable to it.
 */
export const InlineStyleMarkup: FC<any> = (props) => {
  const { style, content } = props;
  if (style === 'BOLD') {
    return <strong>{content}</strong>;
  }
  if (style === 'ITALIC') {
    return <em>{content}</em>;
  }
  if (style === 'UNDERLINE') {
    return <ins>{content}</ins>;
  }
  if (style === 'STRIKETHROUGH') {
    return <del>{content}</del>;
  }
  if (style === 'CODE') {
    return <code>{content}</code>;
  }
  if (style === 'SUPERSCRIPT') {
    return <sup>{content}</sup>;
  }
  if (style === 'SUBSCRIPT') {
    return <sub>{content}</sub>;
  }
  return content;
};

/**
 * The function returns an array of entity-sections in blocks.
 * These will be areas in block which have same entity or no entity applicable to them.
 */
const getSections = (block) => {
  const sections: any[] = [];
  let lastOffset = 0;
  let sectionRanges: any[] = block.entityRanges.map((range) => {
    const { offset, length, key } = range;
    return {
      offset,
      length,
      key,
      type: 'ENTITY',
    };
  });
  sectionRanges = sectionRanges.sort((s1, s2) => s1.offset - s2.offset);
  sectionRanges.forEach((r) => {
    if (r.offset > lastOffset) {
      sections.push({
        start: lastOffset,
        end: r.offset,
        key: nanoid(),
      });
    }
    sections.push({
      start: r.offset,
      end: r.offset + r.length,
      entityKey: r.key,
      type: r.type,
      key: nanoid(),
    });
    lastOffset = r.offset + r.length;
  });

  if (lastOffset < block.text.length) {
    sections.push({
      start: lastOffset,
      end: block.text.length,
      key: nanoid(),
    });
  }
  return sections;
};

/**
 * The method returns markup for section to which inline styles
 */
const InlineStyleSectionMarkup: FC<any> = (props): JSX.Element | null => {
  const { block, styleSection } = props;
  const styleTagSections = getInlineStyleSections(
    block,
    ['BOLD', 'ITALIC', 'UNDERLINE', 'STRIKETHROUGH', 'CODE'],
    styleSection.start,
    styleSection.end
  );

  return (
    <>
      {styleTagSections.map((stylePropertySection) => {
        const { styles, text, key } = stylePropertySection;
        let content = <>{getSectionText(text)}</>;
        Object.keys(styles || {}).forEach((style) => {
          content = <InlineStyleMarkup style={style} content={content} />;
        });
        return <Fragment key={key}>{content}</Fragment>;
      })}
    </>
  );
};

export type SectionMarkupProps = {
  section: any;
} & BlockTypeProps;

const SectionMarkup: FC<SectionMarkupProps> = (props): JSX.Element | null => {
  const { section, block, entityMap, onRenderEntity } = props;

  const inlineStyleSections = getInlineStyleSections(block, [], section.start, section.end);
  const elements: any[] = [];
  inlineStyleSections.forEach((styleSection) => {
    elements.push(<InlineStyleSectionMarkup styleSection={styleSection} block={block} />);
  });

  if (section.type === 'ENTITY') {
    if (section.entityKey !== undefined && section.entityKey !== null) {
      return (
        <Entity entityMap={entityMap} entityKey={section.entityKey} onRenderEntity={onRenderEntity}>
          {inlineStyleSections.map((styleSection: any) => {
            return <InlineStyleSectionMarkup key={styleSection?.key} styleSection={styleSection} block={block} />;
          })}
        </Entity>
      );
    }
  }

  return (
    <>
      {inlineStyleSections.map((styleSection: any) => {
        return <InlineStyleSectionMarkup key={styleSection?.key} styleSection={styleSection} block={block} />;
      })}
    </>
  );
};

const BlockInnerMarkup: FC<BlockTypeProps> = (props): JSX.Element => {
  const { block } = props;
  const sections = getSections(block);
  return (
    <>
      {sections.map((section: any) => {
        return (
          <SectionMarkup
            {...props}
            key={section?.key}
            section={section}
          />
        );
      })}
    </>
  );
};

export default BlockInnerMarkup;
