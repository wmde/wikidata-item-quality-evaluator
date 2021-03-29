/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");

module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Item Quality Evaluator | Wikidata";
      return args;
    });
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        _: "underscore"
      })
    ]
  }
};
