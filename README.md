# SoloGrind App

A React-powered application that combines powerful computational capabilities with an engaging, user-friendly interface, designed to make mathematical calculations both functional and enjoyable.

## Deploying to Vercel

This guide provides step-by-step instructions for deploying the SoloGrind App to Vercel.

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. Git installed on your local machine
3. Node.js 20 or later installed

### Step 1: Prepare Your Repository

If you haven't already, push your code to a Git repository (GitHub, GitLab, or Bitbucket).

### Step 2: Connect to Vercel

1. Log in to your Vercel account
2. Click "Add New..." > "Project"
3. Select your repository from the list
4. Configure the project with the following settings:

   - **Framework Preset**: Other (Custom)
   - **Build Command**: `chmod +x vercel-build.sh && ./vercel-build.sh`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`
   
   **IMPORTANT:** Make sure to set these exact settings to avoid 404 errors. The output directory must match `dist/public` exactly as that's where Vite builds the frontend files.

### Step 3: Set Environment Variables

Add the following environment variables in the Vercel project settings:

| Variable Name     | Description                   | Notes                                                        |
|-------------------|-------------------------------|--------------------------------------------------------------|
| `DATABASE_URL`    | PostgreSQL database URL       | Use your Neon.tech database URL or other PostgreSQL provider |
| `SESSION_SECRET`  | Secret for session encryption | Generate a secure random string                              |
| `MISTRAL_API_KEY` | API key for Mistral API       | Obtain from Mistral AI                                       |
| `CRON_SECRET`     | Secret for cron job endpoint  | Generate a secure random string to protect the API endpoint  |
| `VERCEL`          | Vercel deployment flag        | Set to `true`                                                |
| `NODE_ENV`        | Node environment              | Set to `production`                                          |

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build and deployment to complete
3. Once deployed, Vercel will provide a URL to access your application

### Step 5: Set Up Cron Job for Task Expiration

Since Vercel doesn't support background processes, you need to set up an external cron job service to regularly check for expired tasks:

1. Set up an account on a cron job service like [cron-job.org](https://cron-job.org/) or [EasyCron](https://www.easycron.com/)
2. Create a new cron job that calls your task expiration endpoint:
   - URL: `https://your-vercel-app.vercel.app/api/expire-tasks?token=YOUR_CRON_SECRET`
   - Method: GET
   - Frequency: Every 5-15 minutes (depending on your app's requirements)
   - Make sure to replace `YOUR_CRON_SECRET` with the value you set in your Vercel environment variables

### Step 6: Set Up Custom Domain (Optional)

1. In your Vercel project, go to "Settings" > "Domains"
2. Add your custom domain and follow the instructions to configure DNS

### Troubleshooting

If you encounter issues with your deployment:

1. **404 "NOT_FOUND" Errors**:
   - This usually happens when Vercel can't find your application files
   - Double-check that your "Output Directory" is set to `dist/public` in your Vercel project settings
   - Ensure you're using the exact build command: `chmod +x vercel-build.sh && ./vercel-build.sh`
   - Try forcing a fresh deployment by clicking "Redeploy" in your Vercel dashboard
   - Check that all files are properly pushed to your GitHub repository
   - If the error persists, try creating a new project in Vercel with the same repository

2. **Database Connection Issues**: 
   - Ensure your DATABASE_URL is correct and accessible from Vercel's servers
   - Check that your database allows connections from Vercel's IP ranges
   - For Neon.tech databases, make sure you've enabled the "Pooled connections" option

3. **Build Failures**:
   - Check the build logs in Vercel to see exactly where it's failing
   - Verify all environment variables are correctly set
   - Make sure the build script has proper execute permissions

4. **Runtime Errors**:
   - Check the Function Logs in Vercel's dashboard
   - Enable Vercel's "Debug" mode for more detailed logs

**Detailed Troubleshooting Guide**: For a comprehensive troubleshooting guide with specific solutions to common Vercel deployment issues, see [VERCEL_DEPLOYMENT_TROUBLESHOOTING.md](VERCEL_DEPLOYMENT_TROUBLESHOOTING.md).

### Local Development

To run the project locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### WebSocket Support

Note that WebSockets are not supported in Vercel's serverless environment. The application automatically falls back to polling when deployed to Vercel.