const path = require("path");
const pageAssetsPlugin = require('eleventy-plugin-page-assets');
const format = require('date-fns/format');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const fs = require("fs");
const Image = require("@11ty/eleventy-img");
const CleanCSS = require("clean-css");
const { minify } = require("terser");
const { minify: minify_html } = require("html-minifier-terser");
const searchFilter = require("./src/filters/searchFilter");

const NOT_FOUND_PATH = "_site/404.html";
const IS_PROD = typeof process.env.ENVIRONMENT === "string" && process.env.ENVIRONMENT === "prod";

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

  // content filter for search
  eleventyConfig.addFilter("search", searchFilter);
  // collection for search
  eleventyConfig.addCollection("indexable", collection => {
    const collectionDecouverte = collection.getFilteredByGlob("./src/pages/decouverte/**/*.html");
    const collectionDecouverteMd = collection.getFilteredByGlob("./src/pages/decouverte/**/*.md");
    const collectionArticles = collection.getFilteredByGlob("./src/pages/articles/**/*.html");
    const collectionArticlesMd = collection.getFilteredByGlob("./src/pages/articles/**/*.md");
    return [...collectionDecouverte, ...collectionDecouverteMd, ...collectionArticles, ...collectionArticlesMd];
  });

  // rss plugin https://www.11ty.dev/docs/plugins/rss/
  eleventyConfig.addPlugin(pluginRss);

  // Short codes
  // Get the current year as {% year %}
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // fnac affiliate
  eleventyConfig.addShortcode("fnac", (ref, link, align = "left") => `<a href="https://www.awin1.com/cread.php?awinmid=12665&awinaffid=297165&clickref=${ref}&ued=${link}" class="boutonfnac ${align}" rel="nofollow, sponsored">achetez sur</a>`);

  // images
  eleventyConfig.addShortcode("Image", async (page, src, alt, loading) => {
    if (!alt) {
      throw new Error(`Missing \`alt\` on myImage from: ${src} on ${page.data.title}`);
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
    urlPath.splice(0, 2)
    urlPath = "/" + urlPath.join("/");

    let options = {
      widths: [380, 450, 640, 764],
      formats: ["webp"],
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
      sizes: '(max-width: 764px) 70vw, 764px',
      loading: loading || "lazy",
      decoding: "async",
    }

    // get metadata
    let metadata = Image.statsSync(srcImage, options)  
    return Image.generateHTML(metadata, imageAttributes)
  });

  // images thumbnails of pages
  eleventyConfig.addShortcode("thumb", (page, size) => {
    if (! page?.data?.image) return "";
    const alt = page.data.imagealt || page.data.title || illustration;
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
    urlPath.splice(0, 2)
    urlPath = "/" + urlPath.join("/");

    let options = {
      widths: [size],
      formats: ["webp"],
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
      loading: "lazy",
      sizes: size+"px",
      decoding: "async",
    };

    // get metadata even if the images are not fully generated yet
    let metadata = Image.statsSync(srcImage, options);
    return Image.generateHTML(metadata, imageAttributes);
  });

  // images thumbnails for gouzou
  eleventyConfig.addShortcode("gzthumb", (filename, alt) => {
    if (!filename) return "";
    const THUMB = 130
    const FULL = 650; // should we resize also big images (TODO)
    const src = filename;
    const inputFolder = "./src/assets/img/gouzou/";
    const srcImage = inputFolder+src;
    const outputFolder = "./_site/img/gouzou/thumb/";
    const urlPath = "/img/gouzou/thumb/";


    let options = {
      widths: [THUMB],
      formats: ["webp"],
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
      sizes: THUMB+"px",
      loading: "lazy",
      decoding: "async",
      class: "cssbox_thumb",
      onclick:"rewrite_url('{{gouzou.title}}')"
    };
    // get metadata even if the images are not fully generated yet
    let metadata = Image.statsSync(srcImage, options);
    return Image.generateHTML(metadata, imageAttributes);
  });

  eleventyConfig.addNunjucksAsyncShortcode("getOGImageUri", async (page, src) => {
    if (!src) return "/img/tete-2006.png";

    let inputFolder = page.inputPath.split("/")
    inputFolder.pop()
    inputFolder = inputFolder.join("/");
    const imageSrc = inputFolder+"/"+src;

    let urlPath = page.outputPath.split("/")
    urlPath.pop()
    urlPath.shift()
    urlPath = "/" + urlPath.join("/");

    // TODO: limit to a certain max height 200x200 min 1200×1200 max
    let metadata = await Image(imageSrc, {
      widths: [1200],
      formats: ["webp", "jpeg"],
      urlPath: urlPath,
      outputDir: `./_site/${page.url}`,
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
        return `${name}-og.${format}`;
      }
    })

    const data = metadata.webp[0]
    // data.url might be /blog/hello-world/xfO_genLg4-600.jpeg
    return data.url
  })

  // COPY IMAGES LINKED in PAGES
  // this is not regexp but Glob patern (picomatch https://npm.devtool.tech/picomatch)
  eleventyConfig.addPlugin(pageAssetsPlugin, {
      mode: "parse",
      postsMatching: "src/pages/{decouverte,articles}{/*,/**/!(gouzou)/}*.{md,html}",
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

  // filter to minify inline css
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // filter to minify inline js
  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (code, callback) {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.error("Terser error: ", err);
      // Fail gracefully.
      callback(null, code);
    }
  });

  // filter to minify css output files
  eleventyConfig.addTransform("cssmin", async function(source, output_path) {
    if(!output_path.endsWith(".css") || !IS_PROD) return source;

    const result = new CleanCSS({
        level: 2
    }).minify(source).styles.trim();
    console.log(`MINIFY ${output_path}`, source.length, `→`, result.length, `(${((1 - (result.length / source.length)) * 100).toFixed(2)}% reduction)`);
    return result;
  });

  // minify html output files
  eleventyConfig.addTransform("htmlmin", async function (source, output_path) {
    
    if(output_path.endsWith("feed.xml")) {
      // remove comments from atom feed
      const pattern = /&lt;!--([\s\S]*?)--&gt;/g;
      const cleanSource = source.replace(pattern, "")
      // minify
      const rssResult = await minify_html(cleanSource, {
        collapseWhitespace: true,
        preserveLineBreaks: true,
        conservativeCollapse: true,
        continueOnParseError: true,
        keepClosingSlash: true,
        quoteCharacter: `"`,
        removeComments: true
      });
      console.log(`CLEAN ATOM FEED ${output_path}`, source.length, `→`, rssResult.length, `(${((1 - (rssResult.length / source.length)) * 100).toFixed(2)}% reduction)`);
      return rssResult;
    }

    if(!output_path.endsWith(".html") || !IS_PROD) return source;

    const result = await minify_html(source, {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      conservativeCollapse: true,
      continueOnParseError: true,
      decodeEntities: true,
      keepClosingSlash: true,
      minifyCSS: true,
      quoteCharacter: `"`,
      removeComments: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      sortAttributes: true,
      sortClassName: true,
      useShortDoctype: true
    });
    console.log(`MINIFY ${output_path}`, source.length, `→`, result.length, `(${((1 - (result.length / source.length)) * 100).toFixed(2)}% reduction)`);
    return result;
  });

  // Pass-through files
  eleventyConfig.addPassthroughCopy({ 'src/assets/public': '/' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/img': '/img' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/fonts': '/fonts' });
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
      markdownTemplateEngine: 'njk',
  };

};
