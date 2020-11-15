#!/usr/bin/env sh

git add -A
git commit -m $1
git push git@github.com:Awn-Alice/book-cabin.git master
git push git@gitee.com:AColdFish/book-cabin.git master