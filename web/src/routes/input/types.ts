import type { licenceOptions, resourceOptions } from "./options"

export type ResourceInput = {
    id: string
    type?: typeof resourceOptions[number]
    licence?: typeof licenceOptions[number]
    isAuthor?: boolean
    url?: URL
}

export type CourseInput = {
    id: string
    resources: ResourceInput[]
    courseCode?: string
    termYear?: string
    numStudents?: number
}

export type FormInput = {
    firstName?: string
    lastName?: string
    emailAddress?: string
    rank?: string
    faculty?: string
    acedemicUnit?: string
    courses: CourseInput[]
}