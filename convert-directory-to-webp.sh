#!/bin/bash

PARAMS=('-m 6 -q 70 -mt -af -progress')
GIF_PARAMS=('-m 6 -q 100 -mt')

if [ $# -ne 0 ]; then
	PARAMS=$@;
fi

cd $(pwd)
mkdir -p webp

shopt -s nullglob nocaseglob extglob

for FILE in *.@(jpg|jpeg|tif|tiff|png); do 
    cwebp $PARAMS "$FILE" -o "webp/${FILE%.*}".webp;
done

for FILE in *.@(gif); do 
    gif2webp $GIF_PARAMS "$FILE" -o "webp/${FILE%.*}".webp;
done
