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
        text: '🧰 Core Functions',
        items: [
          { text: '🔧 traceFabric(...)', link: '/coreFunctions/traceFabric' },
          { text: '🔧 applyTrace(...)', link: '/coreFunctions/applyTrace' },
          { text: '🔧 deepClone(...)', link: '/coreFunctions/deepClone' },
        ],
      },
      {
        text: '🧰 Utility Functions',
        items: [
          { text: '🔧 disableTracing(...)', link: '/utilityFunctions/disableTracing' },
          { text: '🔧 isStructure(...)', link: '/utilityFunctions/isStructure' },
          { text: '🔧 isTraced(...)', link: '/utilityFunctions/isTraced' },
          { text: '🔧 iterableWeakMap(...)', link: '/utilityFunctions/iterableWeakMap' },
          { text: '🔧 withoutAssigning(...)', link: '/utilityFunctions/withoutAssigning' },
          { text: '🔧 withoutTracing(...)', link: '/utilityFunctions/withoutTracing' },
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
