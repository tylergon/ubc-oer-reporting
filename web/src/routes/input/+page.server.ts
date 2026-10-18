import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData()
        const payload = data.get("payload")
        console.log(payload);
        // console.log(payload?.get("email"))

        
        if (!payload) return fail(400)
        if (!(typeof payload === 'string'))
        if (!data) {
            return fail(400)
        }
            
        
        console.log(JSON.parse(payload as string));
        try {
            const member = {
                id: crypto.randomUUID(),
                name: data.get("name"),
                email: data.get("email"),
            }
            console.log(member)
        } catch (err) {
            console.error("Failed");
        }

        return { success: true };
    }
}