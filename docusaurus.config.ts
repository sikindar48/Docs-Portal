import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'NS Software Solutions',
  tagline: 'Documentation Portal for all NS Software products',
  favicon: 'img/logo.png',

  // Set the production url of your site here
  url: 'https://docs-portal.info-nssoftwaresolutions.workers.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ns-software-solutions',
  projectName: 'docs-portal',

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      type: 'text/css',
    },
  ],

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is in Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Remove the "edit this page" link
          editUrl: undefined,
          routeBasePath: '/',
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/social-card.png',
    navbar: {
      title: 'NS Software Solutions',
      logo: {
        alt: 'NS Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          href: 'https://github.com/ns-software-solutions',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'search',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Exam Portal Docs',
          items: [
            {
              label: 'Overview',
              to: '/exam-portal/overview',
            },
            {
              label: 'System Architecture',
              to: '/exam-portal/architecture',
            },
            {
              label: 'API Reference',
              to: '/exam-portal/api-reference',
            },
            {
              label: 'Deployment Guide',
              to: '/exam-portal/deployment-guide',
            },
          ],
        },
        {
          title: 'Internship Portal Docs',
          items: [
            {
              label: 'Overview',
              to: '/internship-portal/overview',
            },
            {
              label: 'Quick Start',
              to: '/internship-portal/quick-start',
            },
            {
              label: 'Architecture',
              to: '/internship-portal/architecture',
            },
          ],
        },
        {
          title: 'Company',
          items: [
            {
              label: 'Main Website',
              href: 'https://www.nssoftwaresolutions.in',
            },
            {
              label: 'Contact Us',
              href: 'https://www.nssoftwaresolutions.in/contact',
            },
            {
              label: 'GitHub Organization',
              href: 'https://github.com/ns-software-solutions',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} NS Software Solutions. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'javascript', 'bash', 'json', 'sql'],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
