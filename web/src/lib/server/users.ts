import { sql } from './db'

export type UserRecord = {
    id: string,
    name: string,
    email: string,
    accepted: boolean,
}


/**
 * Create a new user. If one exists, the current is returned
 * @param name 
 * @param email 
 * @returns 
 */
export const createUser = async (name: string, email: string): Promise<UserRecord> => {
    // Check if a user exists with the given email
    const [existing] = await sql<UserRecord[]>`select * from users where email = ${email}`
    if (existing) return existing;
    
    // Insert the new record
    const [created] = await sql<UserRecord[]>`
        insert into users (id, email, name)
        values (${crypto.randomUUID()}, ${email}, ${name})
        returning *
    `;

    return created;
}