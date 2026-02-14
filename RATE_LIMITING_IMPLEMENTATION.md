# Rate Limiting Implementation

## Overview

This document describes the two-tier rate limiting system implemented for SustainChain. The system separates **client-side rate limiting** (for frequent, low-cost operations) from **server-side rate limiting** (for expensive operations with real monetary cost).

## Architecture

### Two-Tier System

1. **Client-Side Rate Limiting (Debouncing)**
   - Used for frequent per-user operations
   - No Firestore tracking (zero cost)
   - Operations: Dashboard refreshes, analytics queries, data exports, search/filter
   - Configuration: Environment variables (`.env`)
   - Default: 30 requests/minute with 500ms debounce

2. **Server-Side Rate Limiting (Firestore-backed)**
   - Used for expensive tenant-level operations
   - Firestore tracking in `/tenants/{tenantId}/rate_limits/` subcollection
   - Operations: Bill Analysis (Gemini API), Report Generation (PDF)
   - Configuration: Firestore `/system_config/api_limits` (SuperAdmin modifiable)
   - Default: 10 requests/minute for Bill Analysis, 5 requests/minute for Reports

## Implementation Details

### Client-Side Rate Limiting

#### Files Created
- `lib/client-rate-limiter.ts` - Debouncing utilities and rate limit tracker
- `hooks/use-debounced-callback.ts` - React hooks for debouncing

#### Configuration (Environment Variables)
Add to `.env.local`:
```bash
# Client-Side Rate Limiting (requests per minute)
NEXT_PUBLIC_RATE_LIMIT_DASHBOARD_MIN=30
NEXT_PUBLIC_RATE_LIMIT_ANALYTICS_MIN=30
NEXT_PUBLIC_RATE_LIMIT_EXPORT_MIN=10
NEXT_PUBLIC_RATE_LIMIT_SEARCH_MIN=60
NEXT_PUBLIC_RATE_LIMIT_DEBOUNCE_MS=500
```

#### Usage Example
```typescript
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { CLIENT_RATE_LIMITS } from '@/lib/client-rate-limiter';

// In your component
const debouncedRefetch = useDebouncedCallback(
  () => {
    refetchData();
  },
  CLIENT_RATE_LIMITS.DEBOUNCE_MS,
  [refetchData]
);

// Use in onClick handlers
<Button onClick={() => debouncedRefetch()}>Refresh</Button>
```

#### Components Updated
- ✅ `/app/(protected-page)/(dashboard)/dashboard/page.tsx` - Debounced refresh
- ✅ `/app/(protected-page)/(dashboard)/analytics/page.tsx` - Debounced refresh
- ✅ `/components/headers/search-command.tsx` - Debounced search (ready for implementation)

### Server-Side Rate Limiting

#### Files Created
- `lib/rate-limiter.ts` - Sliding window rate limiter with Firestore
- `lib/rate-limit-config.ts` - Configuration loader with 5-minute cache
- `middleware.ts` - Next.js middleware for route protection
- `app/api/system-admin/rate-limits/route.ts` - SuperAdmin CRUD API
- `app/(protected-page)/(dashboard)/(system-admin)/system-admin/rate-limits/page.tsx` - SuperAdmin UI
- `scripts/init-rate-limits.js` - Initialization script

#### Configuration (Firestore)
Rate limits are stored in `/system_config/api_limits`:
```typescript
{
  rateLimits: {
    billAnalysis: {
      requestsPerMinute: 10,
      requestsPerHour: 100,
      requestsPerDay: 500
    },
    reportGeneration: {
      requestsPerMinute: 5,
      requestsPerHour: 50,
      requestsPerDay: 200
    }
  },
  quotas: {
    trial: { maxUsers: 5, maxBillsPerMonth: 50, maxReportsPerMonth: 10 },
    standard: { maxUsers: 20, maxBillsPerMonth: 500, maxReportsPerMonth: 50 },
    premium: { maxUsers: 100, maxBillsPerMonth: 2000, maxReportsPerMonth: 200 },
    enterprise: { maxUsers: -1, maxBillsPerMonth: -1, maxReportsPerMonth: -1 }
  }
}
```

#### Initialization
Run the initialization script to create default configuration:
```bash
node scripts/init-rate-limits.js
```

Or add to `package.json`:
```json
{
  "scripts": {
    "init-rate-limits": "node scripts/init-rate-limits.js"
  }
}
```

#### API Routes Updated
- ✅ `/app/api/analyze/route.ts` - Bill Analysis with rate limiting

Rate limiting adds these headers to responses:
- `X-RateLimit-Limit` - Maximum requests allowed
- `X-RateLimit-Remaining` - Requests remaining in window
- `X-RateLimit-Reset` - Timestamp when limit resets
- `Retry-After` - Seconds until next request allowed (on 429 errors)

#### Usage in API Routes
```typescript
import { checkRateLimit, RATE_LIMIT_OPERATIONS } from '@/lib/rate-limiter';
import { getRateLimitForOperation } from '@/lib/rate-limit-config';

// Check rate limit
const limit = await getRateLimitForOperation(
  RATE_LIMIT_OPERATIONS.BILL_ANALYSIS,
  'minute'
);

const rateLimitResult = await checkRateLimit(
  tenantId,
  RATE_LIMIT_OPERATIONS.BILL_ANALYSIS,
  limit,
  60000, // 1 minute window
  bypassRateLimit // true for admins
);

if (!rateLimitResult.allowed) {
  return NextResponse.json(
    { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
    { status: 429 }
  );
}
```

## SuperAdmin Management

### Accessing Rate Limits UI
1. Sign in as SuperAdmin
2. Navigate to `/system-admin/rate-limits`
3. Modify rate limits and quotas
4. Click "Save Changes"

### API Endpoints

**GET** `/api/system-admin/rate-limits`
- Retrieves current rate limit configuration
- Requires SuperAdmin authentication

**PATCH** `/api/system-admin/rate-limits`
- Updates rate limit configuration
- Body:
  ```json
  {
    "rateLimits": {
      "billAnalysis": {
        "requestsPerMinute": 15,
        "requestsPerHour": 150,
        "requestsPerDay": 750
      }
    }
  }
  ```

**POST** `/api/system-admin/rate-limits`
- Resets rate limits for a specific tenant
- Body:
  ```json
  {
    "tenantId": "tenant123",
    "operation": "billAnalysis" // optional
  }
  ```

## Firestore Structure

### Rate Limit Records
Path: `/tenants/{tenantId}/rate_limits/{operation}`

```typescript
{
  operation: "billAnalysis" | "reportGeneration",
  tenantId: string,
  timestamps: Timestamp[], // Array of request timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Indexes Required
Added to `firestore.indexes.json`:
```json
{
  "collectionGroup": "rate_limits",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "updatedAt", "order": "ASCENDING" }
  ]
}
```

Deploy indexes:
```bash
firebase deploy --only firestore:indexes
```

## Admin Bypass

Admins (role: `admin` or `superadmin`) automatically bypass tenant-level rate limits for operational flexibility. This applies to:
- Bill Analysis API calls
- Report Generation API calls

Client-side rate limiting (debouncing) still applies to all users including admins.

## Monitoring

### Cache Status
Check rate limit config cache status:
```typescript
import { getCacheStatus } from '@/lib/rate-limit-config';

const status = getCacheStatus();
console.log('Cache valid:', status.isCached);
console.log('Cache age:', status.age, 'ms');
console.log('Expires in:', status.expiresIn, 'ms');
```

### Force Cache Refresh
```typescript
import { invalidateCache } from '@/lib/rate-limit-config';

invalidateCache(); // Next request will fetch fresh data
```

### Cleanup Old Records
Run cleanup periodically (e.g., daily via Cloud Scheduler):
```typescript
import { cleanupOldRateLimits } from '@/lib/rate-limiter';

await cleanupOldRateLimits(86400000); // Remove records older than 24 hours
```

## Testing

### Test Client-Side Debouncing
1. Navigate to `/dashboard`
2. Click "Refresh" button rapidly
3. Observe: Only one request is made after you stop clicking

### Test Server-Side Rate Limiting
1. Use a tool like Postman or curl
2. Make multiple `/api/analyze` requests quickly
3. Observe: After exceeding limit, receive 429 error with `Retry-After` header

Example curl test:
```bash
# Get auth token
TOKEN="your-firebase-id-token"

# Make requests rapidly (should hit rate limit)
for i in {1..15}; do
  curl -X POST https://your-app.com/api/analyze \
    -H "Authorization: Bearer $TOKEN" \
    -F "image=@bill.jpg" \
    -F "tenantId=tenant123"
  echo "\n---"
done
```

### Test SuperAdmin UI
1. Sign in as SuperAdmin
2. Navigate to `/system-admin/rate-limits`
3. Change `requestsPerMinute` for Bill Analysis to 5
4. Click "Save Changes"
5. Wait 5 minutes (cache TTL)
6. Test API again - should use new limit

## Migration Notes

### Existing Projects
If you're adding this to an existing project:

1. **Run initialization script**
   ```bash
   node scripts/init-rate-limits.js
   ```

2. **Deploy Firestore indexes**
   ```bash
   firebase deploy --only firestore:indexes
   ```

3. **Add environment variables** to `.env.local`

4. **No breaking changes** - Existing API routes continue to work
   - Rate limits are permissive by default
   - Failed rate limit checks allow requests (fail-open)

## Cost Optimization

### Firestore Costs
- **Reads**: 1 read per rate-limited request (cached for 5 minutes)
- **Writes**: 1 write per rate-limited request
- **Estimated cost**: ~$0.12 per 100k bill analyses (assuming 10 req/min limit)

### Optimization Strategies
1. ✅ **Cache config**: 5-minute TTL reduces reads by 300x
2. ✅ **Client-side debouncing**: Prevents unnecessary server requests
3. ✅ **Admin bypass**: Admins don't increment rate limit counters
4. ✅ **Cleanup job**: Removes old records to minimize storage costs

## Security Considerations

1. **Authentication required**: All rate-limited routes verify Firebase ID tokens
2. **Tenant isolation**: Rate limits are per-tenant, preventing cross-tenant abuse
3. **Admin bypass**: Only authenticated admins can bypass limits
4. **SuperAdmin only**: Rate limit configuration is SuperAdmin-only
5. **Fail-open**: On Firestore errors, requests are allowed (availability over strict limiting)

## Troubleshooting

### Rate Limits Not Applied
- Check Firebase Admin credentials in `.env`
- Verify `/system_config/api_limits` document exists in Firestore
- Check cache status - may need 5 minutes to refresh
- Verify user role includes `tenantId` in custom claims

### 429 Errors Too Frequently
- Check current limits in SuperAdmin UI
- Verify tenant's actual usage
- Consider increasing limits for specific tenants
- Check if cleanup job is running too aggressively

### Client-Side Debouncing Not Working
- Verify environment variables are set with `NEXT_PUBLIC_` prefix
- Check browser console for errors
- Ensure `useDebouncedCallback` hook is used correctly

## Future Enhancements

Potential improvements for future iterations:

1. **Usage Analytics Dashboard**
   - Real-time rate limit monitoring
   - Tenant usage graphs
   - Alert system for repeated limit violations

2. **Dynamic Rate Limits**
   - Adjust limits based on subscription tier
   - Time-based limits (e.g., stricter during peak hours)
   - Burst allowance for occasional spikes

3. **Distributed Rate Limiting**
   - Redis-backed rate limiting for multi-region deployments
   - Consistent hashing for better scalability

4. **Webhook Notifications**
   - Notify tenant admins when approaching limits
   - Alert SuperAdmins of suspicious activity

## References

- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Next.js Middleware](https:/ /nextjs.org/docs/app/building-your-application/routing/middleware)
- [Rate Limiting Algorithms](https://en.wikipedia.org/wiki/Rate_limiting)
- [Sliding Window Algorithm](https://www.quinbay.com/blog/understanding-rate-limiting-algorithms)

---

**Last Updated**: February 14, 2026  
**Version**: 1.0.0  
**Author**: SustainChain Development Team
