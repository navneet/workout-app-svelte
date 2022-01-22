#!/bin/zsh

$PWD/build_css.sh

# Build the app
svelte-kit build

# Copy the freshly minted build to the
# Github Repo folder
cp -R ./build/ ../api/webroot

# Erase the build folder.
rm -r ./build