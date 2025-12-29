import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { createSession, verifyPassword } from '$lib/server/auth';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const username = formData.get('username')?.toString().trim();
        const password = formData.get('password')?.toString();

        if (!username || !password) {
            return fail(400, { error: 'Username and password are required' });
        }

        // Find user
        const user = db.select().from(users).where(eq(users.username, username)).get();

        if (!user) {
            return fail(400, { error: 'Invalid username or password' });
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password_hash);

        if (!isValid) {
            return fail(400, { error: 'Invalid username or password' });
        }

        // Create session
        createSession(cookies, {
            userId: user.id,
            username: user.username,
            createdAt: Date.now()
        });

        redirect(303, '/');
    }
};
