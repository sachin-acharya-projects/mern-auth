## Configuration

Make a file: [src/constants/config.ts](src/constants/config.ts) and export the following constants. These are essential configurations.

```ts
// Production Mode Select
export const DEBUG: boolean = process.env.NODE_ENV !== "production" // Set 'false' in production mode

// MongoDB Configurations
const MONGODB_USER = "<MONGODB_USER>"
const MONGODB_PASSWORD = "<MONGODB_PASSWORD>"
const MONGODB_DATABASE = "<MONGODB_DATABASE>"
// Make sure cluster URI and appName below matches yours
export const MONGODB_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster-0.9ut7l.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority&appName=Cluster-0`

// JsonWebToken Configurations
export const JWT_SECRET = "<JWT_SECRET_KEY>"
export const JWT_REFRESH_SECRET = "<JWT_REFRESH_KEY>"

// Resend Configurations
export const RESEND_API_KEY = "<RESEND_API_KEY>"
export const RESEND_SENDER_EMAIL = "<MAILTRAP_TEST_EMAIL>"

// Client Configuration
export const CLIENT_URL = "<CLIENT_BASE_URL>"
```
