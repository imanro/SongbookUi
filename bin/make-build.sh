#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
CFG_DIR="$SCRIPT_DIR/../etc"
LIBS_DIR="$SCRIPT_DIR/libs";
DIST_DIR="$SCRIPT_DIR/../dist";
BUILD_DIR="$SCRIPT_DIR/../builds";
DEFAULT_ENV="production"

echo "Type an environment name, followed by [ENTER] (default \"$DEFAULT_ENV\"): ";
read ENV

if [ "$ENV" == "" ]; then
    ENV=$DEFAULT_ENV;
fi;

__shini_parsed ()
{
    if [ "$1" == "$ENV" ]; then
	export $2="$3";
    fi;
}

. $LIBS_DIR/shini.sh

shini_parse "$CFG_DIR/ssh-deploy.ini";

echo "Type a revision number, followed by [ENTER]: ";
read REV

if [ "$REV" = "" ]; then
  REV=`date +%s | md5`
  echo "Empty revision name given, using a hash ${REV} instead...";
fi;

cd $SCRIPT_DIR/../

echo "Updating git version..."
node git-version.js

echo "Building for $ENV...";
ng build --configuration=$ENV

FILE_NAME="$BUILD_DIR/$PROJECT_NAME-$ENV-$REV.tar.gz";
echo "Creating $FILE_NAME"

tar -czf $FILE_NAME -C $DIST_DIR .

exit 0;
