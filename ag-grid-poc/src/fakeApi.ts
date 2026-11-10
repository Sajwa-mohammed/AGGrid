import { employees } from './data';

export function fetchEmployees(p: { startRow: number; endRow: number;
  sortModel: any[]; filterModel: Record<string, any> }) {
  return new Promise<{ rows: any[]; total: number }>(resolve => setTimeout(() => {
    let data: any[] = [...employees];
    for (const [field, f] of Object.entries(p.filterModel)) {
      if (f.filterType === 'text')
        data = data.filter(r => String(r[field]).toLowerCase().includes(f.filter.toLowerCase()));
      if (f.filterType === 'number')
        data = data.filter(r => f.type === 'greaterThan' ? r[field] > f.filter
          : f.type === 'lessThan' ? r[field] < f.filter : r[field] === f.filter);
    }
    if (p.sortModel.length) {
      const { colId, sort } = p.sortModel[0];
      data.sort((a, b) => (a[colId] > b[colId] ? 1 : -1) * (sort === 'asc' ? 1 : -1));
    }
    resolve({ rows: data.slice(p.startRow, p.endRow), total: data.length });
  }, 500));
}