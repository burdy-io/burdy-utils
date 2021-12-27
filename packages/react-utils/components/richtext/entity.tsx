import React, { FC } from 'react';
import { BlockTypeProps } from './block';

export type EntityProps = {
  data: any;
  mutability: string;
  type: string;
};

export type EntityTypeProps = {
  entityKey: string;
} & BlockTypeProps;

const Entity: FC<EntityTypeProps> = (props): JSX.Element | null => {
  const { entityKey, entityMap, onRenderEntity, children } = props;

  const entity = entityMap?.[entityKey];
  if (typeof onRenderEntity === 'function') {
    const component = onRenderEntity(entity, children);
    if (component) {
      return component;
    }
  }

  if (!entity) return null;

  if (entity.type === 'LINK') {
    const target = entity.data.target || '_self';
    return (
      <a href={entity?.data?.url} target={target}>
        {children}
      </a>
    );
  }

  if (entity.type === 'IMAGE') {
    const { caption, src, alt, width, height } = entity.data;
    return (
      <figure>
        <img src={src} alt={alt} width={width} height={height} />
        {caption?.length > 0 && <figcaption>{caption}</figcaption>}
      </figure>
    );
  }

  if (entity.type === 'TEXT_EDITOR') {
    const { mode, value } = entity.data;
    return (
      <pre>
        <code className={`language-${mode}`}>{value}</code>
      </pre>
    );
  }

  if (entity.type === 'DIVIDER') {
    return <hr />;
  }

  return <>{children}</>;
};

export default Entity;
