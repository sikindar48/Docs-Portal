import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'NS Software Solutions',
  tagline: 'Documentation Portal for all NS Software products',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.nssoftwaresolutions.in',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ns-software-solutions',
  projectName: 'docs-portal',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is in Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

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
        src: 'img/ns-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'examPortalSidebar',
          label: 'Exam Portal',
          position: 'left',
        },
        {
          href: 'https://github.com/ns-software-solutions',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Overview',
              to: '/exam-portal/overview',
            },
            {
              label: 'API Reference',
              to: '/exam-portal/api-reference',
            },
            {
              label: 'Architecture',
              to: '/exam-portal/architecture',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Deployment Guide',
              to: '/exam-portal/deployment-guide',
            },
            {
              label: 'Security Guide',
              to: '/exam-portal/security-and-exam-integrity',
            },
            {
              label: 'Changelog',
              to: '/exam-portal/changelog',
            },
          ],
        },
        {
          title: 'Links',
          items: [
            {
              label: 'Main Website',
              href: 'https://www.nssoftwaresolutions.in',
            },
            {
              label: 'Contact',
              href: 'https://www.nssoftwaresolutions.in/contact',
            },
            {
              label: 'GitHub',
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
