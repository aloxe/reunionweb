const Image = require("@11ty/eleventy-img");
const glob = require("glob-promise");

const THUMB = 130;
const FULL = 650;

(async () => {

	let options = {
		widths: [THUMB,FULL],
		formats: ['jpg'],
		filenameFormat:function(id, src, width, format, options) {
			let origFilename = src.split('/').pop();
			//strip off the file type, this could probably be one line of fancier JS
			let parts = origFilename.split('.');
			parts.pop();
			origFilename = parts.join('.');

			if(width === THUMB) return `../src/assets/img/gouzou/thumb-${origFilename}.${format}`;
			else return `${origFilename}.${format}`;
		}
	};

	let files = await glob('./src/assets/img/gouzou/*.{jpg,jpeg,png,gif}');
    let images = files.filter(f => { // Filter out to non thumb-
        return f.indexOf('./src/assets/img/gouzou/thumb-') !== 0;
    });
	for(const f of images) {
        // thumbnails have .jpeg extention
        let fthumb = f.replace(/\/gouzou\//g, "/gouzou/thumb-").replace(/\.[^/.]+$/, "")+".jpeg";
        if (files.indexOf(fthumb) < 1) {
            console.log(`processing ${f} ☑`);
            await Image(f, options);
            let file = f.replace(/.\/src\/assets\/img\//g, "/img/")
            let thumb = fthumb.replace(/.\/src\/assets\/img\//g, "/img/")
            console.log(`
            {
              "file": "${file}",
              "thumb": "${thumb}",
              "author": "",
              "title": "",
              "legend": "",
              "license": "",
              "url": "",
              "date": "2003-01",
              "flag": "🇷🇪"
            },
            `);
        }
	};


})();
