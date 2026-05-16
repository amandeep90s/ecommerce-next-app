export function generateOTP(length: number = 6): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  return otp.substring(0, length);
}
