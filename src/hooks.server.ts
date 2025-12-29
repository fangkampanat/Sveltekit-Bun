import { redirect, type Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { getSession, createSession } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// Public routes that don't require authentication
const publicRoutes = ['/login'];

export const handle: Handle = async ({ event, resolve }) => {
    // Get session from cookie
    const session = getSession(event.cookies);

    if (session) {
        event.locals.user = {
            id: session.userId,
            username: session.username
        };
    } else if (dev) {
        // Auto-login as admin in development mode

        const adminUser = db.select().from(users).where(eq(users.username, 'admin')).get();

        if (adminUser) {
            createSession(event.cookies, {
                userId: adminUser.id,
                username: adminUser.username,
                createdAt: Date.now()
            });

            event.locals.user = {
                id: adminUser.id,
                username: adminUser.username
            };
        }
    }

    // Check if route requires authentication
    const isPublicRoute = publicRoutes.some((route) => event.url.pathname.startsWith(route));

    if (!isPublicRoute && !event.locals.user) {
        redirect(303, '/login');
    }

    // Redirect logged-in users away from login page
    if (event.locals.user && event.url.pathname === '/login') {
        redirect(303, '/');
    }

    return resolve(event);
};
