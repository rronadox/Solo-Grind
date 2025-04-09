# Vercel Deployment Troubleshooting Guide

This guide aims to help you solve common issues when deploying Solo Grind to Vercel, especially focusing on the 404 "NOT_FOUND" errors that can occur after deployment.

## Understanding 404 Errors in Vercel

The most common issue after deployment is encountering a 404 "NOT_FOUND" error when accessing your app. This usually happens because:

1. The build artifacts are not where Vercel expects them to be
2. The routing configurations are incorrect
3. API routes are not properly configured for serverless environments

## Step-by-Step Troubleshooting

### 1. Check Vercel Project Configuration

First, verify your Vercel project settings:

```
Project Settings > General
- Build Command: chmod +x vercel-build.sh && ./vercel-build.sh
- Output Directory: dist/public
- Install Command: npm install
```

**Important:** The Output Directory MUST be set to `dist/public`, as that's where the Vite build process outputs the frontend files.

### 2. Check Build Logs

If the deployment fails or shows a 404 error:

1. Go to your Vercel dashboard
2. Select the deployment that failed
3. Click on "Build" to expand the build logs
4. Look for any errors, especially ones related to:
   - Missing dependencies
   - Build failures
   - File path errors
   - Permissions issues with the build script

### 3. Verify Environment Variables

Ensure all required environment variables are set in your Vercel project:

- `DATABASE_URL`: Your PostgreSQL connection string
- `SESSION_SECRET`: A secure string for session encryption
- `MISTRAL_API_KEY`: Your API key for Mistral AI
- `CRON_SECRET`: A secure token for the task expiration endpoint
- `VERCEL`: Should be set to `true` (usually set automatically by Vercel)
- `NODE_ENV`: Should be set to `production`

### 4. Inspect the Deployed Application

If the deployment completes but you're still seeing a 404 error:

1. In your Vercel dashboard, navigate to "Deployments"
2. Click on the failing deployment
3. Click "Inspect" to open the inspection view
4. Go to the "Functions" tab to see your serverless functions
5. Look for any API functions that aren't being built/deployed correctly

### 5. Specific Issue: Application Loads but API Routes Fail

If the main app loads but API calls return 404 errors:

1. Check that `vercel.json` has the correct routing configuration
2. Ensure the API endpoints are correctly mapped to the serverless functions
3. Verify that all API endpoints have the appropriate HTTP methods (GET, POST, etc.)

### 6. Database Connection Issues

If your application loads but database operations fail:

1. Check that your `DATABASE_URL` is accessible from Vercel's servers
2. For Neon.tech databases, ensure you've enabled "Pooled connections"
3. Try testing the database connection with a simple API endpoint

### 7. Common Solutions to Try

If you're still experiencing issues:

1. **Force a Clean Build**: In your Vercel dashboard, go to "Deployments", click on the three dots menu for your project, and select "Redeploy" with the "Clear cache and redeploy" option.

2. **Check Deployment Branch**: Ensure you're deploying from the correct branch that has all the latest changes.

3. **Try a New Project**: Sometimes, starting a fresh Vercel project and importing the same repository can resolve configuration issues.

4. **Enable Debug Mode**: In your Vercel project settings, enable the "Debug" mode for more detailed logs.

### 8. Testing the Health Endpoint

A quick way to check if your API is working is to access the health endpoint:

```
https://your-app-name.vercel.app/api/health
```

This should return a JSON response with status information. If this works but other API routes don't, there may be an issue with your API route configuration.

## Common Error Messages and Solutions

### "NOT_FOUND" on Home Page

**Issue**: The main application files are not being found.

**Solution**: 
- Ensure the Output Directory is set to `dist/public`
- Check that the build process is correctly generating files in this directory
- Verify that the `vercel.json` file has the correct catch-all route for the frontend

### "NOT_FOUND" on API Routes

**Issue**: The serverless functions for your API are not being correctly routed.

**Solution**:
- Check the `vercel.json` file's routes and rewrites sections
- Ensure the API server.js file is correctly exporting the serverless handler
- Verify that all required dependencies are correctly imported

### "INTERNAL_SERVER_ERROR" When Using the Application

**Issue**: There's a runtime error in your serverless function.

**Solution**:
- Check the Function Logs in the Vercel dashboard
- Ensure database credentials are correct
- Verify that all environment variables are correctly set

## Getting Additional Help

If you're still encountering issues after trying these steps:

1. Enable "Debug" mode in your Vercel project settings
2. Create a new deployment with debug mode enabled
3. Share the error logs from the Function Logs section with our support team

## Contact Support

If none of these solutions work, please contact us with:
1. The specific error message you're seeing
2. Screenshots of your Vercel project settings
3. The URL of the failing deployment
4. Any error messages from the Function Logs