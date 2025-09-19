const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    proxy: {
      '/V1/':{
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite:{
          '^/api': '/api'
        }
      }
    }
  }
})
