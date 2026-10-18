import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import type { ResourceRecord } from '$lib/server/resources'
import type { CourseRecord } from '$lib/server/courses'
import { createUser } from '$lib/server/users'

// TODO: Better type safety
function parseResource(input: Record<string, unknown>): Omit<ResourceRecord, 'owner'> {
    if (input === null || input === undefined || typeof input !== 'object')
        throw new TypeError('Input of unexpected type received')
    return  {
        id: input.id as string,
        type: input.type as string,
        licence: input.licence as string,
        isAuthor: input.isAuthor as boolean,
        url: input.url as string,
    }
}

// TODO: Better type safety
function parseCourse(input: Record<string, unknown>): Omit<CourseRecord, 'owner'> {
    if (input === null || input === undefined || typeof input !== 'object')
        throw new TypeError('Input of unexpected type received')
    return  {
        id: input.id as string,
        courseCode: input.courseCode as string,
        termYear: input.termYear as string,
        numStudents: input.numStudents as number,
        resources: input.resources as string[],
    }
}

export const actions: Actions = {
    default: async ({ request }) => {
        const raw = await request.formData()
        if (!raw) {
            return fail(400)
        }

        const payload = raw.get("payload")
        if (!payload || typeof payload !== 'string') {
            return fail(400)
        }
        
        const data = JSON.parse(payload)
        
        try {
            if (typeof data["name"] !== 'string' || typeof data["email"] !== 'string')
                throw new TypeError("Unexpected input")

            const userId = await createUser(data["name"], data["email"])
            

            // Parse resources and courses
            const resources = data['resources']?.map(parseResource);
            const courses = data['courses']?.map(parseCourse);

            
        } catch (err) {
            console.error("Failed", err);
            return fail(400);
        }

        return { success: true };
    }
}