export const OTP_EMAIL_TEMPLATE = `
Content-Type: text/plain; charset="UTF-8"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
to:{{to}}
from:{{from}}
subject: OTP to verify your email

Please put in this code: {{otpCode}}, Code expires in 5 minutes.
`;
