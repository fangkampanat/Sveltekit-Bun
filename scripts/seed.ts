import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { users } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL || 'local.db';

async function seed() {
    console.log('🌱 Seeding database...');

    const client = new Database(DATABASE_URL);
    const db = drizzle(client);

    // Create tables if not exists
    client.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id TEXT PRIMARY KEY,
			username TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL
		)
	`);

    // Check if admin user exists
    const existingAdmin = db.select().from(users).where(eq(users.username, 'admin')).get();

    if (!existingAdmin) {
        // Hash the default password
        const passwordHash = await Bun.password.hash('admin123', {
            algorithm: 'argon2id',
            memoryCost: 65536,
            timeCost: 2
        });

        // Insert admin user
        db.insert(users).values({
            username: 'admin',
            password_hash: passwordHash
        }).run();

        console.log('✅ Created admin user');
    } else {
        console.log('ℹ️  Admin user already exists');
    }

    console.log('✅ Seeding complete!');
    client.close();
}

seed().catch(console.error);
