import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Traced Fabric',
  description: 'Traced Fabric description ?',
  base: '/core/',
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
        text: 'Core Functions',
        items: [
          { text: '🔧 traceFabric(...)', link: '/coreFunctions/traceFabric' },
          { text: '🔧 applyTrace(...)', link: '/coreFunctions/applyTrace' },
          { text: '🔧 deepClone(...)', link: '/coreFunctions/deepClone' },
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
