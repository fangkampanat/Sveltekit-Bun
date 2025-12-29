import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/auth';
import { eq, ne, asc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        redirect(303, '/login');
    }

    // Only admin can access this page
    if (locals.user.username !== 'admin') {
        redirect(303, '/settings');
    }

    // Get all users except admin
    const allUsers = db.select({
        id: users.id,
        username: users.username,
        created_at: users.created_at,
        updated_at: users.updated_at
    })
        .from(users)
        .where(ne(users.username, 'admin'))
        .orderBy(asc(users.username))
        .all();

    return {
        users: allUsers
    };
};

export const actions: Actions = {
    createUser: async ({ request, locals }) => {
        if (!locals.user || locals.user.username !== 'admin') {
            redirect(303, '/login');
        }

        const formData = await request.formData();
        const username = formData.get('username')?.toString()?.trim() || '';
        const password = formData.get('password')?.toString() || '';

        // Validation
        if (!username || !password) {
            return fail(400, { error: 'Username and password are required' });
        }

        if (username.length < 3) {
            return fail(400, { error: 'Username must be at least 3 characters' });
        }

        if (password.length < 6) {
            return fail(400, { error: 'Password must be at least 6 characters' });
        }

        // Check if username already exists
        const existing = db.select()
            .from(users)
            .where(eq(users.username, username))
            .get();

        if (existing) {
            return fail(400, { error: 'Username already exists' });
        }

        // Create user
        const passwordHash = await hashPassword(password);
        db.insert(users).values({
            username,
            password_hash: passwordHash
        }).run();

        return { success: true, message: 'User created successfully' };
    },

    updatePassword: async ({ request, locals }) => {
        if (!locals.user || locals.user.username !== 'admin') {
            redirect(303, '/login');
        }

        const formData = await request.formData();
        const userId = formData.get('userId')?.toString() || '';
        const newPassword = formData.get('newPassword')?.toString() || '';

        if (!userId || !newPassword) {
            return fail(400, { error: 'User ID and new password are required' });
        }

        if (newPassword.length < 6) {
            return fail(400, { error: 'Password must be at least 6 characters' });
        }

        // Verify user exists and is not admin
        const user = db.select().from(users).where(eq(users.id, userId)).get();
        if (!user || user.username === 'admin') {
            return fail(400, { error: 'User not found or cannot be modified' });
        }

        const passwordHash = await hashPassword(newPassword);
        db.update(users)
            .set({
                password_hash: passwordHash,
                updated_at: new Date()
            })
            .where(eq(users.id, userId))
            .run();

        return { success: true, message: 'Password updated successfully' };
    },

    deleteUser: async ({ request, locals }) => {
        if (!locals.user || locals.user.username !== 'admin') {
            redirect(303, '/login');
        }

        const formData = await request.formData();
        const userId = formData.get('userId')?.toString() || '';

        if (!userId) {
            return fail(400, { error: 'User ID is required' });
        }

        // Verify user exists and is not admin
        const user = db.select().from(users).where(eq(users.id, userId)).get();
        if (!user || user.username === 'admin') {
            return fail(400, { error: 'User not found or cannot be deleted' });
        }

        db.delete(users).where(eq(users.id, userId)).run();

        return { success: true, message: 'User deleted successfully' };
    }
};
