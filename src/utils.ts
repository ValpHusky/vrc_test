import { randomBytes } from 'crypto';

export function generateCode(): string {
    // Generate 6 random bytes.
    const buffer = randomBytes(5);

    // Convert to a URL-safe base64 string. This will be 8 characters long.
    // (6 bytes * 8 bits/byte) / 6 bits/char = 8 characters.
    // It replaces '+' with '-' and '/' with '_', and removes padding.
    return buffer.toString('base64url');
}

