import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Traced Fabric',
  description: 'Traced Fabric description ?',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: '🔮 Introduction', link: '/gettingStarted/introduction' },
          { text: '📦 Installation', link: '/gettingStarted/installation' },
        ],
      },
      {
        text: 'Core Functionality',
        items: [
          { text: '🔧 traceFabric(...)', link: '/coreFunctionality/traceFabric' },
          { text: '🔧 applyTrace(...)', link: '/coreFunctionality/applyTrace' },
          { text: '🔧 deepClone(...)', link: '/coreFunctionality/deepClone' },
        ],
      },
      {
        text: 'Examples & Quickstarts',
        items: [
          { text: '🚀 WebSockets + Bun', link: '/examples/webSocket&Bun' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/traced-fabric/core' },
    ],
  },
});
