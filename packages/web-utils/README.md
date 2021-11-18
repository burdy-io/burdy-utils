# Burdy Web Utils

Powerful utilities to simplify usage of the [Burdy](https://burdy.io) on the web.

- See [Burdy Docs](https://burdy.io/docs) for more details

## Instalation

```sh
npm i @burdy/web-utils
```

## Functionalities

### createRewrites

Creates a `RewritesObject` instance that can be used to rewrite paths based on the configuration.

Accepts `rewriteMap` and `origin` (optional) as object parameters.
```ts
import { createRewrites } from '@burdy/web-utils'; 
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

### richtextToHtml

A function for converting Richtext (DraftJS) Editor content to plain HTML.

This is a forked version of `draftjs-to-html` [draftjs-to-html](https://www.npmjs.com/package/draftjs-to-html) created by [Jyoti Puri](https://github.com/jpuri).

```ts
import { richtextToHtml } from '@burdy/web-utils';

const rawContentState = BURDY_RICHTEXT_RESPONSE;

const markup = richtextToHtml(
  rawContentState
);
```

### subscribeToPreview

Subscribes to Burdy preview (iframe parent). Returns a `Subscription` that has `unsubscribe()` 
method.

```ts
import { subscribeToPreview } from '@burdy/web-utils';
const subscription = subscribeToPreview({
  onEdit: post => {
    updateView(post); // Updates view using new content
  }
});

// Unsubscribe at some point if needed
subscription.unsubscribe();
```

### updatePreview

Sends the updates to Burdy preview (iframe parent). This allows Burdy to know when you
have switched the page on the frontend.

```ts
import { updatePreview } from '@burdy/web-utils';

onRouterChange((pageData) => {
  updatePreview(pageData);
});
```

