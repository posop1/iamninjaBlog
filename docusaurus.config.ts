// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.nightOwlLight;
const darkCodeTheme = require('prism-react-renderer').themes.nightOwl;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Iamninja Blog',
  favicon: 'img/favicon.webp',
  // tagline: 'Всякое гиковское',
  url: 'https://iamninja.ru',
  baseUrl: '/',

  onBrokenLinks: 'throw',
  // onBrokenMarkdownLinks: 'warn',
  onBrokenMarkdownLinks: 'throw',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Iamninja', // Usually your GitHub org/user name.
  projectName: 'iamninjaBlog', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  // plugins: [
  //   [
  //     'docusaurus-plugin-yandex-metrica',
  //     {
  //       counterID: '49559035',
  //     },
  //   ],
  // ],

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
          src: 'img/logo.png', // todo webp
        },
        items: [
          {
            type: 'dropdown',
            label: 'Блог',
            position: 'left',
            items: [{ label: 'Главная', to: '/' }],
          },
          {
            type: 'dropdown',
            label: 'Ресурсы',
            position: 'left',
            items: [{ label: 'База знаний', type: 'doc', docId: 'intro' }],
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
