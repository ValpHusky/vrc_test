import { randomBytes } from 'crypto';
import { ShareBoxURL } from './entity.ShareboxURL';

export function generateCode(): string {
    const buffer = randomBytes(5);
    return buffer.toString('base64url');
}

export function createShareBoxResponse(sharebox: ShareBoxURL) {
    return { id: sharebox.id, shortLink: `${process.env.BASE_URL}/${sharebox.code}` }
}

export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

export function generateExpirationDate(mins: number = 1): Date {
    const expirationDate = new Date(Date.now());
    expirationDate.setMinutes(expirationDate.getMinutes() + mins);
    return expirationDate;
}

