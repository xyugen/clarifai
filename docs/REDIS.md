# Redis Caching Layer

This project uses Redis as an optional caching layer to improve performance by caching frequently accessed data and implementing rate limiting for AI operations.

## Features

- **Optional Redis Integration**: The application works with or without Redis. If Redis is not configured, caching is automatically disabled.
- **Data Caching**: Caches frequently accessed data like lessons, user topics, and statistics.
- **Rate Limiting**: Protects expensive AI operations from abuse with user-specific rate limits.
- **Automatic Cache Invalidation**: Caches are automatically invalidated when data changes.

## Setup

### Using Redis Cloud (Free Tier)

1. Sign up for a free account at [Redis Cloud](https://redis.com/try-free/)
2. Create a new database
3. Copy your Redis connection URL (format: `redis://default:password@host:port`)
4. Add it to your `.env` file:

```env
REDIS_URL=redis://default:your_password@your_host:port
```

### Using Local Redis

For development, you can run Redis locally:

```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Then set in .env
REDIS_URL=redis://localhost:6379
```

## Configuration

### Environment Variables

- `REDIS_URL` (optional): Redis connection URL. If not provided, caching will be disabled.

### Cache TTL (Time To Live)

Different types of data have different cache lifetimes defined in `src/lib/redis/cache.ts`:

- AI Responses: 1 hour
- Lesson Data: 30 minutes
- User Statistics: 10 minutes
- Questions: 30 minutes
- Short-lived data: 5 minutes

### Rate Limiting

Rate limits are configured in `src/lib/redis/rate-limit.ts`:

- AI Generation Operations: 20 requests per hour per user
- General API: 60 requests per minute per user

## Implementation Details

### Cached Endpoints

The following endpoints benefit from Redis caching:

1. **`lesson.getLesson`**: Caches lesson details and questions
2. **`lesson.getUserStats`**: Caches user statistics
3. **`lesson.getTopicsForUser`**: Caches user's topic lists

### Rate Limited Endpoints

The following endpoints have rate limiting:

1. **`ai.generateQuestionsFromPDF`**: Limited to prevent excessive AI generation costs
2. **`ai.generateFeedbackFromAnswer`**: Limited to prevent excessive AI generation costs

### Cache Invalidation

Caches are automatically invalidated when:

- A topic is created (invalidates user topics and stats)
- A topic is deleted (invalidates lesson, user topics, and stats)
- A topic's visibility is updated (invalidates lesson and user topics)
- An answer is submitted (invalidates user stats)

## Architecture

```
src/lib/redis/
├── index.ts         # Redis client connection management
├── cache.ts         # Caching utilities (get, set, delete, patterns)
└── rate-limit.ts    # Rate limiting utilities
```

## Testing Without Redis

The application is designed to work without Redis:

1. Don't set `REDIS_URL` in your `.env` file
2. All cache operations will silently return `null` or `false`
3. Rate limiting will be disabled
4. The application continues to work normally, just without caching benefits

## Performance Benefits

With Redis enabled:

- **Faster API responses**: Frequently accessed data is served from memory
- **Reduced database load**: Popular lessons and user data are cached
- **Rate limiting**: Protects against abuse and controls AI API costs
- **Better scalability**: Multiple application instances can share the same cache

## Monitoring

Redis connection status is logged to the console:

- Connection success: "Redis connected successfully"
- Connection errors: "Redis connection error: [error details]"

You can check if Redis is available using the `isRedisAvailable()` function from `src/lib/redis/index.ts`.
