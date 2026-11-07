import crypto from "crypto";

// No 0, O, 1, I so codes are easy to read and type
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function chunk(length: number) {
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export function generateTicketCode() {
  return `SB-${chunk(4)}-${chunk(4)}`;
}