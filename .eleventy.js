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

  return {
      pathPrefix: "/reunionweb/", // only for test
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
