# Claude Code Permissions & Usage

## Quick Start: Skip All Approval Prompts

**TL;DR** - To stop clicking "Approve" for every command:

1. Open **Claude Desktop** → **Settings** (gear icon)
2. Go to **Developer** or **Advanced** section
3. Enable **"Auto-approve tool use"** or **"Auto-approve all tools"**
4. Restart Claude Desktop if needed

Now Claude can write files, run git commands, execute scripts, etc. without asking!

---

## Auto-approve All Commands (Claude Desktop)

### Option 1: Global Auto-Approval (Recommended for Trusted Projects)

In Claude Desktop, you can configure global settings to auto-approve all tool uses:

1. **Open Claude Desktop Settings**
   - macOS: `Claude Desktop` menu → `Settings` → `Developer`
   - Or click Settings icon in the app

2. **Enable Auto-Approval**
   - Look for "Tool Use" or "Agent" settings
   - Enable "Auto-approve tool use" or similar option
   - This applies to ALL projects, so use carefully

### Option 2: Per-Project Config (CLI Method)

If using Claude Code CLI, create `.claude/config.json`:

```json
{
  "allowedCommands": [
    "git *",
    "npm *",
    "node *",
    "netlify *",
    "ls *",
    "cat *",
    "mkdir *",
    "rm *",
    "mv *",
    "cp *"
  ],
  "autoApproveTools": [
    "Bash",
    "Read",
    "Write",
    "Edit",
    "Glob",
    "Grep"
  ]
}
```

**Note:** This config works for CLI but may not work in Desktop app yet.

## Using Claude Code in Claude Desktop

### Setup
1. Open Claude Desktop app
2. Click the wrench icon (🔧) to enable Claude Code
3. Claude Code runs within the chat interface
4. Automatically detects project context from current working directory

### Key Differences from CLI
- **Approval prompts:** May appear in UI for certain commands (unless auto-approval enabled)
- **File operations:** Read, Write, Edit, Glob, Grep
- **Bash commands:** git, npm, node, file operations (ls, cat, mkdir, rm, mv, cp)
- **Git operations:** git add, commit, push, status, log, diff

### What Gets Prompted (If Auto-Approval NOT Enabled)
- `git push` - Pushing to remote
- `git commit` - Creating commits
- `npm install` - Installing dependencies
- `node <script>` - Running scripts
- File deletion: `rm`, `git rm`
- Any bash command that modifies system

### Workflow for This Project

**Always allowed (no prompts):**
- Reading files: `Read` tool
- Searching: `Grep`, `Glob` tools
- Viewing: `git status`, `git log`, `git diff`

**Auto-approved if enabled, otherwise requires approval:**
- Writing files: `Write`, `Edit` tools
- File operations: `mkdir`, `cp`, `mv`
- Git operations: `git add`, `git commit`, `git push`
- Deleting: `rm`, `git rm`
- Installing: `npm install`
- Running: `node dev-scripts/*`

### Tips
1. **Enable auto-approval** in Desktop settings to skip all prompts for this project
2. **Trust project context:** Claude Code only operates within this directory
3. **Review commits:** Check `git log` before pushing to production
4. **Admin mode:** Use `?admin=1` URL param for unrestricted gift operations
5. **Safe to approve everything** - All operations are scoped to project directory

## Common Workflows

### Deploy Changes
```
1. Claude makes edits (Write/Edit tools)
2. Approve "git add" (if auto-approval not enabled)
3. Approve "git commit" (if auto-approval not enabled)
4. Approve "git push" (if auto-approval not enabled)
→ Netlify auto-deploys

With auto-approval ON: All happens automatically!
```

### Database Updates
```
1. Claude creates script in dev-scripts/
2. Review script
3. Approve "node dev-scripts/[script-name].js"
4. Verify in Firebase console
```

### Testing
```
# Test in admin mode (no month restrictions)
https://podaroklammert.netlify.app?admin=1

# Test specific month
https://podaroklammert.netlify.app?month=5

# Test specific year
https://podaroklammert.netlify.app?year=2025
```

## Safety Features

Claude Code has built-in protections:
- ✅ Reads project files only (no system files)
- ✅ Won't run destructive commands without confirmation
- ✅ Shows diffs before committing
- ✅ Validates before pushing to main
- ✅ Never modifies .env or credentials without explicit request

## Current Permissions (This Session)

The following are pre-approved via CLAUDE.md instructions:
- `git add/commit/push` - For deployment workflow
- `npm install` - For dependency management
- `node` commands - For dev scripts
- `netlify` commands - For deployment
- All file operations within project directory

Just say "yes" or approve when prompted - it's safe for this project!
