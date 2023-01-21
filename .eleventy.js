const pageAssetsPlugin = require('eleventy-plugin-page-assets');
const format = require('date-fns/format');
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = (eleventyConfig) => {


  // rss plugin https://www.11ty.dev/docs/plugins/rss/
  eleventyConfig.addPlugin(pluginRss);

  // Get the current year as {% year %}
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // copy linked images with pages
  eleventyConfig.addPlugin(pageAssetsPlugin, {
      mode: "parse",
      postsMatching: "src/pages/(decouverte|articles)/((?!gouzou/)[0-9a-z]*/)*.(html|md)",
      recursive: false,
      hashAssets: false,
  });

  // add `date` filter thanks to format plugin
  eleventyConfig.addFilter('date', function (date, dateFormat) {
    return format(date, dateFormat)
  })

  // Filter for liens and categories
  eleventyConfig.addFilter("getLinksFromParent", (liens = [], slug = "") => {
    let selected = liens.filter(a => a.parent === slug);
    return selected;
  });

  eleventyConfig.addFilter("getCategoryFromSlug", (categories = [], slug = "") => {
    let category = categories.find(a => a.slug === slug);
    return category;
  });

  eleventyConfig.addFilter("getCategoriesFromParent", (categories = [], slug = "") => {
    let selected = categories.filter(a => a.parent === slug);
    return selected;
  });

    eleventyConfig.addFilter("getCategoriesWithLiens", (categories = [], liens = []) => {
      const categoriesInLiens = liens.map(l => l.parent);
      let selected = categories.filter(a => categoriesInLiens.includes(a.slug));
      return selected;
    });

    // Pass-through files
    eleventyConfig.addPassthroughCopy({ 'src/assets/public': '/' });
    eleventyConfig.addPassthroughCopy({ 'src/assets/img': '/img' });
    eleventyConfig.addPassthroughCopy({ 'src/assets/fonts': '/fonts' });
    eleventyConfig.addPassthroughCopy({ 'src/assets/css': '/css' });
    eleventyConfig.addPassthroughCopy({ 'src/assets/js': '/js' });
    eleventyConfig.addPassthroughCopy({ 'src/assets/api': '/api' });

  return {
      pathPrefix: "/",
      // pathPrefix: "/reunionweb/", // only for test
      dir: {
          input: 'src/pages',
          output: '_site',
          layouts: '../layouts',
          includes: '../layouts',
          data: '../data',
      },
      templateFormats: ['md', 'njk', 'jpg', 'gif', 'png', 'html'],
      markdownTemplateEngine: "njk",
  };

};
