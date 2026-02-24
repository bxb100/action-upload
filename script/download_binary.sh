#!/bin/sh

set -e

mkdir -p temp
mkdir -p dist

OPENDAL_VERSION=0.45.1

# download all binary files
npm pack @opendal/lib-win32-x64-msvc@"$OPENDAL_VERSION" --pack-destination temp
npm pack @opendal/lib-linux-x64-gnu@"$OPENDAL_VERSION" --pack-destination temp
npm pack @opendal/lib-darwin-x64@"$OPENDAL_VERSION" --pack-destination temp
npm pack @opendal/lib-darwin-arm64@"$OPENDAL_VERSION" --pack-destination temp

# extract all binary files
for i in temp/opendal-lib-*.tgz;do
  tar -xzf "$i" -C temp;
 done

# copy all binary files to dist
cp ./temp/package/opendal.*.node ./dist

# remove all download files
rm -rf temp

