const path = require("path");
const pageAssetsPlugin = require('eleventy-plugin-page-assets');
const format = require('date-fns/format');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const fs = require("fs");
const Image = require("@11ty/eleventy-img");
const CleanCSS = require("clean-css");
const { minify } = require("terser");

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

  // images
  eleventyConfig.addShortcode("Image", async (page, src, alt) => {
    if (!alt) {
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }

    let inputFolder = page.inputPath.split("/")
    inputFolder.pop()
    inputFolder = inputFolder.join("/");
    const srcImage = inputFolder+"/"+src;

    let outputFolder = page.outputPath.split("/")
    outputFolder.pop()
    outputFolder = outputFolder.join("/");

    let urlPath = page.outputPath.split("/")
    urlPath.pop()
    urlPath.shift()
    urlPath = "/" + urlPath.join("/");

    let options = {
      widths: [380, 450, 640, 764],
      formats: ["jpeg"],
      urlPath: urlPath,
      outputDir: outputFolder,
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
        return `${name}-${width}w.${format}`;
      }
    }

    // generate images
    Image(srcImage, options)

    let imageAttributes = {
      alt,
      sizes: '(max-width: 400px) 380px, (max-width: 470px) 450px, (max-width: 841px) 640px, (max-width: 1100px) 640px, 764px"',
      loading: "lazy",
      decoding: "async",
    }
    // get metadata
    let metadata = Image.statsSync(srcImage, options)
    return Image.generateHTML(metadata, imageAttributes)
  });

  // images thumbnails
  eleventyConfig.addShortcode("thumb", (page, size) => {
    if (! page?.data?.image) return "";
    const alt = page.data.title || illustration;
    const src = page.data.image;

    let inputFolder = page.inputPath.split("/")
    inputFolder.pop()
    inputFolder = inputFolder.join("/");
    const srcImage = inputFolder+"/"+src;

    let outputFolder = page.outputPath.split("/")
    outputFolder.pop()
    outputFolder = outputFolder.join("/");

    let urlPath = page.outputPath.split("/")
    urlPath.pop()
    urlPath.shift()
    urlPath = "/" + urlPath.join("/");

    let options = {
      widths: [size],
      formats: ["jpeg"],
      urlPath: urlPath,
      outputDir: outputFolder,
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
        return `${name}-${width}w.${format}`;
      }
    };

    // generate images
    Image(srcImage, options)

    let imageAttributes = {
      alt,
      sizes: size+"px",
      loading: "lazy",
      decoding: "async",
    };
    // get metadata even if the images are not fully generated yet
    let metadata = Image.statsSync(srcImage, options);
    return Image.generateHTML(metadata, imageAttributes);
  });


  // copy linked images with pages
  // this is not regexp but Glob patern (picomatch https://npm.devtool.tech/picomatch)
  eleventyConfig.addPlugin(pageAssetsPlugin, {
      mode: "parse",
      postsMatching: "src/pages/{decouverte,articles}{/*,/**/!(gouzou)/}*.{html,md}",
      recursive: false,
      hashAssets: false,
  });

  // add `date` filter thanks to format plugin
  eleventyConfig.addFilter('date', function (date, dateFormat) {
    return format(date, dateFormat);
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

  eleventyConfig.addFilter("getCategoriesWithLiens", (categories = [], liens = [], allCategories = []) => {
    const categoriesInLiens = liens.map(l => l.parent);
    const categorieParents = allCategories.map(c => c.parent);
    let selectedl = categories.filter(a => categoriesInLiens.includes(a.slug));
    let selectedc = categories.filter(a => categorieParents.includes(a.slug));
    return [...new Set([...selectedl, ...selectedc])];
  });

  // filter to minify css
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // filter to minify js
  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (code, callback ) {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.error("Terser error: ", err);
      // Fail gracefully.
      callback(null, code);
    }
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
