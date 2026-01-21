# XYL Claude Skills

Collection of Claude Code skills for X/Twitter bookmarks export and Substack publishing.

## Installation

### Quick Install (Recommended)

In Claude Code, register the marketplace first:

```bash
/plugin marketplace add nickleefly/xyl-claude-skills
```

Then install the plugin:

```bash
/plugin install x-bookmarks@xyl-claude-skills
/plugin install substack@xyl-claude-skills
```

### Verify Installation

Check that skills appear:

```bash
/help
```

## Available Skills

### Content Skills

| Skill | Description | Command |
|-------|-------------|---------|
| [x-bookmarks](skills/x-bookmarks/SKILL.md) | Export X/Twitter bookmarks to markdown using the bird CLI | `/x-bookmarks` |
| [substack](skills/substack/SKILL.md) | Publish newsletter articles to Substack as drafts | `/substack` |

#### x-bookmarks

Export X/Twitter bookmarks to markdown format.

```bash
/x-bookmarks
```

Prerequisites:
- Install `bird`: `npm install -g @steipete/bird`
- Log into X in browser for cookie auth

#### substack

Publish newsletter articles to Substack as drafts from Markdown.

```bash
/substack path/to/article.md
```

Prerequisites:
- Set environment variables in `~/.bashrc`:
  ```bash
  export SUBSTACK_EMAIL="your-email@example.com"
  export SUBSTACK_PASSWORD="your-password"
  export SUBSTACK_PUBLICATION_URL="https://yourpub.substack.com"
  ```
- Install: `pip install python-substack`

## License

MIT
