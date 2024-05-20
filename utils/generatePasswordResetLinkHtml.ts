const generatePasswordResetLinkHtml = (resetLink: string) => {
  return `
        <h1>Reset Your Password</h1>
        <p>You have requested to reset your password. Click the link below to reset your password. The link will be expired after 5 minutes.</p>
        <a href="${resetLink}" style="color: #0096FF">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
    
        <p>Thanks,</p>
        <p>The Echo Team</p>
    
        <p style="color: #A0AEC0">This is an automated email, please do not reply.</p>
    
        <p style="color: #A0AEC0">© 2024 Echo. All rights reserved.</p>
    `;
};

export default generatePasswordResetLinkHtml;
