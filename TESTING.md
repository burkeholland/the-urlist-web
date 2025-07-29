# Battle.net Metadata Fetching - Testing Guide

## Quick Test Commands

After running `npm install`, you can test the metadata fetching improvements:

### Test the metadata API directly:
```bash
curl "http://localhost:4321/api/metadata?url=https://battle.net"
```

### Test via the application:
1. Start the dev server: `npm run dev`
2. Create a new list and add battle.net URLs
3. Check browser network tab for API calls to `/api/metadata`

### Expected Results

**Before the fix:**
```json
{
  "title": "battle.net",
  "description": "Content from battle.net", 
  "image": null
}
```

**After the fix:**
Should return actual Open Graph metadata from battle.net with proper title, description, and potentially an image.

## Implementation Summary

The fix addresses several issues that were causing battle.net (and similar sites) to return fallback metadata instead of actual content:

1. **User-Agent Headers**: Now sends proper browser-like headers to avoid bot detection
2. **Increased Timeout**: Extended from 5s to 10s for slower-responding sites
3. **Retry Logic**: Up to 3 attempts with exponential backoff for transient failures
4. **Unified Implementation**: Both `/api/metadata` and `/api/links` now use the same robust fetching logic
5. **Enhanced Logging**: Better error messages for debugging issues

## Key Files Modified

- `src/utils/metadata.ts` - New unified metadata fetching utility
- `src/pages/api/metadata.ts` - Simplified to use unified implementation  
- `src/pages/api/links.ts` - Updated to use unified implementation

The changes are backward compatible and maintain the existing fallback behavior while significantly improving reliability for sites like battle.net.