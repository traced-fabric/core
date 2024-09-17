import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
// https://vitepress.dev/guide/custom-theme
import './style.css';

export default {
  extends: DefaultTheme,
} satisfies Theme;
