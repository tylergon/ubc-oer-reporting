<script lang="ts">
    import { facultyOptions, rankOptions, resourceOptions, termYearOptions, unitOptions } from "./options";
    import type { CourseInput, FormInput, ResourceInput } from "./types";

    let form: FormInput = $state({ courses: [] })
    
    function addCourse() {
        form.courses.push({ id: crypto.randomUUID(), resources: [] })
    }

    function addResource(course: CourseInput) {
        course.resources.push({ id: crypto.randomUUID() });
    }

    // function removeCourse(course: CourseInput) {
    //     courses = courses.filter(c => c.id !== course.id)
    // }

    // function removeResource(course: CourseInput, resource: ResourceInput) {
    //     course = { ...course, resources: course.resources.filter(r => r.id !== resource.id) }
    // }
</script>

<h1>Submission Form</h1>

<form method="POST" class='flex flex-col gap-2'>
    <div class='flex flex-col gap-2'>
        <h2>Section 1: Basic Information</h2>

        <div>
            <label for='first-name'>First Name</label>
            <input
                type='text'
                name='first-name'
                id='first-name'
                bind:value={form.firstName}
                placeholder='Enter first name' required
            />
        </div>

        <div>
            <label for='last-name'>Last Name</label>
            <input
                type='text'
                name='last-name'
                id='last-name'
                bind:value={form.lastName}
                placeholder='Enter last name' 
                required
            />
        </div>
        
        <div>
            <label for='email'>Email</label>
            <input
                type='email'
                name='email-address'
                id='email-address'
                bind:value={form.emailAddress}
                placeholder='Enter email address'
                required
            />
        </div>

        <div>
            <label for='rank'>Rank</label>
            <select name='rank' id='rank' bind:value={form.rank} required>
                <option value='' selected disabled hidden>--Please choose an option--</option>
                {#each rankOptions as rank}
                    <option value={rank.toLocaleLowerCase().replace(' ', '-')}>{rank}</option>
                {/each}
            </select>
        </div>

        <div>
            <label for='faculty'>Faculty</label>
            <select name='faculty' id='faculty' bind:value={form.faculty} required>
                <option value='' selected disabled hidden>--Please choose an option--</option>
                {#each facultyOptions as faculty}
                    <option value={faculty.toLocaleLowerCase().replace(' ', '-')}>{faculty}</option>
                {/each}
            </select>
        </div>

        <div>
            <label for='academic-unit'>Academic Unit</label>
            <select name='academic-unit' id='academic-unit' bind:value={form.acedemicUnit} required>
                <option value='' selected disabled hidden>--Please choose an option--</option>
                {#each unitOptions as unit}
                    <option value={unit.toLocaleLowerCase().replace(' ', '-')}>{unit}</option>
                {/each}
            </select>
        </div>
    </div>


    <!-- TODO : Bind the form stuff -->
    <div class='flex flex-col gap-2'>
        <h2>Section 2: Courses and OER Resources</h2>

        {#each form.courses as course, i (course.id)}
            <div>
                <label for={`course-code-{index}`}>Course Code</label>
                <input
                    type='text'
                    name={`course-code-{i}`}
                    id={`course-code-{i}`}
                    placeholder='Enter course code'
                    bind:value={course.courseCode}
                    required
                />
            </div>

            <div>
                <label for={`term-year-{index}`}>Academic Period</label>
                <input
                    type='text'
                    name={`term-year-{i}`}
                    id={`term-year-{i}`}
                    placeholder='Enter academic period'
                    bind:value={course.termYear}
                    required
                />
            </div>

            <div>
                <label for={`num-students-{index}`}>Number of students</label>
                <input
                    type='number'
                    min=0
                    step=1
                    name={`num-students-{i}`}
                    id={`num-students-{i}`}
                    placeholder='Enter number of students'
                    bind:value={course.numStudents}
                    required
                />
            </div>
            
            <!-- TODO: Put in the resources... -->
        {/each}

        <button type='button' onclick={addCourse}>
            Add course
        </button>
    </div>
</form>

<style>
    @import "tailwindcss";

    label {
        @apply font-bold;
    }

    input {
        @apply border rounded-sm border-slate-200 px-1;
    }

    button {
        @apply border rounded-sm border-slate-400 px-1 self-start hover:bg-slate-100 transition-colors duration-200;
    }

    .container {
        @apply flex flex-col gap-2;
    }
</style>