const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

// Initialize Firebase Admin
admin.initializeApp();

// Initialize SendGrid
const sendGridApiKey = functions.config().sendgrid?.api_key || process.env.SENDGRID_API_KEY;
if (sendGridApiKey) {
  sgMail.setApiKey(sendGridApiKey);
}

exports.processSnapSendUpload = functions.storage.object().onFinalize(async (object) => {
  try {
    // Check if the file is in the snap-send or gps-problems directory
    if (!object.name || (!object.name.startsWith('snap-send/') && !object.name.startsWith('gps-problems/'))) {
      console.log('File not in snap-send or gps-problems directory, skipping');
      return null;
    }

    const isGPSProblem = object.name.startsWith('gps-problems/');
    console.log(`Processing ${isGPSProblem ? 'GPS problem' : 'snap-send'} upload:`, object.name);

    // Get file metadata
    const bucket = admin.storage().bucket(object.bucket);
    const file = bucket.file(object.name);
    
    // Get custom metadata
    const [metadata] = await file.getMetadata();
    const customMetadata = metadata.metadata || {};
    
    console.log('File metadata:', customMetadata);

    // Generate signed URL valid for 24 hours
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    console.log('Generated signed URL');

    // Extract metadata with fallbacks
    const fullName = customMetadata.full_name || 'N/A';
    const phone = customMetadata.phone || 'N/A';
    const machine = customMetadata.machine || 'N/A';
    const issueType = customMetadata.issue_type || 'N/A';
    const issue = customMetadata.issue || customMetadata.issue_description || 'N/A';
    const fileType = object.contentType || 'N/A';

    // Prepare email content
    const subject = isGPSProblem ? `GPS Problem – ${machine} from ${fullName}` : `Snap & Send – ${machine} from ${fullName}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">${isGPSProblem ? 'New GPS Problem Report' : 'New Snap & Send Request'}</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Customer Details</h3>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Machine:</strong> ${machine}</p>
          ${!isGPSProblem ? `<p><strong>Issue Type:</strong> ${issueType}</p>` : ''}
        </div>
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-top: 0;">Issue Description</h3>
          <p style="white-space: pre-wrap;">${issue}</p>
        </div>
        
        <div style="background-color: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
          <h3 style="color: #0c5460; margin-top: 0;">File Information</h3>
          <p><strong>File Path:</strong> ${object.name}</p>
          <p><strong>Mime Type:</strong> ${fileType}</p>
          <p><strong>File Size:</strong> ${object.size ? Math.round(parseInt(object.size) / 1024) + ' KB' : 'N/A'}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${signedUrl}" 
             style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            📷 View Uploaded Image
          </a>
          <p style="font-size: 12px; color: #666; margin-top: 10px;">Link expires in 24 hours</p>
        </div>
        
        <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px; text-align: center; color: #666;">
          <p><strong>Ready to Run CQ</strong></p>
          <p>Keeping your machinery running</p>
        </div>
      </div>
    `;

    const textBody = `
${isGPSProblem ? 'New GPS Problem Report' : 'New Snap & Send Request'}

Customer Details:
Name: ${fullName}
Phone: ${phone}
Machine: ${machine}
${!isGPSProblem ? `Issue Type: ${issueType}\n` : ''}Issue Description:
${issue}

File Information:
File Path: ${object.name}
Mime Type: ${fileType}
File Size: ${object.size ? Math.round(parseInt(object.size) / 1024) + ' KB' : 'N/A'}

View Image: ${signedUrl}
(Link expires in 24 hours)

---
Ready to Run CQ
Keeping your machinery running
    `;

    // Send email
    if (!sendGridApiKey) {
      console.error('SendGrid API key not configured');
      return null;
    }

    const msg = {
      to: 'jed@readytoruncq.com.au',
      from: 'noreply@readytoruncq.com.au', // Use your verified sender
      subject: subject,
      text: textBody,
      html: htmlBody,
    };

    await sgMail.send(msg);
    console.log('Email sent successfully to jed@readytoruncq.com.au');

    return null;
  } catch (error) {
    console.error('Error processing upload:', error);
    return null;
  }
});