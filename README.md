# Getting Started

## Environment Variable Setup

Follow these steps to set up environment variables:

### 1. Create a `.env` file

#### On Linux:

```bash
touch .env
```

#### On Windows:

```bash
type nul > .env
```

### 2. Define the following environment variables in the `.env` file:

| Environment Variable Name | Description                                |
| ------------------------- | ------------------------------------------ |
| `DATABASE_URL`            | Connection string for the database         |
| `RESEND_API_KEY`          | API key for Resend service                 |
| `RESEND_DOMAIN`           | Domain for Resend email service            |
| `CUID_FINGERPRINT`        | Fingerprint token for CUID generation      |
| `AUTH_URL`                | Set to `${NEXT_PUBLIC_BASE_URL}`           |
| `AUTH_SECRET`             | Authentication secret for session handling |
| `AUTH_GOOGLE_ID`          | Google OAuth client ID                     |
| `AUTH_GOOGLE_SECRET`      | Google OAuth client secret                 |
| `AUTH_GITHUB_ID`          | GitHub OAuth client ID                     |
| `AUTH_GITHUB_SECRET`      | GitHub OAuth client secret                 |
| `UPLOADTHING_TOKEN`       | API token for UploadThing service          |

### 3. Create a `.env.development` file

#### On Linux:

```bash
touch .env.development
```

#### On Windows:

```bash
type nul > .env.development
```

### 4. Define the following environment variables in the `.env.development` file:

| Environment Variable Name | Description                       |
| ------------------------- | --------------------------------- |
| `NEXT_PUBLIC_BASE_URL`    | Base URL for the development site |
| `UPLOADTHING_IS_DEV`      | Set to `true` for development     |

### 5. Create a `.env.production` file

#### On Linux:

```bash
touch .env.production
```

#### On Windows:

```bash
type nul > .env.production
```

### 6. Define the following environment variables in the `.env.production` file:

| Environment Variable Name  | Description                                                                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_BASE_URL`     | Base URL for the production site                                                                                                          |
| `UPLOADTHING_CALLBACK_URL` | Callback URL for UploadThing, see [documentation](https://docs.uploadthing.com/faq#my-callback-runs-in-development-but-not-in-production) |

---

## Install Dependencies

Before running the development server, make sure to install the required packages. In your project directory, run:

```bash
pnpm install
```

---

## Quick Start

To start the development server, use the following command:

```bash
pnpm dev
```

Then, open [https://localhost:3000](https://localhost:3000) in your browser to view the application.

---

## Additional Information

### Styling

The site is styled using:

- [`Tailwind CSS`](https://tailwindcss.com) for utility-first CSS.
- [`shadcn/ui`](https://ui.shadcn.com/) for advanced user interface components. Note that these components have been customized for this project.

### Authentication

Authentication functionality is powered by [`Auth.js`](https://authjs.dev/).
