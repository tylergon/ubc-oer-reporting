import { sql } from './db';
import type { ResourceData } from './resources';

type CourseInput = {
	id: string;
	owner: string;
	courseCode: string;
	termYear: string;
	numStudents: number;
	resources: string[];
};

/**
 * Database type of a course
 */
type CourseData = {
	id: string;
	owner_id: string;
	course_code: string;
	term: string;
	year: number;
	num_students: number;
	accepted: string;
};

/**
 * Domain type of a course
 */
export type Course = {
	id: string;
	owner: string;
	courseCode: string;
	term: string;
	year: number;
	numStudents: number;
	resources: string[];
};

/**
 * Type check for course
 * @returns
 */
export function isCourse(input: unknown): input is Omit<CourseInput, 'owner'> {
	if (typeof input !== 'object' || input === null) return false;

	const obj = input as Record<string, unknown>;

	// Validate resource IDs
	const resourceIds = obj['resourceIds'];
	if (
		resourceIds !== undefined &&
		(!Array.isArray(resourceIds) || !resourceIds.every((id) => typeof id === 'string'))
	)
		return false;

	// Validate primitives & return
	return (
		typeof obj['id'] === 'string' &&
		typeof obj['courseCode'] === 'string' &&
		typeof obj['termYear'] === 'string' &&
		typeof obj['numStudents'] === 'number'
	);
}

/**
 * Creates a course
 * @param course The course to be created
 * @returns
 */
export const addCourse = async (course: CourseInput): Promise<Course> => {
	const resourceIds = [...new Set(course.resources ?? [])];
	console.log(JSON.stringify(course));

	console.log('Adding course 1');

	// Validate resources exist
	if (resourceIds.length > 0) {
		const existing = await sql<{ id: string }[]>`
            select id
            from resources
            where id in ${sql(resourceIds)}
        `;
		if (existing.length !== resourceIds.length)
			throw new Error(`Unable to create course due to unexisting resource in ${resourceIds}`);
	}

	const year = Number(course['termYear'].slice(0, 4));
	const term = course['termYear'].slice(4, 6);

	// Create the course
	const [courseData] = await sql<CourseData[]>`
        insert into courses (id, owner_id, course_code, term, year, num_students)
        values (${course.id},
                ${course.owner},
                ${course.courseCode},
                ${term},
                ${year},
                ${course.numStudents})
        returning *
    `;

	// Link the course to it's resources
	if (resourceIds.length === 0) {
		return fromCourseData(courseData);
	}

	// Add in relations
	await sql`
        insert into course_resources ${sql(
					resourceIds.map((rid) => ({
						course_id: course.id,
						resource_id: rid
					}))
				)}
    `;

	// Return combined data
	return fromCourseData(courseData, resourceIds);
};

/**
 * Concurrently creates new courses
 * @returns
 */
export const addCourses = async (courses: CourseInput[]): Promise<Course[]> => {
	if (courses.length === 0) return [];
	return Promise.all(courses.map(addCourse));
};

/**
 * Utility to combine DB course data and resource IDs into domain object
 * @returns
 */
function fromCourseData(record: CourseData, resourceIds?: string[]): Course {
	return {
		id: record['id'],
		owner: record['owner_id'],
		courseCode: record['course_code'],
		term: record['term'],
		year: record['year'],
		numStudents: record['num_students'],
		resources: resourceIds ?? []
	};
}
