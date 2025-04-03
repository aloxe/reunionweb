const elasticlunr = require("elasticlunr");

module.exports = function (collection) {
  // what fields we'd like our index to consist of
  var index = elasticlunr(function () {
    this.addField("title");
    this.addField("description");
    this.addField("content");
    this.setRef("id");
  });

  // loop through each page and add it to the index
  collection.forEach( (page) => {
    index.addDoc({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      content: page.data.page.rawInput.replace(/<[^>]*>?|\r\n/gm, ' ').trim(),
    });
  });

  return index.toJSON();
};
