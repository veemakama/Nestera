# TODO

## Data Export Security Controls
- [ ] Inspect `DataExportRequest` entity + related DTOs for fields needed (userId, token, expiresAt, filePath)
- [ ] Update `data-export.controller.ts` download endpoint to include `@CurrentUser()` and verify token belongs to caller
- [x] Update `data-export.service.ts` `getExportFile()` to accept `userId` and validate ownership
- [x] Validate resolved `filePath` is within `EXPORT_DIR` before sending
- [ ] Add rate limiting/throttling for `GET /users/data/export/download/:token`
- [ ] Add/adjust tests for unauthorized access + expired link + path validation

## Improve Cache Warming for High-Traffic Endpoints
- [x] Implement controlled concurrency in `cache-warming.service.ts`
- [x] Add per-endpoint timeout when calling `cacheStrategy.warmCache`
- [x] Add anti-duplicate lock to prevent overlapping warming runs
- [x] Ensure metrics remain accurate under parallel execution
- [ ] Run backend tests / lint

