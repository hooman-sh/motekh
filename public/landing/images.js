const imagemin 								= require('imagemin');
const imageminWebp 						= require('imagemin-webp');
const imageminJpegtran 				= require('imagemin-jpegtran');
const imageminPngquant 				= require('imagemin-pngquant');
const imageminJpegRecompress 	= require('imagemin-jpeg-recompress');

const sharp 			= require('sharp')

const imagesPath	= 'assets/images/'
const heroIn			= imagesPath + 'hero/src'
const heroOut			= imagesPath + 'hero/'

const fs = require('fs')
const gm = require('gm').subClass({imageMagick: true})

// resize and remove EXIF profile data
gm('assets/images/help/src/4.jpg')
	.resize(300)
	.quality(80)
	.write('../profile/images/help/4.jpg', function() {
		console.log("Help")
	})

// sharp('assets/images/help/src/')
// 	.resize(300)
// 	.embed()
// 	.toFile('assets/images/help/*.jpg');


imagemin([`${imagesPath}/features/src/*.{jpg,png}`], `${imagesPath}/features/`, {
	use: [
		imageminPngquant({
			quality: '65'
		})
	]
}).then(() => {
    console.log('Features');
});

imagemin([`${imagesPath}/contact/src/*.{jpg,png}`], `${imagesPath}/contact/`, {
	use: [
		imageminJpegRecompress({
			accurate: true,
			quality: true,
			max: 70
		}),
		imageminPngquant({
			quality: '65-80'
		})
	]
}).then(() => {
    console.log('Contact');
});

imagemin([`${imagesPath}/about/src/*.{jpg,png}`], `${imagesPath}/about/`, {
	use: [
		imageminJpegRecompress({
			accurate: true,
			quality: true,
			max: 70
		}),
		imageminPngquant({
			quality: '65-80'
		})
	]
}).then(() => {
    console.log('About');
});

imagemin([`${heroIn}/*.{jpg,png}`], heroOut, {
    use: [
        imageminWebp({
        	quality: 80,
        	method: 6,
        	lossless: false
        })
    ]
}).then(() => {
    console.log('Hero WebP');
});

imagemin([`${heroIn}/*.{jpg,png}`], heroOut, {
	plugins: [
		imageminJpegRecompress({
			accurate: true,
			quality: true,
			max: 70
		}),
		imageminPngquant({
			quality: '65-80'
		})
	]
}).then(files => {
	console.log('Hero JPG/PNG');
});