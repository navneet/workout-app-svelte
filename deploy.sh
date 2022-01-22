#!/bin/zsh

$PWD/build.sh

git add .
git commit -m "Automated Commit on Deploy"
git push

cd ../site

# Call gh push to do its thing.
echo 'Calling gh_push in local repo for navneet.github.io'
$PWD/gh_push.sh