const elasticlunr = require("elasticlunr");

module.exports = function (collection) {
  // what fields we'd like our index to consist of
  var index = elasticlunr(function () {
    // this.addField("title");
    // this.addField("description");
    this.addField("content");
    this.setRef("id");
  });

  // loop through each page and add it to the index
  collection.forEach( (page) => {
    // const frontMatter = await page.template.read(); // read is async since 11ty 3.0
    index.addDoc({
      id: page.url,
      // title: frontMatter.data.title,
      // description: frontMatter.data.description,
      content: page.templateContent.replace(/<[^>]*>?|\r\n/gm, ' ').trim(),
    });
  });

  return index.toJSON();
};
