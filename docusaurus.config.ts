// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
import 'dotenv/config';

const lightCodeTheme = require('prism-react-renderer').themes.nightOwlLight;
const darkCodeTheme = require('prism-react-renderer').themes.nightOwl;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Iamninja Blog',
  favicon: 'img/favicon.webp',
  url: process.env.URL,
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  organizationName: 'Iamninja',
  projectName: 'iamninjaBlog',

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          routeBasePath: '/docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/posop1/iamninjaBlog',
          showLastUpdateTime: true,
        },

        blog: {
          routeBasePath: '/',
          showReadingTime: true,
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'Другие посты',
        },

        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/layout.css'),
            require.resolve('./src/css/overrides.css'),
          ],
        },

        gtag: {
          trackingID: 'G-SXVYQX65GD',
          anonymizeIP: true,
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },

      navbar: {
        title: '',
        logo: {
          alt: 'Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'dropdown',
            label: 'Блог',
            position: 'left',
            items: [
              { label: 'Главная', to: '/' },
              { label: 'Все по годам', to: 'archive' },
            ],
          },
          {
            label: 'Обо мне',
            position: 'left',
            to: 'about',
          },
          {
            label: 'Полезное',
            position: 'left',
            to: 'useful',
          },

          {
            href: 'https://github.com/posop1/iamninjaBlog',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['lua', 'bash', 'json'],
      },
      algolia: {
        appId: '03RIRS86OT',
        apiKey: 'a74f58efb237f210291f299f0c7e8769',
        indexName: 'amd-nick',
      },
    },
};

module.exports = config;
