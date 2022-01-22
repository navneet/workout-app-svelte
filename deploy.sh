#!/bin/zsh

$PWD/build_css.sh

# Build the app
svelte-kit build

# Copy the freshly minted build to the
# Github Repo folder
cp -R ./build/ ../site

# Erase the build folder.
rm -r ./build

cd ../site

# Call gh push to do its thing.
echo 'Calling gh_push in local repo'
$PWD/gh_push.sh