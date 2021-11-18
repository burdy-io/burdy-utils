# Burdy Web Utils

Powerful utilities to simplify usage of the [Burdy](https://burdy.io) on the web.

- See [Burdy Docs](https://burdy.io/docs) for more details

## Instalation

```sh
npm i @burdy-cms/react-utils
```

## Functionalities

### createRewrites

Creates a `RewritesObject` instance that can be used to rewrite paths based on the configuration.

Accepts `rewriteMap` and `origin` (optional) as object parameters.
```ts
import { createRewrites } from '@burdy-cms/web-utils'; 
import axios from 'axios';

const rewrites = createRewrites({
  origin: 'https://cms.website.com/api/content',
  rewriteMap: [
    {
      source: '/:lang(fr|de)/:path*',
      rewrites: {
        page: '/sites/{lang}/{path}',
        header: '/sites/{lang}/fragments/header',
        footer: '/sites/{lang}/fragments/footer'
      }
    },
    {
      source: '/:path*',
      rewrites: {
        page: '/sites/en/{path}',
        header: '/sites/en/fragments/header',
        footer: '/sites/en/fragments/footer'
      }
    }
  ]
});

/**
  Page = https://cms.website.com/api/content/sites/fr/fragments/home
  Header = https://cms.website.com/api/content/sites/fr/fragments/header
  Footer = https://cms.website.com/api/content/sites/fr/fragments/footer
**/
const { page, footer, header } = rewrites.rewrite('/fr/home');

// Fetch data from Burdy
const [pageRequest, footerRequest, headerRequest] = await Promise.all([
  page,
  footer,
  header
]);
``` 

### createRewrites

Creates a `RewritesObject` instance that can be used to rewrite paths based on the configuration.

Accepts `rewriteMap` and `origin` (optional) as object parameters.
```ts
import { createRewrites } from '@burdy-cms/react-utils'; 
import axios from 'axios';

const rewrites = createRewrites({
  origin: 'https://cms.website.com/api/content',
  rewriteMap: [
    {
      source: '/:lang(fr|de)/:path*',
      rewrites: {
        page: '/sites/{lang}/{path}',
        header: '/sites/{lang}/fragments/header',
        footer: '/sites/{lang}/fragments/footer'
      }
    },
    {
      source: '/:path*',
      rewrites: {
        page: '/sites/en/{path}',
        header: '/sites/en/fragments/header',
        footer: '/sites/en/fragments/footer'
      }
    }
  ]
});

/**
  Page = https://cms.website.com/api/content/sites/fr/fragments/home
  Header = https://cms.website.com/api/content/sites/fr/fragments/header
  Footer = https://cms.website.com/api/content/sites/fr/fragments/footer
**/
const { page, footer, header } = rewrites.rewrite('/fr/home');

// Fetch data from Burdy
const [pageRequest, footerRequest, headerRequest] = await Promise.all([
  page,
  footer,
  header
]);
``` 

### usePreview

Burdy hook that allows you to easily subscribe (bind the data) and update the preview mode.

```tsx
// Next.js example [[...slug]].tsx
import { usePreview } from '@burdy-cms/react-utils';

const Page = (props) => {
  // Will listen to Burdy for content updates and communicate updates to Burdy
  const page = usePreview(props.page);

  const {
    footerProps,
    headerProps,
  } = props;

  const theme = useTheme();
  const sections = page?.meta?.content?.sections || [];

  return (
    <>
      {page?.meta?.content?.announcement && <Announcement {...(cleanObjectPropTypes(page?.meta?.content?.announcement))}></Announcement>}
      <Header logo={headerProps?.logo?.[0]} logoTitle='Burdy' logoLink={{href: '/'}} links={headerProps?.links?.map?.(link => link?.link || undefined)} />
      {sections?.map?.(componentMapper)}
      <Footer
        sections={footerProps?.sections || []}
        copyright={footerProps?.copyright || ''}
        copyrightLinks={footerProps?.copyrightLinks}
        maxWidth={footerProps?.maxWidth || 'lg'}
      />
    </>
  );
};


export const getServeSideProps: GetServerSideProps = async (context) => {
  const path = '/'+(context.params?.slug as string[] || []).join('/');
  const {footer, header} = rewrites.rewrite(path);

  const [
    footerFragment,
    headerFragment
  ] = await Promise.all([
    getPost(footer),
    getPost(header)
  ]);

  return {
    footerProps: footerFragment?.meta?.content,
    headerProps: headerFragment?.meta?.content
  }
}
```

### Richtext

Component for handling richtextToHtml:

```tsx
import { RichText } from '@burdy-cms/react-utils';

const SomeComponent = () => (
  <RichText richText={BURDY_CONTENT} />
);
```

### richtextToHtml

A function for converting Richtext (DraftJS) Editor content to plain HTML.

This is a forked version of `draftjs-to-html` [draftjs-to-html](https://www.npmjs.com/package/draftjs-to-html) created by [Jyoti Puri](https://github.com/jpuri).

```ts
import { richtextToHtml } from '@burdy-cms/react-utils';

const rawContentState = BURDY_RICHTEXT_RESPONSE;

const markup = richtextToHtml(
  rawContentState
);
``

