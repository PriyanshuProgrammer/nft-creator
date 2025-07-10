import authenticator from "authenticator";
import crypto from "crypto";

export const generateTotp = (email: string) => {
  const hashkey = crypto.createHash("sha256").update(email).digest("hex");
  const totp = authenticator.generateToken(hashkey);
  return totp;
};

export const verifyTotp = (totp: string, email: string) => {
  const hashkey = crypto.createHash("sha256").update(email).digest("hex");
  const verify = authenticator.verifyToken(hashkey, totp);
  return verify;
};
