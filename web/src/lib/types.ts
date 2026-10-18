
export interface Position {
    rank: string;
    faculty_id: string;
    unit_id: string;
}

export interface Staff {
  name: string;
  positions: Array<Position>;
}

export interface StaffData {
  name: string;
  rank: string;
  faculty_id: string;
  unit_id: string
}

export interface UnitData {
  id: string;
  name: string;
  faculty_id: string;
}

export interface FacultyData {
  id: string;
  name: string;
}