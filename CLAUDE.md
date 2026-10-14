@AGENTS.md

## Claude Code

Shared project instructions live in `AGENTS.md`, imported above. Do not copy them into this file.

Claude Code does not load `.cursor/rules/` automatically. The normative technical rules are in the imported file, and the `.mdc` files remain the canonical source if the two diverge.

This file exists because the default Project instructions value `claude-md-or-agents-md` reads `CLAUDE.md` instead of `AGENTS.md` when both exist (working directory or any directory above it). The `@AGENTS.md` import is the documented way to keep one shared file. Claude Code does not read an already imported `AGENTS.md` a second time, including when Project instructions is `claude-md-and-agents-md`. Direct `AGENTS.md` loading needs Claude Code v2.1.277 or later and is unavailable in some sessions; the import covers those sessions.

If a session leaves `@AGENTS.md` unexpanded, read `AGENTS.md` before changing the project.

Do not change user or managed Claude Code settings from this file.
