# AI-Powered Exam Generation and Student Management System

This project is a Next.js application designed to assist with educational tasks, including AI-powered exam generation and student data management.

## Features

*   Generate exam questions and complete exams using AI (leveraging Gemini API).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm, yarn, or pnpm (choose one)
*   Firebase project setup
*   Gemini API Key

### Installation

1.  Clone the repository

2.  Navigate to the project directory

3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Set up your environment variables. Create a `.env.local` file in the root of the project by copying the `.env.example` (if one exists) or by creating it manually. Then, add the necessary environment variables (see below).

## Environment Variables

Create a `.env.local` file in the root of your project and add the following variables. Obtain the necessary keys and credentials from their respective services.

*   `GEMINI_API_KEY`: Your API key for Google Gemini, used for AI-powered content generation.
    *   *Purpose*: Enables features like automatic question generation.
*   `SESSION_SECRET`: A secret key used for signing session cookies.
    *   *Purpose*: Secures user sessions.
*   `FIREBASE_SERVICE_ACCOUNT`: JSON string or path to the JSON file for your Firebase service account credentials.
    *   *Purpose*: Allows the backend to connect to and interact with your Firebase project (e.g., Firestore, Authentication).

**Example `.env.local` structure:**

```
GEMINI_API_KEY="your_gemini_api_key_here"
SESSION_SECRET="your_strong_random_session_secret_here"
FIREBASE_SERVICE_ACCOUNT="{\"type\": \"service_account\", ... }" # or path to your JSON file
```

## Usage

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the main page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Learn More (Next.js)

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

