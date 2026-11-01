import {
	resourceCountReport as resourceCountReport,
	resourceDiversityReport,
	resourceTypeCountReport,
	studentsTaughtReport,
	totalCoursesTaughtReport
} from '$lib/server/reports';
import { findUser, getUserEmails } from '$lib/server/users.js';

async function getIndividuals(): Promise<string[]> {
	return getUserEmails();
}

async function getIndividualReports(email?: string) {
	if (!email) return null;

	const user = await findUser(email);
	if (!user) return null;

	// Fetch reports in parallel
	const [
		studentsTaught,
		totalCoursesTaught,
		resourceCount,
		resourceTypeCount,
		resourceDiversity,
	] = await Promise.all([
		studentsTaughtReport(user),
		totalCoursesTaughtReport(user),
		resourceCountReport(user),
		resourceTypeCountReport(user),
		resourceDiversityReport(user)
	]);

	// Return Individual Reports to FE
	return {
		studentsTaught,
		resourceDiversity,
		general: {
			totalCoursesTaught,
			resourceCount,
			resourceTypeCount,
		},
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
