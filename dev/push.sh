#!/bin/bash

release_dir="dev/"

# validate release type
if [ -z "$1" ]; then
  echo "Please specify release type. (major, minor or patch)"
  exit 1
fi
release_type=$1
if [ "$release_type" != "major" ] && [ "$release_type" != "minor" ] && [ "$release_type" != "patch" ]; then
  echo "Invalid release type. Valid release types are major, minor and patch. You specified $release_type"
  exit 1
fi

# commit message
if [ -z "$2" ]; then
  echo "Please specify a commit message."
  exit 1
fi
message=$2

# branch
branch=master
if [ ! -z "$3" ]; then
  branch=$3
fi

# generate the next release tag
next=$(node ${release_dir}getNextReleaseNum.js $release_type)
if [[ $next == "none" ]]; then
  echo "Couldn't compute the next release number."
  exit 1
fi

echo "Updating remote codebase. $release_type on branch $branch"

# check if there are changes
if [[ ! -z $(git status -s) ]]; then
  # push
  echo "New release tag computed as $next"
  git tag -a "$next" -m "$message"
  git add .
  git commit -m "$message"
  git push origin $branch --tags

  echo "Codebase updated successfully."
  exit 0
else
  echo "No changes detected by GIT. Nothing to push. Exiting."
  exit 0
fi
