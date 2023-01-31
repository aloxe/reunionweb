const pageAssetsPlugin = require('eleventy-plugin-page-assets');
const format = require('date-fns/format');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const fs = require("fs");

const searchFilter = require("./src/filters/searchFilter");
const NOT_FOUND_PATH = "_site/404.html";

module.exports = (eleventyConfig) => {
  // page 404 with --serve
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {

        bs.addMiddleware("*", (req, res) => {
          if (!fs.existsSync(NOT_FOUND_PATH)) {
            throw new Error(`Expected a \`${NOT_FOUND_PATH}\` file but could not find one. Did you create a 404.html template?`);
          }

          const content_404 = fs.readFileSync(NOT_FOUND_PATH);
          // Add 404 http status code in request header.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  //search filter
  eleventyConfig.addFilter("search", searchFilter);
  eleventyConfig.addCollection("indexable", collection => {
    const collectionDecouverte = collection.getFilteredByGlob("./src/pages/decouverte/**/*.html");
    const collectionArticles = collection.getFilteredByGlob("./src/pages/articles/**/*.html");
    const collectionArticlesMd = collection.getFilteredByGlob("./src/pages/articles/**/*.md");
    return [...collectionDecouverte, ...collectionArticles, ...collectionArticlesMd];
  });

  // rss plugin https://www.11ty.dev/docs/plugins/rss/
  eleventyConfig.addPlugin(pluginRss);

  // Short codes
  // Get the current year as {% year %}
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // fnac affiliate
  eleventyConfig.addShortcode("fnac", (ref, link, align = "left") => `<a href="https://www.awin1.com/cread.php?awinmid=12665&awinaffid=297165&clickref=${ref}&ued=${link}" class="boutonfnac ${align}"> 🛒 achetez sur</a>`);

  // copy linked images with pages
  // this is not regexp but Glob patern (picomatch https://npm.devtool.tech/picomatch)
  // postsMatching: "src/pages/(decouverte|articles)/((?!gouzou/)[0-9a-z.-]*/)*[0-9a-z.-]*(html|md)",
  eleventyConfig.addPlugin(pageAssetsPlugin, {
      mode: "parse",
      postsMatching: "src/pages/{decouverte,articles}{/*,/**/!(gouzou)/}*.{html,md}",
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

    eleventyConfig.addFilter("getCategoriesWithLiens", (categories = [], liens = [], allCategories = []) => {
      const categoriesInLiens = liens.map(l => l.parent);
      const categorieParents = allCategories.map(c => c.parent);
      let selectedl = categories.filter(a => categoriesInLiens.includes(a.slug));
      let selectedc = categories.filter(a => categorieParents.includes(a.slug));
      return [...new Set([...selectedl, ...selectedc])];
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
