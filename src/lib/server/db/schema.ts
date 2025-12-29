import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: text('id').primaryKey().$defaultFn(() => Bun.randomUUIDv7()),
	username: text('username').notNull().unique(),
	password_hash: text('password_hash').notNull(),
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});
