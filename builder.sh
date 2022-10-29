#!/bin/sh

rm -rf public

mkdir public
mkdir public/img
mkdir public/fonts
mkdir public/highlight-js
mkdir public/svg
mkdir public/video

minify index.html > public/index.html
minify physical-computing.html > public/physical-computing.html
minify index.js > public/index.js
minify style.css > public/style.css

cp favicon.png public/favicon.png
cp img/* public/img/
cp fonts/* public/fonts
cp highlight-js/* public/highlight-js
cp svg/* public/svg
cp video/* public/video
