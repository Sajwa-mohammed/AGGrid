import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import type { IDatasource, IGetRowsParams } from 'ag-grid-community';
import { employees, type Employee } from './data';
import type { ICellRendererParams } from 'ag-grid-community';
import { fetchEmployees } from './fakeApi';

export default function App() {
  const colors = { Active: '#16a34a', 'On Leave': '#ea580c', Inactive: '#6b7280' };
const StatusBadge = (p: ICellRendererParams<Employee>) =>
  p.value ? <span style={{ background: colors[p.value as Employee['status']],
    color: '#fff', padding: '2px 10px', borderRadius: 12 }}>{p.value}</span> : null;

const Actions = (p: ICellRendererParams<Employee>) =>
  <button onClick={() => alert(`Edit ${p.data?.name}`)}>Edit</button>;
  const columnDefs = useMemo<ColDef<Employee>[]>(() => [
    { field: 'id', width: 90 },
    { field: 'name', filter: 'agTextColumnFilter' },
    { field: 'department', filter: 'agTextColumnFilter' },
    { field: 'salary', filter: 'agNumberColumnFilter',
      valueFormatter: p => `₹${p.value?.toLocaleString('en-IN')}` },
    { field: 'status', cellRenderer: StatusBadge },
{ headerName: 'Actions', cellRenderer: Actions, sortable: false, filter: false },
    { field: 'joinDate', filter: 'agDateColumnFilter' },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true, floatingFilter: true, flex: 1,
  }), []);


  const datasource = useMemo<IDatasource>(() => ({
  getRows: (p: IGetRowsParams) => {
    fetchEmployees(p)
      .then(({ rows, total }) => p.successCallback(rows, total))
      .catch(() => p.failCallback());
  },
}), []);


  return (
    <div style={{ height: '90vh' }}>
      {/* <AgGridReact rowData={employees} columnDefs={columnDefs}
        defaultColDef={defaultColDef} pagination paginationPageSize={50}
        getRowId={p => String(p.data.id)} /> */}
        <AgGridReact rowModelType="infinite" datasource={datasource}
  cacheBlockSize={100} columnDefs={columnDefs} defaultColDef={defaultColDef}
  pagination paginationPageSize={50} getRowId={p => String(p.data.id)} />
    </div>
  );
}