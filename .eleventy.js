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

// uncomment when all ready
  // eleventyConfig.addPlugin(pageAssetsPlugin, {
  //     mode: "parse",
  //     postsMatching: "src/pages/(articles/*/*.(html|md)|decouverte/*/*.(html|md)||decouverte/*/*/*.(html|md))",
  //     recursive: true,
  //     hashAssets: false,
  // });

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
