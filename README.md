# XYL Claude Skills

Collection of Claude Code skills for X/Twitter bookmarks export and Substack publishing.

## Installation

### Claude Code (via Plugin Marketplace)

In Claude Code, register the marketplace first:

```bash
/plugin marketplace add nickleefly/xyl-claude-skills
```

Then install the plugin:

```bash
/plugin install xyl-claude-skills@xyl-claude-skills
```

### Verify Installation

Check that commands appear:

```bash
/help
```

You should see:
- `/xyl-claude-skills:x-bookmarks` - Export X/Twitter bookmarks to markdown
- `/xyl-claude-skills:substack` - Publish newsletter articles to Substack

## What's Inside

### Skills Library

| Skill | Description |
|-------|-------------|
| [x-bookmarks](skills/x-bookmarks/SKILL.md) | Export X/Twitter bookmarks to markdown using the bird CLI |
| [substack](skills/substack/SKILL.md) | Publish newsletter articles to Substack as drafts from Markdown |

### Commands

| Command | Description |
|---------|-------------|
| `/x-bookmarks` | Export X/Twitter bookmarks |
| `/substack` | Publish to Substack |

## License

MIT
