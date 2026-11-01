import { sql } from './db';
import type { User } from './users';

export async function studentsTaughtReport(user: User): Promise<{ year: number; total: number }[]> {
	const results = await sql<{ year: number; total: number }[]>`
        select year, sum(num_students)::int as total
        from courses
        where owner_id = ${user.id}
        group by year
        order by year
    `;

	return [...results];
}

export async function totalCoursesTaughtReport(user: User): Promise<number> {
	const [row] = await sql<{ total: number }[]>`
        select count(*)::int as total
        from courses
        where owner_id = ${user.id}
    `;
	return row.total;
}

export async function resourceCountReport(user: User): Promise<number> {
	const [row] = await sql<{ total: number }[]>`
        select count(*)::int as total
        from resources
        where owner_id = ${user.id}
    `;
	return row.total;
}

export async function resourceTypeCountReport(user: User): Promise<number> {
	const [row] = await sql<{ total: number }[]>`
        select count(distinct type)::int as total
        from resources
        where owner_id = ${user.id}
    `;
	return row.total;
}

export async function resourceDiversityReport(
	user: User
): Promise<{ type: string; total: number }[]> {
	const results = await sql<{ type: string; total: number }[]>`
        select type, count(*)::int as total
        from resources
        where owner_id = ${user.id}
        group by type
        order by type
    `;

	return [...results];
}
