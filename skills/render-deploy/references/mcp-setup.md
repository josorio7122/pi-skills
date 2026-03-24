# MCP Setup Instructions

If `list_services()` fails because MCP isn't configured, ask whether they want to set up MCP (preferred) or continue with the CLI fallback. If they choose MCP, ask which AI tool they're using, then provide the matching instructions below. Always use their API key.

## Cursor

Walk the user through these steps:

1) Get a Render API key:
```
https://dashboard.render.com/u/*/settings#api-keys
```

2) Add this to `~/.cursor/mcp.json` (replace `<YOUR_API_KEY>`):
```json
{
  "mcpServers": {
    "render": {
      "url": "https://mcp.render.com/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_API_KEY>"
      }
    }
  }
}
```

3) Restart Cursor, then retry `list_services()`.

## Claude Code

Walk the user through these steps:

1) Get a Render API key:
```
https://dashboard.render.com/u/*/settings#api-keys
```

2) Add the MCP server with Claude Code (replace `<YOUR_API_KEY>`):
```bash
claude mcp add --transport http render https://mcp.render.com/mcp --header "Authorization: Bearer <YOUR_API_KEY>"
```

3) Restart Claude Code, then retry `list_services()`.

## Codex

Walk the user through these steps:

1) Get a Render API key:
```
https://dashboard.render.com/u/*/settings#api-keys
```

2) Set it in their shell:
```bash
export RENDER_API_KEY="<YOUR_API_KEY>"
```

3) Add the MCP server with the Codex CLI:
```bash
codex mcp add render --url https://mcp.render.com/mcp --bearer-token-env-var RENDER_API_KEY
```

4) Restart Codex, then retry `list_services()`.

## Other Tools

If the user is on another AI app, direct them to the Render MCP docs for that tool's setup steps and install method.

## Workspace Selection

After MCP is configured, have the user set the active Render workspace with a prompt like:

```
Set my Render workspace to [WORKSPACE_NAME]
```
