import React, { useEffect } from 'react';
import {richtextToHtml, CodeHighlight } from '@burdy/web-utils';

export type RichTextProps = {
  richText: any;
} & React.HTMLAttributes<HTMLDivElement>;

const RichText: React.VoidFunctionComponent<RichTextProps> = (props) => {
  const {
    richText,
    ...rest
  } = props;

  useEffect(() => {
    CodeHighlight.highlightAll();
  }, []);

  return <article dangerouslySetInnerHTML={{__html: richtextToHtml(richText)}} {...rest} />;
}

export default RichText;
