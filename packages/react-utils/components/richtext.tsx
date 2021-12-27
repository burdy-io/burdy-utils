import React, { useEffect } from 'react';
import {richtextToHtml, CodeHighlight } from '@burdy-cms/web-utils';

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

  useEffect(() => {
    CodeHighlight.highlightAll();
  }, [richText]);

  return <article dangerouslySetInnerHTML={{__html: richtextToHtml(richText)}} {...rest} />;
}

export default RichText;
