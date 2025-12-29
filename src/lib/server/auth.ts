import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Get secret key from environment or use dev default
function getSecretKey(): string {
    const secret = env.AUTH_SECRET;
    if (!secret) {
        if (dev) {
            return 'dev-secret-key-do-not-use-in-production';
        }
        throw new Error('AUTH_SECRET environment variable is not set');
    }
    return secret;
}

// Create HMAC signature using Bun.CryptoHasher
function createSignature(data: string): string {
    const secret = getSecretKey();
    const hasher = new Bun.CryptoHasher('sha256', secret);
    hasher.update(data);
    return hasher.digest('hex');
}

// Verify HMAC signature
function verifySignature(data: string, signature: string): boolean {
    const expectedSignature = createSignature(data);
    return expectedSignature === signature;
}

// Session data structure
export interface SessionData {
    userId: string;
    username: string;
    createdAt: number;
}

// Create a signed session cookie
export function createSession(cookies: Cookies, data: SessionData): void {
    const payload = JSON.stringify(data);
    const signature = createSignature(payload);
    const cookieValue = `${Buffer.from(payload).toString('base64')}.${signature}`;

    cookies.set(COOKIE_NAME, cookieValue, {
        path: '/',
        httpOnly: true,
        secure: !dev,
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE
    });
}

// Get and verify session from cookie
export function getSession(cookies: Cookies): SessionData | null {
    const cookieValue = cookies.get(COOKIE_NAME);
    if (!cookieValue) return null;

    const parts = cookieValue.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;

    try {
        const payload = Buffer.from(encodedPayload, 'base64').toString('utf-8');

        if (!verifySignature(payload, signature)) {
            return null;
        }

        const data = JSON.parse(payload) as SessionData;

        // Check if session is expired (7 days)
        const now = Date.now();
        if (now - data.createdAt > COOKIE_MAX_AGE * 1000) {
            return null;
        }

        return data;
    } catch {
        return null;
    }
}

// Clear session cookie
export function clearSession(cookies: Cookies): void {
    cookies.delete(COOKIE_NAME, { path: '/' });
}

// Hash password using Bun.password
export async function hashPassword(password: string): Promise<string> {
    return await Bun.password.hash(password, {
        algorithm: 'argon2id',
        memoryCost: 65536,
        timeCost: 2
    });
}

// Verify password using Bun.password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(password, hash);
}
