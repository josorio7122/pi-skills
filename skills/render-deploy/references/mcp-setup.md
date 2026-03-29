# MCP Setup for Render

Instructions for connecting Render MCP tools in various AI environments. Always use the user's own Render API key.

Get a Render API key: `https://dashboard.render.com/u/*/settings#api-keys`

---

### pi

pi does not currently support MCP servers natively. Use the Render CLI instead:

1. Install: `brew install render` (macOS) or:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/render-oss/cli/main/bin/install.sh | sh
   ```
   > ⚠️ **Security:** Piping to shell (`curl | sh`) executes remote code. Review the script at the URL before running, or use `brew install render` instead.
2. Authenticate: `render login` or `export RENDER_API_KEY="rnd_xxxxx"`
3. Use `render` CLI commands directly via the bash tool.

---

### Cursor

1. Get your API key from `https://dashboard.render.com/u/*/settings#api-keys`
2. Add this to `~/.cursor/mcp.json` (replace `<YOUR_API_KEY>`):

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

3. Restart Cursor, then retry `list_services()`.

---

### Claude Code

1. Get your API key from `https://dashboard.render.com/u/*/settings#api-keys`
2. Add the MCP server with Claude Code (replace `<YOUR_API_KEY>`):

```bash
claude mcp add --transport http render https://mcp.render.com/mcp --header "Authorization: Bearer <YOUR_API_KEY>"
```

3. Restart Claude Code, then retry `list_services()`.

---

### Codex

1. Get your API key from `https://dashboard.render.com/u/*/settings#api-keys`
2. Set it in your shell:

```bash
export RENDER_API_KEY="<YOUR_API_KEY>"
```

3. Add the MCP server with the Codex CLI:

```bash
codex mcp add render --url https://mcp.render.com/mcp --bearer-token-env-var RENDER_API_KEY
```

4. Restart Codex, then retry `list_services()`.

---

### Other Tools

If you are on another AI app, see the [Render MCP docs](https://render.com/docs/mcp) for that tool's setup steps and install method.
