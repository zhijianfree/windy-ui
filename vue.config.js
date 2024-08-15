// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  chainWebpack: (config) => {
    // config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
    //   {
    //     // Languages are loaded on demand at runtime
    //     languages: ['json'],
    //   },
    // ])
    // config.module
    //   .rule('babel')
    //   .test(/\.js$/)
    //   .exclude.add(/node_modules\/(?!monaco-editor)/)
    //   .end()
    //   .use('babel-loader')
    //   .loader('babel-loader')
    //   .options({
    //     presets: ['@babel/preset-env'],
    //     plugins: ['@babel/plugin-proposal-class-properties'],
    //   })

    config.plugin('html').tap((args) => {
      args[0].title = 'Windy'
      return args
    })
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          strictMath: true,
        },
      },
    },
  },
  devServer: {
    host: 'localhost',
    open: true,
    port: 8080,
    overlay: {
      warnings: false,
      errors: false,
    },
    proxy: {
      '/api': {
        // target: 'http://10.202.244.79:9768',
        // target: 'http://192.168.1.124:9768',
        target: 'http://localhost:9768',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
}
