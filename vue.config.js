const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  chainWebpack: (config) => {
    config.plugin("monaco-editor").use(MonacoWebpackPlugin, [
      {
        // Languages are loaded on demand at runtime
        languages: ["json"],
      },
    ]);

    config.plugin("html").tag((args) => {
      args[0].title = "Windy";
      return args;
    });
  },
};

module.exports = {
  devServer: {
    host: "localhost",
    open: true,
    port: 8080,
    overlay: {
      warnings: false,
      errors: false,
    },
    proxy: {
      "/api": {
        target: "http://localhost:9768",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
