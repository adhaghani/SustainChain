/**
 * Email Service - Resend Integration
 * Handles sending transactional emails via Resend API
 */

interface InvitationEmailData {
  to: string;
  name: string;
  inviterName: string;
  tenantName: string;
  role: 'admin' | 'clerk' | 'viewer';
  inviteLink: string;
  expiresAt: Date;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@sustainchain.app';
const APP_NAME = 'SustainChain';

/**
 * Sends an invitation email to a new user
 */
export async function sendInvitationEmail(data: InvitationEmailData): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    throw new Error('Email service is not configured');
  }

  const roleDisplay = {
    admin: 'Administrator',
    clerk: 'Data Entry Clerk',
    viewer: 'Viewer',
  }[data.role];

  const expiresInDays = Math.ceil((data.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${APP_NAME} <${FROM_EMAIL}>`,
        to: [data.to],
        subject: `You've been invited to join ${data.tenantName} on ${APP_NAME}`,
        html: generateInvitationEmailHTML(data, roleDisplay, expiresInDays),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      throw new Error(`Failed to send email: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw error;
  }
}

/**
 * Generates HTML for invitation email
 */
function generateInvitationEmailHTML(
  data: InvitationEmailData,
  roleDisplay: string,
  expiresInDays: number
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation to ${data.tenantName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">
                ${APP_NAME}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #18181b;">
                You've been invited!
              </h2>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #3f3f46;">
                Hi <strong>${data.name}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #3f3f46;">
                <strong>${data.inviterName}</strong> has invited you to join <strong>${data.tenantName}</strong> on ${APP_NAME} as a <strong>${roleDisplay}</strong>.
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #3f3f46;">
                ${APP_NAME} helps organizations track and manage their carbon emissions through automated utility bill processing and comprehensive reporting.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0 0 30px;">
                    <a href="${data.inviteLink}" 
                       style="display: inline-block; padding: 14px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Info Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef3c7; border-left: 4px solid: #f59e0b; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 16px; font-size: 14px; line-height: 1.5; color: #92400e;">
                    <strong>⏰ Time-sensitive:</strong> This invitation will expire in <strong>${expiresInDays} day${expiresInDays !== 1 ? 's' : ''}</strong>. 
                    Please accept it soon to get started.
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #3f3f46;">
                Your role as a <strong>${roleDisplay}</strong> includes:
              </p>

              ${getRolePermissionsHTML(data.role)}

              <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #71717a;">
                If you have any questions or need assistance, feel free to reply to this email or contact your administrator.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; font-size: 12px; color: #71717a;">
                This invitation was sent by ${data.inviterName} from ${data.tenantName}
              </p>
              <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                &copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>

        <!-- Alternative Link -->
        <table role="presentation" style="max-width: 600px; width: 100%; margin: 20px auto 0;">
          <tr>
            <td style="padding: 0 20px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #71717a; line-height: 1.5;">
                If the button above doesn't work, copy and paste this link into your browser:<br/>
                <a href="${data.inviteLink}" style="color: #10b981; text-decoration: underline; word-break: break-all;">
                  ${data.inviteLink}
                </a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Generates role-specific permissions HTML
 */
function getRolePermissionsHTML(role: 'admin' | 'clerk' | 'viewer'): string {
  const permissions = {
    admin: [
      'Full system access and configuration',
      'Manage users and assign roles',
      'Upload and manage utility bills',
      'Generate and export reports',
      'View comprehensive analytics',
    ],
    clerk: [
      'Upload utility bills and receipts',
      'Create and edit emission entries',
      'View basic dashboard metrics',
      'Access your organization\'s data',
    ],
    viewer: [
      'View dashboard and reports',
      'Download generated reports',
      'Access organization\'s emission data',
      'Read-only access to all features',
    ],
  };

  const rolePermissions = permissions[role];
  const items = rolePermissions.map(
    (perm) => `<li style="margin-bottom: 8px; color: #3f3f46;">${perm}</li>`
  ).join('');

  return `
    <ul style="margin: 0 0 20px; padding-left: 24px; font-size: 15px; line-height: 1.6;">
      ${items}
    </ul>
  `;
}

/**
 * Sends a password reset email (to be implemented)
 */
export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<boolean> {
  // TODO: Implement password reset email
  console.log('Password reset email not yet implemented');
  return false;
}

/**
 * Sends a welcome email after user completes registration (to be implemented)
 */
export async function sendWelcomeEmail(to: string, name: string, tenantName: string): Promise<boolean> {
  // TODO: Implement welcome email
  console.log('Welcome email not yet implemented');
  return false;
}
