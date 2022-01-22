#!/bin/zsh

$PWD/build.sh

git add .
git commit -m "Automated Commit on Deploy"
git push

cd ../api

# Call gh push to do its thing.
$PWD/gh_push.sh