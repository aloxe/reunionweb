function getUrl(slug, list) {
  for (let item of list) {
    if (item.slug === slug) {
      if (item.parent !== 0) {
        return getUrl(item.parent, list) + item.slug + "/";
      } else {
        return "/" + item.slug + "/";
      }
    }
  }
}

module.exports = {
  eleventyComputed: {
    permalink: data => getUrl(data.categories[data.pagination.pageNumber].slug, data.categories),
    title: data => (data.pagination.pageNumber === 0) ? data.categories[data.pagination.pageNumber].title : "Sites web réunionnais : " + data.categories[data.pagination.pageNumber].title,
    pagetitle: data => data.categories[data.pagination.pageNumber].title,
    description: data => data.categories[data.pagination.pageNumber].description,
    slug: data => data.categories[data.pagination.pageNumber].slug
  }
};
