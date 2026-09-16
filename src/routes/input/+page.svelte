<script lang="ts">

    const rankOptions: string[] = [
        'Assistant Professor',
        'Assistant Professor of Teaching',
        'Associate Professor',
        'Associate Professor of Teaching',
        'Full Professor',
        'Full Professor of Teaching',
        'Lecturer',
        'Postdoctoral Teaching Fellow'
    ];

    const facultyOptions: string[] = ['Forestry', 'Computer Science'];
    const unitOptions: string[] = ['Forest Resource Management', 'Urban Forestry']

    const resourceOptions = [
        'Textbook',
        'Web Resource',
        'Activities and Assignments',
        'Courses and Course Modules',
        'Videos',
        'Workshops and Training',
        'Quizzes, Tests and Problem Sets',
        'Animations and Simulations',
        'Presentations',
    ] as const;

    const licenceOptions = [
        'CC BY-NC-SA',
        'CC BY-NC',
        'CC BY-SA ',
        'CC BY',
        'CC BY-NC-ND',
        'CC BY-ND',
        'Other'
    ] as const;

    type resource = {
        type: typeof resourceOptions[number] | ''
        licence: typeof licenceOptions[number] | ''
        isAuthor: boolean
        url: URL | ''
    }

    let resources: object[] = $state([])

    const addEmptyResource = () => {
        const emptyResource: resource = {
            type: '',
            licence: '',
            isAuthor: false,
            url: ''
        }
        resources = [...resources, emptyResource]
    }


</script>

<h1>Input</h1>

<form method="POST" class='flex flex-col gap-2'>
    <h2>Section 1: Basic Information</h2>
    <!-- TODO: See if first name last name can be looked up -->
    <div>
        <label for='first-name'>First Name</label>
        <input type='text' name='first-name' id='first-name' placeholder='Enter first name' required/>
    </div>

    <div>
        <label for='last-name'>Last Name</label>
        <input type='text' name='last-name' id='last-name' placeholder='Enter last name' required/>
    </div>

    <div>
        <label for='email-address'>Email Address</label>
        <input type='email' name='email-address' id='email address' placeholder='Enter email address' required/>
    </div>    

    <div>
        <label for='rank'>Rank</label>
        <select name='rank' id='rank' required>
            <option value='' selected disabled hidden>--Please choose an option--</option>
            {#each rankOptions as rank}
                <option value={rank.toLocaleLowerCase().replace(' ', '-')}>{rank}</option>
            {/each}
        </select>
    </div>

    <div>
        <label for='faculty'>Faculty</label>
        <select name='faculty' id='faculty' required>
            <option value='' selected disabled hidden>--Please choose an option--</option>
            {#each facultyOptions as faculty}
                <option value={faculty.toLocaleLowerCase().replace(' ', '-')}>{faculty}</option>
            {/each}
        </select>
    </div>
    
    <div>
        <label for='academic-unit'>Academic Unit</label>
        <select name='academic-unit' id='academic-unit' required>
            <option value='' selected disabled hidden>--Please choose an option--</option>
            {#each unitOptions as unit}
                <option value={unit.toLocaleLowerCase().replace(' ', '-')}>{unit}</option>
            {/each}
        </select>
    </div>

    <h2>Section 2: Courses & OER</h2>

    <div class='flex flex-col gap-4'>
        <!-- TODO: Create a delete button -->
        {#each resources as resource, index}
            <div class='container'>
                <h3>OER Resource {index + 1}</h3>

                <div>
                    <label for='resource-type'>Type</label>  
                    <select name='resource-type' id='resource-type' required>
                        <option value='' selected disabled hidden>--Please choose an option--</option>
                        {#each resourceOptions as type}
                            <option value={type.toLocaleLowerCase().replace(' ', '-')}>{type}</option>
                        {/each}
                    </select>
                </div>

                <div>
                    <label for='resource-url'>URL</label>
                    <input type='text' name='resource-url' id='resource-url' placeholder='Enter resource URL' required />
                </div>

                <div>
                    <label for='resource-license'>License</label>  
                    <select name='resource-license' id='resource-license' required>
                        <option value='' selected disabled hidden>--Please choose an option--</option>
                        {#each resourceOptions as license}
                        <option value={license.toLocaleLowerCase().replace(' ', '-')}>{license}</option>
                        {/each}
                    </select>
                </div>

                <div>
                    <label for='is-resource-author'>Are you the author?</label>
                    <input type='checkbox' name='is-resource-author' id='is-resource-author' required />
                </div>
            </div>
        {/each}
    </div>

    <button
        type='button'
        onclick={() => addEmptyResource()}
    >
        Add new resource
    </button>

    <button type='submit'>Submit</button>
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