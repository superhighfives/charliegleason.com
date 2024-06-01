#!/bin/bash

PARAMS=('-m 6 -q 70 -mt -af -progress')
GIF_PARAMS=('-m 6 -q 100 -mt')

if [ $# -ne 0 ]; then
	PARAMS=$@;
fi

cd $(pwd)

shopt -s nullglob nocaseglob extglob

find "public/assets" -type f \( -iname \*.jpg -o -iname \*.png \) | \
while read file ; do
    echo "processing ${file}"
    dir=$(dirname "$file")
    filename_with_ext=$(basename "$file")
    final_dir=$(basename "$dir")
    if [ $final_dir = "originals" ]; then
        cwebp $PARAMS "$file" -o "$(dirname "$dir")/${filename_with_ext%.*}".webp;
    fi
done

find "public/assets" -type f \( -iname \banner.jpg \) | \
while read file ; do
    echo "processing ${file}"
    dir=$(dirname "$file")
    filename_with_ext=$(basename "$file")
    final_dir=$(basename "$dir")
    if [ $final_dir = "originals" ]; then
        cp "$file" "$(dirname "$dir")/${filename_with_ext%.*}".jpg;
        jpegoptim --max=75 -o "$(dirname "$dir")/${filename_with_ext%.*}".jpg
    fi
done
