# ClarifAI

> An AI-powered study companion that transforms how students learn through interactive questioning and intelligent feedback.

ClarifAI is a modern web application that helps students deeply understand their study materials by generating smart questions from uploaded content and providing personalized AI feedback on their answers. Instead of passive reading, students actively engage with their learning materials through a question-and-answer format enhanced by LLM technology.

## ✨ Key Features

- **📄 PDF Upload & Processing**: Upload study materials as PDFs and let AI extract and analyze the content
- **🤖 AI-Generated Questions**: Automatically generate relevant questions based on your uploaded materials using Groq's language models
- **💡 Intelligent Feedback**: Receive detailed, constructive feedback on your answers to reinforce learning
- **📚 Topic Management**: Organize your study materials into topics with public/private visibility options
- **🎴 Flashcard Generation**: Create AI-powered flashcard sets from your study materials for quick review
- **📊 Progress Tracking**: Monitor your learning progress with user statistics and answer history
- **👤 User Profiles**: View public topics and flashcards from other users
- **⚡ Performance Optimization**: Optional Redis caching layer for improved response times and rate limiting
- **🔐 Secure Authentication**: Google OAuth integration via Better Auth

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with React 19
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Turso](https://turso.tech/) (LibSQL) with [Drizzle ORM](https://orm.drizzle.team/)
- **AI/LLM**: [Groq](https://groq.com/) for fast inference with Vercel AI SDK
- **Authentication**: [Better Auth](https://www.better-auth.com/) with Google OAuth
- **File Upload**: [UploadThing](https://uploadthing.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom retro UI components
- **API**: [tRPC](https://trpc.io/) for end-to-end typesafe APIs
- **Caching** (Optional): [Redis](https://redis.io/) via ioredis
- **PDF Processing**: pdf-parse with LangChain for document handling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20.x or higher
- **npm**: Version 11.x or higher (comes with Node.js)
- A **Turso** account and database ([turso.tech](https://turso.tech/))
- A **Groq** API key ([console.groq.com](https://console.groq.com/))
- A **Google OAuth** application ([console.cloud.google.com](https://console.cloud.google.com/))
- An **UploadThing** account ([uploadthing.com](https://uploadthing.com/))
- (Optional) A **Redis** instance for caching ([redis.io](https://redis.io/))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/xyugen/clarifai.git
cd clarifai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Then fill in the required values:

```env
# Drizzle (Turso Database)
TURSO_DATABASE_URL="libsql://your-database.turso.io"
TURSO_AUTH_TOKEN="your-turso-token"

# Better Auth
BETTER_AUTH_SECRET="your-random-secret-key"  # Generate with: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Groq (for AI)
GROQ_API_KEY="your-groq-api-key"

# UploadThing
UPLOADTHING_APPID="your-app-id"
UPLOADTHING_TOKEN="your-uploadthing-token"

# Redis (Optional - for caching and rate limiting)
REDIS_URL="redis://localhost:6379"  # Or your Redis Cloud URL
REDIS_USERNAME=""  # If required
REDIS_PASSWORD=""  # If required
```

### 4. Set Up the Database

Push the database schema to Turso:

```bash
npm run db:push
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📖 Usage

### Uploading Study Materials

1. **Sign in** with your Google account
2. Navigate to the **Dashboard** or **Upload** page
3. **Upload a PDF** containing your study material
4. The AI will automatically generate questions based on the content

### Studying with Questions

1. Select a **topic** from your dashboard
2. Answer the generated questions in your own words
3. Submit your answer to receive **AI-powered feedback**
4. Review the feedback to understand where you can improve

### Creating Flashcards

1. Go to the **Flashcards** section
2. Upload content to generate flashcard sets automatically
3. Study using the flashcard interface for quick review

### Sharing Content

- Toggle topic visibility to **public** to share with others
- View other users' public topics and flashcards from their profiles

## 📁 Project Structure

```
clarifai/
├── src/
│   ├── app/                    # Next.js app directory (routes & pages)
│   │   ├── (app)/              # Authenticated app routes
│   │   │   ├── dashboard/      # User dashboard
│   │   │   ├── study/          # Study interface
│   │   │   ├── flashcards/     # Flashcard management
│   │   │   └── upload/         # Material upload
│   │   ├── (auth)/             # Authentication pages
│   │   └── api/                # API routes
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # Base UI components
│   │   └── retroui/            # Custom retro-styled components
│   ├── server/                 # Server-side code
│   │   ├── api/                # tRPC routers and procedures
│   │   ├── better-auth/        # Authentication configuration
│   │   └── db/                 # Database schema and queries
│   ├── lib/                    # Utility functions and helpers
│   │   ├── ai/                 # AI/LLM integration
│   │   ├── db/                 # Database operations
│   │   └── redis/              # Redis caching utilities
│   ├── constants/              # Application constants
│   ├── styles/                 # Global styles
│   └── env.js                  # Environment variable validation
├── public/                     # Static assets
├── docs/                       # Additional documentation
│   └── REDIS.md                # Redis setup and usage guide
├── drizzle.config.ts           # Drizzle ORM configuration
└── package.json                # Project dependencies and scripts
```

## 🧑‍💻 Development

### Available Scripts

- **`npm run dev`** - Start development server with Turbo mode
- **`npm run build`** - Build for production
- **`npm run start`** - Start production server
- **`npm run preview`** - Build and start production server
- **`npm run lint`** - Run ESLint
- **`npm run lint:fix`** - Fix ESLint issues
- **`npm run format:check`** - Check code formatting with Prettier
- **`npm run format:write`** - Format code with Prettier
- **`npm run typecheck`** - Run TypeScript type checking
- **`npm run check`** - Run both linting and type checking
- **`npm run db:generate`** - Generate database migrations
- **`npm run db:migrate`** - Run database migrations
- **`npm run db:push`** - Push schema changes to database
- **`npm run db:studio`** - Open Drizzle Studio for database management

### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Drizzle ESLint plugin** for database query validation

## 📚 Additional Documentation

- **[Redis Setup Guide](docs/REDIS.md)** - Detailed instructions for configuring Redis caching

## 🤝 Support

If you encounter any issues or have questions:

1. Check the [existing issues](https://github.com/xyugen/clarifai/issues) on GitHub
2. Review the documentation in the `docs/` directory
3. Open a new issue with detailed information about your problem

## 📄 License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Maintainer

Created and maintained by [xyugen](https://github.com/xyugen).

---

**Note**: This project is built with the [T3 Stack](https://create.t3.gg/) and follows modern Next.js best practices.