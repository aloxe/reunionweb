const pageAssetsPlugin = require('eleventy-plugin-page-assets');

module.exports = (eleventyConfig) => {

  // Pass-through files
  eleventyConfig.addPassthroughCopy({ 'src/assets/public': '/' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/img': '/img' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/fonts': '/fonts' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/css': '/css' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/js': '/js' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/api': '/api' });

  // Get the current year as {% year %}
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // copy linked images with pages
  eleventyConfig.addPlugin(pageAssetsPlugin, {
      mode: "parse",
      postsMatching: "src/pages/(articles/*/*.(html|md)|/decouverte/((?!gouzou/)[a-z]*/)*[a-zA-Z-_]*\.(html|md))",
      recursive: true,
      hashAssets: false,
  });

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
