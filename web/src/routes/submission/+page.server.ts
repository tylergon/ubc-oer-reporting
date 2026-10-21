import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { addResources, isResourceInput } from '$lib/server/resources'
import { addCourses, isCourse as isCourseInput } from '$lib/server/courses'
import { getUser as getUser } from '$lib/server/users'

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
            // Create or fetch the user
            if (typeof data["name"] !== 'string' || typeof data["email"] !== 'string')
                throw new TypeError("Unexpected input")
            const user = await getUser(data["name"], data["email"])
            console.log(`[${user.id}]: Processing`)

            // Create resources
            const resourceInput = data['resources'];
            if (Array.isArray(resourceInput) && resourceInput.length > 0) {
                if (!resourceInput.every(isResourceInput))
                    throw new Error(`Unexpected resource found in input: ${JSON.stringify(resourceInput)}`)
                console.log(`[${user.id}]: Creating resources with IDs: ${resourceInput.map(r => r.id)}`)
                await addResources(resourceInput.map(r => ({...r, owner: user.id})));
            }
                
            // Create courses
            const courseInput = data['courses'];
            if (Array.isArray(courseInput) && courseInput.length > 0) {
                if (!courseInput.every(isCourseInput))
                    throw new Error(`Unexpected course found in input: ${JSON.stringify(courseInput)}`)
                console.log(`[${user.id}]: Creating courses with IDs: ${courseInput.map(c => c.id)}`)
                await addCourses(courseInput.map(c => ({...c, owner: user.id})));
            }
        } catch (err) {
            console.error("Failed", err);
            return fail(400);
        }

        return { success: true };
    }
}