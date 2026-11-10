export type Employee = {
  id: number; name: string; department: string;
  salary: number; status: 'Active' | 'On Leave' | 'Inactive'; joinDate: string;
};

const depts = ['Engineering', 'Sales', 'HR', 'Finance'];
const statuses = ['Active', 'On Leave', 'Inactive'] as const;

export const employees: Employee[] = Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `Employee ${i + 1}`,
  department: depts[i % 4],
  salary: 30000 + ((i * 7919) % 90000),
  status: statuses[i % 3],
  joinDate: new Date(2018, i % 12, (i % 28) + 1).toISOString().slice(0, 10),
}));