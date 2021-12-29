import { createRewrites } from '../rewrites';
import faker from 'faker';
import { RewriteDestination, RewritesMap } from '../types';

type GenerateRewriteOptions = {
  min?: number;
  max?: number;
  generator: () => RewritesMap<any>;
}

const generateRewrites = ({ min = 5, max = 10, generator }: GenerateRewriteOptions) => new Array(
  faker.datatype.number({ min: 5, max: 10 })).fill(null).map<RewritesMap<any>>(() => ({
    ...generator()
  })
);

describe('rewrites', function () {
  it('contains origin', () => {
    const origin = faker.internet.url();
    const rewrites = createRewrites({
      origin,
      rewrite: []
    });

    expect(rewrites.getOrigin()).toBe(origin);
  });

  it('contains rewrites', () => {
    const origin = faker.internet.url();
    const rewrite = generateRewrites({
      generator: () => ({
        destination: faker.random.word(),
        source: faker.random.word()
      })
    });

    const rewrites = createRewrites({
      origin,
      rewrite
    })

    expect(rewrites.getRewrite()).toBe(rewrite);
  });

  it('rewrites string paths', () => {
    const origin = faker.internet.url();
    const rewrite: RewritesMap<string>[] = [
      {
        source: '/:lang(fr|de)/:path*',
        destination: '/sites/{lang}/{path}'
      },
      {
        source: '/:path*',
        destination: '/sites/en/{path}'
      }
    ];

    const rewrites = createRewrites({
      origin,
      rewrite
    });

    const path = faker.random.word().toLowerCase();

    expect(rewrites.rewrite(`/fr/${path}`)).toBe(`${origin}/sites/fr/${path}`);
    expect(rewrites.rewrite(`/de/${path}`)).toBe(`${origin}/sites/de/${path}`);
    expect(rewrites.rewrite(`/${path}`)).toBe(`${origin}/sites/en/${path}`);
    expect(rewrites.rewrite(path)).toBeNull();
  });

  it('rewrites object map', () => {
    const origin = faker.internet.url();
    const rewrite = [
      {
        source: '/:lang(fr|de)/:path*',
        destination: {
          page: '/sites/{lang}/{path}',
          footer: '/sites/{lang}/fragments/footer',
          header: '/sites/{lang}/fragments/header',
          docsMenu: '/sites/{lang}/fragments/docs-menu',
        },
      },
      {
        source: '/:path*',
        destination: {
          page: '/sites/en/{path}',
          footer: '/sites/en/fragments/footer',
          header: '/sites/en/fragments/header',
          docsMenu: '/sites/en/fragments/docs-menu',
        },
      },
    ]

    const rewrites = createRewrites({
      origin,
      rewrite
    })

    const path = faker.random.word().toLowerCase();

    expect(rewrites.rewrite(`/fr/${path}`)).toMatchObject({
      page: `${origin}/sites/fr/${path}`,
      header: `${origin}/sites/fr/fragments/header`,
      footer: `${origin}/sites/fr/fragments/footer`,
      docsMenu: `${origin}/sites/fr/fragments/docs-menu`
    });

    expect(rewrites.rewrite(`/de/${path}`)).toMatchObject({
      page: `${origin}/sites/de/${path}`,
      header: `${origin}/sites/de/fragments/header`,
      footer: `${origin}/sites/de/fragments/footer`,
      docsMenu: `${origin}/sites/de/fragments/docs-menu`
    });

    expect(rewrites.rewrite(`/${path}`)).toMatchObject({
      page: `${origin}/sites/en/${path}`,
      header: `${origin}/sites/en/fragments/header`,
      footer: `${origin}/sites/en/fragments/footer`,
      docsMenu: `${origin}/sites/en/fragments/docs-menu`
    });

    expect(rewrites.rewrite(path)).toBeNull();
  });
});
