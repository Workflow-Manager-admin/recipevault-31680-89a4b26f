#!/bin/bash
cd /home/kavia/workspace/code-generation/recipevault-31680-89a4b26f/backend_api_workspace/backend_api
source venv/bin/activate
flake8 .
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

