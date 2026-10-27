import {
	resourceCount,
	resourceDiversityReport,
	resourceTypeCount,
	studentsTaughtReport,
	totalCoursesTaught
} from '$lib/server/reports';
import { findUser, getUserEmails } from '$lib/server/users.js';

async function getIndividuals(): Promise<string[]> {
	return getUserEmails();
}

async function getIndividualReports(email?: string) {
	if (!email) return null;

	const user = await findUser(email);
	if (!user) return null;

	const results = await Promise.all([
		studentsTaughtReport(user),
		totalCoursesTaught(user),
		resourceCount(user),
		resourceTypeCount(user),
		resourceDiversityReport(user)
	]);

	return {
		studentsTaught: results[0],
		general: {
			coursesTaughtCount: results[1],
			resourceCount: results[2],
			resourceTypeCount: results[3]
		},
		resourceDiversityReport: results[4]
	};
}

async function getFacultyReports() {
	return [];
}

export const load = async ({ url }) => {
	const email = url.searchParams.get('email')?.trim();
	return {
		emails: await getIndividuals(),
		individual: await getIndividualReports(email),
		faculty: await getFacultyReports()
	};
};
