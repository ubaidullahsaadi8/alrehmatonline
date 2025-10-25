# Archived Scripts

This directory contains old migration and test scripts that were used during development.

**These scripts are NO LONGER NEEDED for production.**

## ⚠️ Important

- **DO NOT USE** these scripts in production
- They may contain outdated schema definitions
- Some may conflict with the new migration system
- Kept for reference only

## Production Migration

For production deployment, use:

```bash
npm run db:migrate
```

This uses the official migration script in `/database/migrate.ts`

## Files in This Archive

All files here were used during development for:
- Testing database schemas
- Experimenting with different table structures
- Debugging specific issues
- Creating test data

## If You Need to Reference These

These files can help you understand:
- How the database evolved
- Previous schema versions
- Development decisions
- Test scenarios

## Cleanup

You can safely delete this entire `_ARCHIVE` directory if you don't need the reference files.

---

**Archived:** January 19, 2025  
**Reason:** Replaced by production-ready migration system
