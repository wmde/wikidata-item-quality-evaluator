module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Itemset Quality Tool | Wikidata";
      return args;
    });
  }
};
