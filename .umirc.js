import { defineConfig } from 'umi';
let base = 'http://192.168.31.15:8006/';

export default defineConfig({
  publicPath: '/static/',
  title: '管理系统',
  theme: {
    'primary-color': '#009688',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  antd: {},
  proxy: {
    '/api': {
      target: base + '/api',
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
    },
    '/mod/account': {
      target: base + '/mod/account',
      pathRewrite: { '^/mod/account': '' },
      changeOrigin: true,
    },
  },
});
