import { env } from '$env/dynamic/private';
import postgres from 'postgres';

if (!env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not configured');
}

export const sql = postgres(env.DATABASE_URL);

export async function initDb() {
	await sql.begin(async (tx) => {
		await tx`
      create table if not exists users (
        id          uuid primary key,
        email       text not null unique,
        name        text not null,
        accepted        boolean not null default FALSE,
        created_at  timestamptz not null default now()
      )
    `;

		await tx`
      create table if not exists resources (
        id          uuid primary key,
        owner_id    uuid not null references users(id) on delete cascade,
        type        text not null,
        licence     text not null,
        is_author   boolean not null,
        url         text not null,
        accepted        boolean not null default FALSE,
        created_at  timestamptz not null default now()
      )
    `;

		await tx`
      create table if not exists courses (
        id              uuid primary key,
        owner_id        uuid not null references users(id) on delete cascade,
        course_code     text not null,
        term            text not null,
        year            integer not null,
        num_students    integer check (num_students >= 0),
        accepted        boolean not null default FALSE,
        created_at      timestamptz not null default now()
      )
    `;

		await tx`
      create table if not exists course_resources (
        course_id   uuid not null references courses(id) on delete cascade,
        resource_id uuid not null references resources(id) on delete cascade,
        primary key (course_id, resource_id)
      )
    `;

		await tx`create index if not exists resources_owner_id_idx on resources (owner_id)`;
		await tx`create index if not exists courses_owner_id_idx on courses (owner_id)`;
		await tx`create index if not exists course_resources_resource_id_idx on course_resources (resource_id)`;

		console.log('DB initialized');
	});
}
