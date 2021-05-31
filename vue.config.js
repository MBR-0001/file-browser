module.exports = {
  chainWebpack: config => {
    config
      .plugin("html")
      .tap(args => {
        args[0].title = "Bucket Item Manager";
        return args;
      });
  },
  productionSourceMap: false,
  publicPath: "/bucket-items"
};
