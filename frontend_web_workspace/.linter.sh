#!/bin/bash
cd /home/kavia/workspace/code-generation/recipevault-31680-89a4b26f/frontend_web_workspace/frontend_web
npx eslint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

