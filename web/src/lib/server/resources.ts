import { sql } from "./db";

/**
 * Database type of a resource
 */
export type ResourceData = {
    id: string
    owner_id: string
    type: string
    licence: string
    is_author: boolean
    url: string
}

/**
 * Domain type of a resource
 */
export type Resource = {
    id: string,
    owner: string,
    type: string,
    licence: string,
    isAuthor: boolean,
    url: string,
}

/**
 * Type check for resources
 * @returns 
 */
export function isResourceInput(input: unknown): input is Omit<Resource, 'owner'> {
    if (typeof input !== 'object' || input === null) return false;
    
    const obj = input as Record<string, unknown>;
    return (
        typeof obj['id'] ===  'string' &&
        typeof obj['type'] ===  'string' &&
        typeof obj['licence'] ===  'string' &&
        typeof obj['isAuthor'] ===  'boolean' &&
        typeof obj['url'] ===  'string'
    );
}

/**
 * Creates new resources
 * @returns 
 */
export const addResources = async (input: Resource[]): Promise<Resource[]> => {
    if (input.length === 0) return [];

    const resources = input.map(toResourceData)
    
    // Write to the database
    const results = await sql<ResourceData[]>`
        insert into resources ${sql(resources)}
        returning *
    `;

    // Parse and return results
    return results.map(fromResourceData);
}

/**
 * Utility to create a record for the database
 * @param resource 
 * @returns 
 */
function toResourceData(resource: Resource): ResourceData {
    return {
        id: resource.id,
        owner_id: resource.owner,
        type: resource.type,
        licence: resource.licence,
        is_author: resource.isAuthor,
        url: resource.url,
    }
}

/**
 * Utility to parse a resource from database
 * @returns 
 */
function fromResourceData(record: ResourceData): Resource {
    return {
        id: record['id'],
        owner: record['owner_id'],
        type: record['type'],
        licence: record['licence'],
        isAuthor: record['is_author'],
        url: record['url'],
    }
}
