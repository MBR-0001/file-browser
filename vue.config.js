module.exports = {
  chainWebpack: config => {
    config
      .plugin("html")
      .tap(args => {
        args[0].title = "File Browser";
        return args;
      });
  },
  productionSourceMap: false,
  publicPath: "/file-browser"
};
