// Generate a random 6-digit verification code and set it in the state
export const generateVerificationCode = () => {
  const randomNumber: number = Math.floor(Math.random() * 900000) + 100000;
  const verificationCode: string = randomNumber.toString();

  return { code: verificationCode, createdAt: Date.now() };
};

// Send a verification email to the user
export const signUpVerificationTemplate = (code: string) => {
  return `
        <h1>Your verification code is:</h1>
        <h2 style="color: 0096FF">${code}</h2>
        <p>This code will expire in 5 minutes.</p>

        <p>If you didn't request this code, you can safely ignore this email.</p>

        <p>Thanks,</p>
        <p>The Echo Team</p>

        <p style="color: #A0AEC0">This is an automated email, please do not reply.</p>

        <p style="color: #A0AEC0">© 2021 Echo. All rights reserved.</p>
  `;
};

export const verifyCode = (
  code: string,
  email: string,
  verificationCode: string,
  setVerified: any,
  setError: any
) => {
  if (code === verificationCode) {
    setVerified(email);
    setError(null);
  } else {
    setError("Invalid verification code.");
  }
};
