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
          { text: '🔮 Introduction', link: '/getting-started/introduction' },
          { text: '📦 Installation', link: '/getting-started/installation' },
          { text: '📜 Naming', link: '/getting-started/naming' },
        ],
      },
      {
        text: '🧰 Core Functions',
        items: [
          { text: 'traceFabric', link: '/core-functions/traceFabric' },
          { text: 'applyTrace', link: '/core-functions/applyTrace' },
          { text: 'deepClone', link: '/core-functions/deepClone' },
        ],
      },
      {
        text: 'Check if value traced',
        items: [
          { text: 'isTraced', link: '/check-if-value-traced/isTraced' },
          { text: 'isTracedFabric', link: '/check-if-value-traced/isTracedFabric' },
          { text: 'isTracedValue', link: '/check-if-value-traced/isTracedValue' },
        ],
      },
      {
        text: 'Ignore tracing',
        items: [
          { text: 'isTracing', link: '/ignore-tracing/isTracing' },
          { text: 'withoutTracing', link: '/ignore-tracing/withoutTracing' },
        ],
      },
      {
        text: '🚀 Examples & Quickstarts',
        items: [
          { text: 'WebSockets + Bun', link: '/examples/webSocket&Bun' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/traced-fabric/core' },
    ],
  },
});
