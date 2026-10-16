import staff from '$lib/data/staff.json';
import faculties from '$lib/data/faculties.json'

export function load() {
  return { staff, faculties };
}