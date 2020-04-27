#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
CFG_DIR="$SCRIPT_DIR/../etc"
LIBS_DIR="$SCRIPT_DIR/libs";
DEPLOY_DIR_NAME="";
DEPLOY_DIR="$SCRIPT_DIR/../$DEPLOY_DIR_NAME";
BUILD_DIR_NAME="builds";
BUILD_DIR="$SCRIPT_DIR/../$BUILD_DIR_NAME";
ARCHIVE_EXT=".tar.gz";
DEFAULT_ENV="production"
. $LIBS_DIR/shini.sh
__shini_parsed ()
{
    if [ "$1" == "$ENV" ]; then
 export $2="$3";
    fi;
}

# PASSWORD

PASS_CMD_PREFIX=""
PASS_FILENAME=$SCRIPT_DIR/pass.txt
if [ -e $PASS_FILENAME ]; then
PASS=$(head -n 1 $PASS_FILENAME);

L=`echo $PASS | awk '{print length}'`;

if [ "$L" = "0" ]; then
  echo "Empty pass file given!"
  else
    echo "The pass file exists, password from this file will be appended to all ssh commands!"
    PASS_CMD_PREFIX="sshpass -p ${PASS}"
  fi;
fi;

# ENVironment
echo "Type an evnvironment followed by [ENTER] (default \"$DEFAULT_ENV\"): ";
read ENV;
if [ "$ENV" == "" ]; then
    ENV=$DEFAULT_ENV;
fi;

# REV NUM
echo "Type a revision number, followed by [ENTER]: ";
read REV;

shini_parse "$CFG_DIR/ssh-deploy.ini";
if [ -z "$PROJECT_NAME" ]; then
 echo "Wrong environment name given: its not defined in ssh-deploy.ini";
 exit 1;
fi;

if [ "$REV" == "" ]; then

    ARCHIVE_FILE_NAME=`ls -t $BUILD_DIR | head -n 1`
    echo "Empty revision number given, will be attempt to deploy _newest_ file from builds directory ${ARCHIVE_FILE_NAME} (be careful!)"
    ARCHIVE_FILE="$BUILD_DIR/$ARCHIVE_FILE_NAME";

    echo "Is it okay with ${ARCHIVE_FILE_NAME}?"
    read CONFIRM;

    if [ "$CONFIRM" != "y" ]; then
       echo "User has canceled the operation, exiting"
       exit 1;
    fi;
else
   ARCHIVE_FILE_NAME="$PROJECT_NAME-$ENV-$REV$ARCHIVE_EXT"
   ARCHIVE_FILE="$BUILD_DIR/$ARCHIVE_FILE_NAME";

fi;

if [ ! -e "$ARCHIVE_FILE" ]; then
    echo "The specified archive $ARCHIVE_FILE is not exists"
    exit 1;
fi;

echo "Okay, will deploy $ARCHIVE_FILE into $REMOTE_DIR.";
echo "Then we will clean contents of $REMOTE_DIR and deploying...";
echo "We will run ON THE REMOTE server:"
echo "rm -rf $REMOTE_DIR/*"
echo "And then:"
echo "scp $ARCHIVE_FILE $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR";
echo "Is this okay?"
read CONFIRM;

if [ "$CONFIRM" != "y" ]; then
    echo "User has canceled the operation, exiting"
    exit 1;
fi;
$PASS_CMD_PREFIX ssh $REMOTE_USER@$REMOTE_HOST REMOTE_DIR=$REMOTE_DIR ARCHIVE_FILE_NAME=$ARCHIVE_FILE_NAME 'bash -s' <<'ENDSSH'
rm -rf $REMOTE_DIR/*
ENDSSH

echo "Uploading archive $ARCHIVE_FILE into $REMOTE_DIR...";

$PASS_CMD_PREFIX scp $ARCHIVE_FILE $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR

$PASS_CMD_PREFIX ssh $REMOTE_USER@$REMOTE_HOST REMOTE_DIR=$REMOTE_DIR ARCHIVE_FILE_NAME=$ARCHIVE_FILE_NAME 'bash -s' <<'ENDSSH'
echo "Unpacking..."
echo "run:"
echo "tar --strip-components=2 -C $REMOTE_DIR -xvzf $REMOTE_DIR/$ARCHIVE_FILE_NAME"
tar --strip-components=2 -C $REMOTE_DIR -xvzf $REMOTE_DIR/$ARCHIVE_FILE_NAME
rm $REMOTE_DIR/$ARCHIVE_FILE_NAME
ENDSSH

if [ ! -z "$JSON_SERVER_CMD" ]; then

$PASS_CMD_PREFIX ssh $REMOTE_USER@$REMOTE_HOST REMOTE_DIR=$REMOTE_DIR JSON_SERVER_CMD=$JSON_SERVER_CMD JSON_SERVER_DB=$JSON_SERVER_DB JSON_SERVER_PORT=$JSON_SERVER_PORT 'bash -s' <<'ENDSSH'
echo "Killing all instances listens for the port $JSON_SERVER_PORT & launching the dev json-server"
echo "run:"
echo "$JSON_SERVER_CMD --watch $REMOTE_DIR/$JSON_SERVER_DB 2>&1 < /dev/null &"
kill $(lsof -t -i:$JSON_SERVER_PORT)
$JSON_SERVER_CMD --watch $REMOTE_DIR/$JSON_SERVER_DB --port $JSON_SERVER_PORT 2>&1 < /dev/null &
ENDSSH
fi;

echo "All done!";
exit 0;
