import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { employees, type Employee } from './data';

export default function App() {
  const columnDefs = useMemo<ColDef<Employee>[]>(() => [
    { field: 'id', width: 90 },
    { field: 'name', filter: 'agTextColumnFilter' },
    { field: 'department', filter: 'agTextColumnFilter' },
    { field: 'salary', filter: 'agNumberColumnFilter',
      valueFormatter: p => `₹${p.value?.toLocaleString('en-IN')}` },
    { field: 'status' },
    { field: 'joinDate', filter: 'agDateColumnFilter' },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true, floatingFilter: true, flex: 1,
  }), []);

  return (
    <div style={{ height: '90vh' }}>
      <AgGridReact rowData={employees} columnDefs={columnDefs}
        defaultColDef={defaultColDef} pagination paginationPageSize={50}
        getRowId={p => String(p.data.id)} />
    </div>
  );
}