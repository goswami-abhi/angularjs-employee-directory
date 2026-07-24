export interface Employee {
  name: string;
  email: string;
  department: string;
  designation: string;
  salary: number;
  joinDate: string; // ISO format string 'YYYY-MM-DD' for HTML5 date input compatibility
}
