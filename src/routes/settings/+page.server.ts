import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { hashPassword, verifyPassword } from '$lib/server/auth';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        redirect(303, '/login');
    }

    return {
        user: locals.user
    };
};

export const actions: Actions = {
    changePassword: async ({ request, locals }) => {
        if (!locals.user) {
            redirect(303, '/login');
        }

        const formData = await request.formData();
        const currentPassword = formData.get('currentPassword')?.toString() || '';
        const newPassword = formData.get('newPassword')?.toString() || '';
        const confirmPassword = formData.get('confirmPassword')?.toString() || '';

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            return fail(400, {
                error: 'All fields are required'
            });
        }

        if (newPassword !== confirmPassword) {
            return fail(400, {
                error: 'New passwords do not match'
            });
        }

        if (newPassword.length < 6) {
            return fail(400, {
                error: 'New password must be at least 6 characters'
            });
        }

        // Get current user from database
        const user = db.select().from(users).where(eq(users.id, locals.user.id)).get();

        if (!user) {
            return fail(400, {
                error: 'User not found'
            });
        }

        // Verify current password
        const isValid = await verifyPassword(currentPassword, user.password_hash);
        if (!isValid) {
            return fail(400, {
                error: 'Current password is incorrect'
            });
        }

        // Hash new password and update
        const newPasswordHash = await hashPassword(newPassword);
        db.update(users)
            .set({
                password_hash: newPasswordHash,
                updated_at: new Date()
            })
            .where(eq(users.id, locals.user.id))
            .run();

        return {
            success: true,
            message: 'Password changed successfully'
        };
    }
};
