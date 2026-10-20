import { sql } from './db'

/**
 * Database type of a user
 */
type UserData = {
    id: string,
    name: string,
    email: string,
    accepted: boolean,
}

/**
 * Domain type of a user
 */
export type User = {
    id: string,
    name: string,
    email: string,
}

/**
 * Type check for user
 * @returns 
 */
export function isUser(input: unknown): input is User {
    if (typeof input !== 'object' || input === null) return false;
    
    const obj = input as Record<string, unknown>;
    return (
        typeof obj['id'] === 'string' &&
        typeof obj['name'] === 'string' &&
        typeof obj['email'] === 'string'
    )
}

/**
 * Fetches a user. Creates if does not exist
 * @returns 
 */
export const getUser = async (name: string, email: string): Promise<User> => {
    // Check if a user exists with the given email
    const [existing] = await sql<UserData[]>`select * from users where email = ${email}`
    if (existing) return toUser(existing);
    
    // Insert the new record
    const [created] = await sql<UserData[]>`
        insert into users (id, email, name)
        values (${crypto.randomUUID()}, ${email}, ${name})
        returning *
    `;

    return toUser(created);
}

/**
 * Utility for parsing a user object from a database record
 * @param record 
 * @returns 
 */
function toUser(record: UserData): User {
    return {
        id: record.id,
        name: record.name,
        email: record.email
    };
}