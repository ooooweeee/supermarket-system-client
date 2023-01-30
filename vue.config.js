const path = require('path');
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      preload: path.join(__dirname, 'public/preload.js'),
      mainProcessWatch: [path.join(__dirname, 'src/database/**/*')]
    }
  }
});
