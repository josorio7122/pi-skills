#!/usr/bin/env bash
set -euo pipefail

if ! command -v npx >/dev/null 2>&1; then
  echo "Error: npx is required but not found on PATH." >&2
  exit 1
fi

has_session_flag="false"
for arg in "$@"; do
  case "$arg" in
    --session|--session=*)
      has_session_flag="true"
      break
      ;;
  esac
done

# Check if @playwright/cli is available
if ! npx --no-install playwright-cli --version >/dev/null 2>&1; then
  echo "Error: @playwright/cli is not installed. Run: npm install @playwright/cli" >&2
  exit 1
fi
cmd=(npx --no-install --package @playwright/cli@1.50.1 playwright-cli)
if [[ "${has_session_flag}" != "true" && -n "${PLAYWRIGHT_CLI_SESSION:-}" ]]; then
  cmd+=(--session "${PLAYWRIGHT_CLI_SESSION}")
fi
cmd+=("$@")

exec "${cmd[@]}"
