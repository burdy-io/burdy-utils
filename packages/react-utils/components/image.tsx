import React from 'react';
import { IBurdyImage } from '@burdy-cms/web-utils';

export type ImageProps = IBurdyImage & React.HTMLAttributes<HTMLImageElement>;

const Image: React.VoidFunctionComponent<ImageProps> = (props) => {
  const {
    width,
    height,
    ...rest
  } = props;

  return (
    <img
      width={Number.parseFloat(width as any) || ''}
      height={Number.parseFloat(height as any) || ''}
      style={{
        aspectRatio: ((Number.parseFloat(width as any) / Number.parseFloat(height as any)) || '').toString()
      }}
      {...rest}
    />
  );
}

export default Image;
