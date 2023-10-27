#!/bin/sh

set -e

mkdir "temp"

# download all binary files
npm pack @opendal/lib-win32-x64-msvc --pack-destination temp
npm pack @opendal/lib-linux-x64-gnu --pack-destination temp
npm pack @opendal/lib-darwin-x64 --pack-destination temp
npm pack @opendal/lib-darwin-arm64 --pack-destination temp

# extract all binary files
for i in temp/opendal-lib-*.tgz;do
  tar -xzf "$i" -C temp;
 done

# copy all binary files to dist
cp ./temp/package/opendal.*.node ./dist

# remove all download files
rm -rf temp

