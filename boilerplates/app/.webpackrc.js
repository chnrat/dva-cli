const path = require('path');
const { name, version } = require('./package.json');

export default {
  entry: 'src/index.js',
  outputPath: 'build',
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
  ],
  env: {
    development: {
      extraBabelPlugins: [
        'dva-hmr',
      ],
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  html: {
    template: './src/index.ejs',
  },
  publicPath: process.env.NODE_ENV === 'production' ? `/` : '/',

  proxy: {
    "/api": {
      target: "http://campus.gjyc.org.cn/",
      changeOrigin: true
    }
  }
};
