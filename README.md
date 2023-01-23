# reunionweb sur 11ty

[Eleventy](https://11ty.dev) website

1. `npm install -g @11ty/eleventy`
1. Preview project: `npx @11ty/eleventy --serve` or `eleventy --serve`

# Gouzou Gallery

new Gouzou images can be added in assets/img/gouzou
thumbnails will be generated bu running `node gouzouthumb.js`
inspired by https://www.raymondcamden.com/2021/04/07/building-a-simple-image-gallery-with-eleventy
meta information should be added in `src/data/gouzoulist.json`

# Liens list

Links are sorted by category in `src/data/categories.json` and all information in `src/data/liens.json` where the category is referenced by its slug with key `parent`.
