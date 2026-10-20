import { sql } from "./db";
import type { ResourceData } from "./resources";

/**
 * Database type of a course
 */
type CourseData = {
    id: string;
    owner_id: string;
    course_code: string;
    term_year: string;
    num_students: number;
    accepted: string;
}

/**
 * Domain type of a course
 */
export type Course = {
    id: string;
    owner: string;
    courseCode: string;
    termYear: string;
    numStudents: number;
    resources: string[];
}

/**
 * Type check for course
 * @returns 
 */
export function isCourse(input: unknown): input is Omit<Course, 'owner'> {
    if (typeof input !== 'object' || input === null) return false;
    
    const obj = input as Record<string, unknown>;

    // Validate resource IDs
    const resourceIds = obj['resourceIds']
    if (resourceIds !== undefined && (!Array.isArray(resourceIds) || !resourceIds.every(id => typeof id === 'string')))
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
export const addCourse = async (course: Course): Promise<Course> => {
    const resourceIds = [...new Set(course.resources ?? [])]
    console.log(JSON.stringify(course))

    console.log('Adding course 1')

    // Validate resources exist
    if (resourceIds.length > 0) {
        const existing = await sql<{id: string}[]>`
            select id
            from resources
            where id in ${sql(resourceIds)}
        `
        if (existing.length !== resourceIds.length)
            throw new Error(`Unable to create course due to unexisting resource in ${resourceIds}`)
    }

    console.log('Adding course 2')

    // Create the course
    const [courseData] = await sql<CourseData[]>`
        insert into courses (id, owner_id, course_code, term_year, num_students)
        values (${course.id},
                ${course.owner},
                ${course.courseCode},
                ${course.termYear},
                ${course.numStudents})
        returning *
    `;



    console.log('Adding course 3')

    console.log(resourceIds)

    // Link the course to it's resources
    if (resourceIds.length === 0) {
        return fromCourseData(courseData);
    }

    // Add in relations
    await sql`
        insert into course_resources ${sql(
            resourceIds.map(rid => ({ course_id: course.id, resource_id: rid }))
        )}
    `;

    // Return combined data
    return fromCourseData(courseData, resourceIds);
}

/**
 * Concurrently creates new courses
 * @returns 
 */
export const addCourses = async (courses: Course[]): Promise<Course[]> => {
    if (courses.length === 0) return []
    return Promise.all(courses.map(addCourse));
}

/**
 * Utility to combine DB course data and resource IDs into domain object
 * @returns
 */
function fromCourseData(record: CourseData, resourceIds?: string[]): Course {
    return {
        id: record['id'],
        owner: record['owner_id'],
        courseCode: record['course_code'],
        termYear: record['term_year'],
        numStudents: record['num_students'],
        resources: resourceIds ?? [],
    }
}
