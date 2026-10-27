import type { licenceOptions, resourceOptions } from './options';

export type ResourceInput = {
	id: string;
	type: (typeof resourceOptions)[number];
	licence: (typeof licenceOptions)[number];
	isAuthor: boolean;
	url: URL;
};

export type CourseInput = {
	id: string;
	resources: string[];
	courseCode: string;
	termYear: string;
	numStudents: number;
};

export type FormInput = {
	email?: string;
	resources: Partial<ResourceInput>[];
	courses: Partial<CourseInput>[];
};
