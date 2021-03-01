module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Item Quality Evaluator | Wikidata";
      return args;
    });
  }
};
