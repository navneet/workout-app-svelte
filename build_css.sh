#!/bin/zsh

sass --no-source-map $PWD/scss/main.scss:$PWD/static/css/main.css

npx uglifycss $PWD/static/css/main.css --output $PWD/static/css/main.min.css

rm $PWD/static/css/main.css

echo 'CSS built successfully!\n'