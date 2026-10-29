<script lang="ts">
	import { onMount } from 'svelte';
	import StaffSearch from '$lib/components/StaffSearch.svelte';
	import type { FacultyData, Position, Staff, UnitData } from '$lib/types';
	import { licenceOptions, resourceOptions, termYearOptions } from './options';
	import type { CourseInput, FormInput, ResourceInput } from './types';
	import { X } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	let { form } = $props();

	let input: FormInput = $state({ resources: [], courses: [] });
	let staff: Staff | undefined = $state();
	let faculties: FacultyData[] = $state([]);
	let units: UnitData[] = $state([]);

	// Load faculty & unit data
	onMount(async () => {
		try {
			const res = await Promise.all([fetch('/data/faculties.json'), fetch('/data/units.json')]);

			if (!res.every((r) => r.ok)) throw new Error('Failed to load data');
			[faculties, units] = await Promise.all(res.map((r) => r.json()));
		} catch (err) {
			console.error(err);
		}
	});

	function addCourse() {
		input.courses.push({ id: crypto.randomUUID(), resources: [] });
	}

	function addResource() {
		input.resources.push({ id: crypto.randomUUID() });
	}

	function removePosition(index: number) {
		staff = {
			name: staff?.name ?? '',
			positions: staff?.positions.filter((_, i) => i !== index) ?? []
		};
	}

	function removeCourse(course: CourseInput) {
		input.courses = input.courses.filter((c) => c.id !== course.id);
	}

	function removeResource(resource: ResourceInput) {
		input.resources = input.resources.filter((r) => r.id !== resource.id);
	}
</script>

<h1>Submission Form</h1>

<p>Please search you name, confirm held positions, and enter relevant class and OER data.</p>

<StaffSearch bind:value={staff} />

{#if staff && faculties && units}
	<form
		method="POST"
		class="flex flex-col gap-2"
		use:enhance={({ formData, cancel }) => {
			// Do validation here...
			if (!staff) return;

			// Create the resulting object
			formData.set(
				'payload',
				JSON.stringify({
					...staff,
					...input
				})
			);

			return async ({ update }) => {
				await update({ reset: false });
			};
		}}
	>
		<div class="flex flex-col gap-2">
			<h2>Basic Information</h2>

			<div>
				<label for="name" class="tag">Name</label>
				<input
					type="text"
					class="field field-disabled"
					name="name"
					id="name"
					bind:value={staff.name}
					disabled
					required
				/>
			</div>

			<div>
				<label for="email" class="tag">Email</label>
				<input
					type="email"
					class="field"
					name="email-address"
					id="email-address"
					bind:value={input.email}
					placeholder="Enter email address"
					required
				/>
			</div>

			<ul class="space-y-2">
				<label for="positions" class="tag">
					Position{staff.positions.length > 1 ? 's' : ''}
				</label>

				{#each staff?.positions as position, index (position.unit_id)}
					<li class="flex items-center gap-2">
						{#if staff.positions.length > 1}
							<X class="text-gray-500 hover:text-gray-800" onclick={() => removePosition(index)} />
						{/if}
						<p class="field field-disabled">
							<b>{position.rank}</b> -
							{#if position.unit_id}
								{faculties.find((f) => f.id === position.faculty_id)?.name}
								({units.find((u) => u.id === position.unit_id)?.name})
							{:else}
								{faculties.find((f) => f.id === position.faculty_id)?.name}
							{/if}
						</p>
					</li>
				{:else}
					{#if staff !== undefined}
						Unable to find positions, please reach out to the team for details
					{/if}
				{/each}
			</ul>
		</div>

		<h2>Courses and OER Resources</h2>

		{#each input.resources as resource, i (resource.id)}
			<div class="flex flex-col gap-2">
				<div>
					<label class="tag" for={`resource-type-{i}`}>Type</label>
					<select
						class="field field-select"
						name="resource-type"
						id="resource-type-{i}"
						bind:value={resource.type}
						required
					>
						<option value="" selected disabled hidden>Please choose an option</option>
						{#each resourceOptions as type}
							<option value={type}>{type}</option>
						{/each}
					</select>
				</div>

				<div>
					<label class="tag" for={`resource-url-{i}`}>URL</label>
					<input
						class="field"
						type="url"
						name={`resource-url-{resource.id}`}
						id={`resource-url-{resource.id}`}
						bind:value={resource.url}
						placeholder="Enter resource URL"
						required
					/>
				</div>

				<div>
					<label class="tag" for={`resource-license-{resource.id}`}>Resource license</label>
					<select
						class="field field-select"
						name={`resource-license-{resource.id}`}
						id={`resource-url-{resource.id}`}
						bind:value={resource.licence}
						required
					>
						<option value="" selected disabled hidden>Please choose an option</option>
						{#each licenceOptions as licence}
							<option value={licence}>{licence}</option>
						{/each}
					</select>
				</div>

				<div>
					<label class="tag" for={`resource-author-{resource.id}`}
						>Are you the author of this resource?</label
					>
					<select
						class="field field-select"
						name={`resource-author-{resource.id}`}
						id={`resource-author-{resource.id}`}
						bind:value={resource.isAuthor}
						required
					>
						<option value="" selected disabled hidden>Please choose an option</option>
						<option value={true}>Yes</option>
						<option value={false}>No</option>
					</select>
				</div>

				<button class="btn btn-sm" type="button" onclick={() => removeResource(resource)}>
					Remove resource
				</button>
			</div>
		{/each}

		<button class="btn btn-sm" type="button" onclick={() => addResource()}> Add resource </button>

		<h2>Course</h2>

		{#each input.courses as course, i (course.id)}
			<div>
				<label for={`course-code-{index}`} class="tag">Course Code</label>
				<input
					class="field"
					type="text"
					name={`course-code-{i}`}
					id={`course-code-{i}`}
					placeholder="Enter course code"
					bind:value={course.courseCode}
					required
				/>
			</div>

			<!-- TODO: Fix this w/ a select -->
			<div>
				<label for={`term-year-{index}`} class="tag">Academic Period</label>

				<select
					class="field field-select"
					name={`term-year-{i}`}
					id={`term-year-{i}`}
					bind:value={course.termYear}
					required
				>
					<option value="" selected disabled hidden>Please choose an option</option>
					{#each termYearOptions as period}
						<option value={period}>{period}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for={`num-students-{index}`} class="tag"> Number of students </label>
				<input
					type="number"
					min="0"
					step="1"
					name={`num-students-{i}`}
					id={`num-students-{i}`}
					placeholder="Enter number of students"
					bind:value={course.numStudents}
					required
				/>
			</div>

			<div>
				<label for={`num-students-{index}`} class="tag"> Resources </label>
				<select multiple bind:value={course.resources}>
					{#each input.resources as resource}
						<option value={resource.id}>{resource.url}</option>
					{/each}
				</select>
			</div>

			<button class="btn btn-sm" type="button" onclick={() => removeCourse(course)}>
				Remove resource
			</button>
		{/each}

		<button class="btn btn-sm" type="button" onclick={addCourse}> Add course </button>

		<button class="btn btn-sm" type="submit"> Submit </button>
	</form>
{/if}
