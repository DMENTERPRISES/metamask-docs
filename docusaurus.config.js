// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import fs from "fs";
require('dotenv').config()
const { themes } = require('prism-react-renderer')
const { REF_ALLOW_LOGIN_PATH } = require('./src/lib/constants')
const {
  fetchAndGenerateDynamicSidebarItems,
  NETWORK_NAMES,
  MM_REF_PATH,
  MM_RPC_URL,
} = require('./src/plugins/plugin-json-rpc')
const codeTheme = themes.dracula
const remarkCodesandbox = require('remark-codesandbox')
const isProd = process.env.NODE_ENV === 'production'
const helpDropdown = fs.readFileSync("./src/components/NavDropdown/DeveloperTools.html", "utf-8");
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MetaMask developer documentation',
  // tagline: '',
  url: 'https://docs.metamask.io',
  baseUrl: process.env.DEST || '/', // overwritten in github action for staging / latest
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/metamask-fox.svg',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'metamask', // Usually your GitHub org/user name.
  projectName: 'metamask-docs', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en' /*, "zh", "ko"*/],
  },

  customFields: {
    LD_CLIENT_ID: process.env.LD_CLIENT_ID,
    VERCEL_ENV: process.env.VERCEL_ENV,
    DASHBOARD_URL: process.env.DASHBOARD_URL || 'http://localhost:3000',
    SENTRY_KEY: process.env.SENTRY_KEY,
    LINEA_ENS_URL: process.env.LINEA_ENS_URL,
  },

  trailingSlash: true,

  scripts: [
    {
      src: 'https://cmp.osano.com/AzZMxHTbQDOQD8c1J/84e64bce-4a70-4dcc-85cb-7958f22b2371/osano.js',
    },
    {
      src: 'https://plausible.io/js/script.js',
      defer: true,
      'data-domain': 'docs.metamask.io',
    },
  ],

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          id: 'docs',
          path: 'docs',
          routeBasePath: '/',
          editUrl: 'https://github.com/MetaMask/metamask-docs/edit/main/',
          sidebarPath: false,
          breadcrumbs: false,
        },
        theme: {
          customCss: require.resolve('./src/scss/custom.scss'),
        },
      },
    ],
  ],
  plugins: [
    'docusaurus-plugin-sass',
    './src/plugins/mm-scss-utils',
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'snaps',
        path: 'snaps',
        routeBasePath: 'snaps',
        editUrl: 'https://github.com/MetaMask/metamask-docs/edit/main/',
        sidebarPath: require.resolve('./snaps-sidebar.js'),
        breadcrumbs: false,
        admonitions: {
          keywords: [
            'info',
            'success',
            'danger',
            'note',
            'tip',
            'warning',
            'important',
            'caution',
            'security',
            'flaskOnly',
          ],
        },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'gator',
        path: 'delegation-toolkit',
        routeBasePath: 'delegation-toolkit',
        editUrl: 'https://github.com/MetaMask/metamask-docs/edit/main/',
        sidebarPath: require.resolve('./gator-sidebar.js'),
        breadcrumbs: false,
        sidebarCollapsed: false,
        includeCurrentVersion: true,
        // Set to the latest release.
        lastVersion: "0.11.0",
        versions: {
          // Defaults to the ./docs folder.
          // Using "development" instead of "next" as path.
          current: {
            label: "development",
            path: "development",
          },
          // The latest release.
          "0.11.0": {
            label: "latest (0.11.0)",
          },
        },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'services',
        path: 'services',
        routeBasePath: 'services',
        editUrl: 'https://github.com/MetaMask/metamask-docs/edit/main/',
        sidebarPath: require.resolve('./services-sidebar.js'),
        breadcrumbs: false,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'dashboard',
        path: 'developer-tools/dashboard',
        routeBasePath: 'developer-tools/dashboard',
        editUrl: 'https://github.com/MetaMask/metamask-docs/edit/main/',
        sidebarPath: require.resolve('./dashboard-sidebar.js'),
        breadcrumbs: false,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'wallet',
        path: 'wallet',
        routeBasePath: 'wallet',
        editUrl: 'https://github.com/MetaMask/metamask-docs/edit/main/',
        sidebarPath: require.resolve('./wallet-sidebar.js'),
        breadcrumbs: false,
        sidebarItemsGenerator: async function ({ defaultSidebarItemsGenerator, ...args }) {
          const sidebarItems = await defaultSidebarItemsGenerator(args)
          const dynamicItems = await fetchAndGenerateDynamicSidebarItems(
            MM_RPC_URL,
            MM_REF_PATH,
            NETWORK_NAMES.metamask
          )
          if (args.item.dirName === 'reference/json-rpc-methods') {
            return [...sidebarItems, ...dynamicItems]
          }
          return sidebarItems
        },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'sdk',
        path: 'sdk',
        routeBasePath: 'sdk',
        editUrl: 'https://github.com/MetaMask/metamask-docs/edit/main/',
        sidebarPath: require.resolve('./sdk-sidebar.js'),
        breadcrumbs: false,
      },
    ],
    './src/plugins/plugin-json-rpc.ts',
    isProd
      ? [
          'docusaurus-plugin-segment',
          {
            apiKey: process.env.SEGMENT_ANALYTICS_KEY,
            load: { cookie: { sameSite: 'None', secure: true } },
            page: true,
          },
        ]
      : null,
    './src/plugins/launchdarkly',
    './src/plugins/sentry',
  ],
  clientModules: [require.resolve('./src/client/scroll-fix.js')],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        { 
          name: 'og:image', 
          content: '/img/metamaskog.jpeg' 
        },
        {
          name: "keywords",
          content: "MetaMask, SDK, Wallet, API, Dapp, App, Connect, Delegation, Toolkit, Documentation, Smart, Account, Snaps, Infura, Services, Dashboard",
        },
      ],
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: ' │ ‎ Documentation',
        logo: {
          alt: 'MetaMask logo',
          src: 'img/metamask-logo.svg',
          srcDark: 'img/metamask-logo-dark.svg',
          width: 150,
        },
        items: [
          {
            to: 'sdk',
            label: 'SDK',
          },
          {
            to: 'wallet',
            label: 'Wallet API',
          },
          {
            to: 'delegation-toolkit',
            label: 'Delegation Toolkit',
          },
          {
            to: 'snaps',
            label: 'Snaps',
          },
          {
            to: 'services',
            label: 'Services',
          },
          {
            type: 'dropdown',
            label: 'Developer tools',
            to: 'developer-tools/dashboard',
            items: [
              {
                type: "html",
                value: helpDropdown,
              },
            ],
          },
          {
            to: 'whats-new',
            label: "What's new?",
            position: 'right',
          },
          {
            type: 'custom-navbarWallet',
            position: 'right',
            includeUrl: REF_ALLOW_LOGIN_PATH,
          },
          /* Language drop down
          {
            type: "localeDropdown",
            position: "right",
          },
          */
        ],
      },
      docs: {
        sidebar: {
          autoCollapseCategories: false,
        },
      },
      footer: {
        logo: {
          alt: 'MetaMask logo',
          src: 'img/metamask-logo.svg',
          srcDark: 'img/metamask-logo-dark.svg',
          href: 'https://metamask.io/',
          width: 250,
        },
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'SDK',
                to: '/sdk',
              },
              {
                label: 'Wallet API',
                to: '/wallet',
              },
              {
                label: 'Delegation Toolkit',
                to: '/delegation-toolkit',
              },
              {
                label: 'Snaps',
                to: '/snaps',
              },
              {
                label: 'Services',
                to: '/services',
              },
              {
                label: 'Developer dashboard',
                to: '/developer-tools/dashboard',
              },
            ],
          },
          {
            title: 'GitHub',
            items: [
              {
                label: 'Documentation GitHub',
                href: 'https://github.com/MetaMask/metamask-docs',
              },
              {
                label: 'MetaMask wallet GitHub',
                href: 'https://github.com/MetaMask/metamask-extension/',
              },
              {
                label: 'MetaMask SDK GitHub',
                href: 'https://github.com/MetaMask/metamask-sdk/',
              },
              {
                label: 'MetaMask Mobile GitHub',
                href: 'https://github.com/MetaMask/metamask-mobile',
              },
              {
                label: 'Snaps GitHub',
                href: 'https://github.com/MetaMask/snaps-monorepo',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Faucet',
                to: '/developer-tools/faucet',
              },
              {
                label: 'MetaMask Developer',
                href: 'https://developer.metamask.io/login',
              },
              {
                label: 'Consensys Discord',
                href: 'https://discord.gg/consensys',
              },
              {
                label: 'Contribute to MetaMask',
                href: 'https://github.com/MetaMask/metamask-extension/blob/develop/docs/README.md',
              },
              {
                label: 'Contribute to the docs',
                href: 'https://github.com/MetaMask/metamask-docs/blob/main/CONTRIBUTING.md',
              },
              {
                label: 'MetaMask user support',
                href: 'https://support.metamask.io/',
              },
            ],
          },
          {
            title: 'Legal',
            items: [
              {
                label: 'Privacy Policy',
                href: 'https://consensys.net/privacy-policy/',
              },
              {
                label: 'Terms of Use',
                href: 'https://consensys.net/terms-of-use/',
              },
              {
                label: 'Contributor License Agreement',
                href: 'https://metamask.io/cla/',
              },
              {
                html: "<button id='manage-cookie-btn'>Manage cookies</button>",
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} MetaMask • A Consensys Formation`,
      },
      prism: {
        theme: codeTheme,
        additionalLanguages: ['csharp', 'gradle', 'bash', 'json'],
        magicComments: [
          {
            className: "git-diff-remove",
            line: "remove-next-line",
            block: { start: "remove-start", end: "remove-end" },
          },
          {
            className: "git-diff-add",
            line: "add-next-line",
            block: { start: "add-start", end: "add-end" },
          },
        ],
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'AWX4QVM59R',

        // Public API key: it is safe to commit it
        apiKey: '861f327c200a8eab62a28ee1396f90de',

        indexName: 'mm--v2-staging',

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: "external\\.com|domain\\.com",

        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        replaceSearchResultPathname: {
          from: '/',
          to: process.env.DEST || '/',
        },

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        //... other Algolia params
      },
      mermaid: {
        options: {
          fontFamily: 'arial, verdana, sans-serif;',
          wrap: true,
          securityLevel: 'loose',
          sequence: {
            diagramMarginX: 25,
            diagramMarginY: 25,
          },
          flowchart: {
            diagramPadding: 5,
            nodeSpacing: 75,
          },
        },
      },
      announcementBar: {
        id: 'support_us',
        content:
          '<span style="font-weight: 600">NEW!</span> Build embedded wallets with MetaMask using the <a target="_blank" rel="noopener noreferrer" href="https://web3auth.io/docs">Embedded Wallets SDK (Web3Auth)</a>. Instantly onboard users with social logins, passkeys, and more.',
        isCloseable: false,
      },
    }),
}

module.exports = config
