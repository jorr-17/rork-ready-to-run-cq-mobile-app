# Firebase Cloud Function Setup

This project now includes a Firebase Cloud Function that automatically processes Snap & Send uploads and sends email notifications.

## Setup Instructions

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Update Project Configuration
1. Update `.firebaserc` with your actual Firebase project ID
2. Update `constants/firebase.ts` with your actual Firebase configuration

### 4. Install Function Dependencies
```bash
cd functions
npm install
```

### 5. Configure SendGrid API Key
You need to set the SendGrid API key as an environment variable:

```bash
# For local development
firebase functions:config:set sendgrid.api_key="your-sendgrid-api-key"

# For production deployment
firebase functions:config:set sendgrid.api_key="your-sendgrid-api-key"
```

### 6. Update Email Sender
In `functions/src/index.ts`, update the `from` field to use a verified sender email address in SendGrid:
```typescript
from: 'your-verified-sender@yourdomain.com'
```

### 7. Deploy the Function
```bash
# Build and deploy
cd functions
npm run build
cd ..
firebase deploy --only functions
```

### 8. Deploy Storage Rules
```bash
firebase deploy --only storage
```

## How It Works

1. When a file is uploaded to Firebase Storage under the `snap-send/` path
2. The Cloud Function `processSnapSendUpload` is automatically triggered
3. The function:
   - Generates a 24-hour signed URL for the uploaded image
   - Extracts metadata (name, phone, property, machine, issue)
   - Sends a formatted email to `jed@readytoruncq.com.au` with all details
   - Includes the signed URL for viewing the image

## Email Format

The email includes:
- **Subject**: "Snap & Send – [Machine] from [Name]"
- **Customer Details**: Name, Phone, Property, Machine
- **Issue Description**: Multi-line issue description
- **File Information**: Path, type, size
- **Image Link**: 24-hour signed URL to view the uploaded image

## Testing

You can test the function locally using the Firebase emulator:
```bash
cd functions
npm run serve
```

## Monitoring

View function logs:
```bash
firebase functions:log
```

## Troubleshooting

1. **SendGrid API Key**: Make sure your SendGrid API key is properly configured
2. **Verified Sender**: Ensure the `from` email is verified in SendGrid
3. **Firebase Project**: Confirm `.firebaserc` has the correct project ID
4. **Storage Rules**: Make sure storage rules allow uploads to `snap-send/` directory