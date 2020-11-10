#!/bin/bash

# exit if not on CIRCLE
[[ -z "$CIRCLECI" ]] && { echo "Not Circle CI, exiting" ; exit 1; }

BUCKET_PREFIX="$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME/$CIRCLE_BRANCH"

cp demo/index.html demo/dist/index.html

aws s3 sync --acl public-read demo/dist "s3://builds.flowplayer.com/$BUCKET_PREFIX/"