import { memo, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type {
  ColDef,
  ICellRendererParams,
  IDatasource,
  IGetRowsParams,
} from 'ag-grid-community';
import type { Employee } from './data';
import { fetchEmployees } from './fakeApi';

// ---------- Cell renderers (outside App so their identity stays stable) ----------

const statusColors: Record<Employee['status'], string> = {
  Active: '#16a34a',
  'On Leave': '#ea580c',
  Inactive: '#6b7280',
};

function IdCellBase(p: ICellRendererParams<Employee>) {
  // In the infinite row model, rows exist before their data arrives
  if (!p.data) return <span style={{ color: '#9ca3af' }}>Loading…</span>;
  return <>{p.value}</>;
}
const IdCell = memo(IdCellBase);

function StatusBadgeBase(p: ICellRendererParams<Employee>) {
  if (!p.data) return null;
  const status = p.value as Employee['status'];
  return (
    <span
      style={{
        background: statusColors[status],
        color: '#fff',
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: 12,
      }}
    >
      {status}
    </span>
  );
}
const StatusBadge = memo(StatusBadgeBase);

function ActionsBase(p: ICellRendererParams<Employee>) {
  if (!p.data) return null;
  const name = p.data.name;
  return <button onClick={() => alert(`Edit ${name}`)}>Edit</button>;
}
const Actions = memo(ActionsBase);

// ---------- App ----------

export default function App() {
  const [paginated, setPaginated] = useState(true);

  const columnDefs = useMemo<ColDef<Employee>[]>(
    () => [
      { field: 'id', headerName: 'ID', maxWidth: 110, cellRenderer: IdCell },
      { field: 'name', filter: 'agTextColumnFilter' },
      { field: 'department', filter: 'agTextColumnFilter' },
      {
        field: 'salary',
        filter: 'agNumberColumnFilter',
        valueFormatter: (p) =>
          p.value == null ? '' : `₹${p.value.toLocaleString('en-IN')}`,
      },
      { field: 'status', cellRenderer: StatusBadge },
      { field: 'joinDate', headerName: 'Join Date' },
      { headerName: 'Actions', cellRenderer: Actions, sortable: false, maxWidth: 120 },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef<Employee>>(
    () => ({ sortable: true, floatingFilter: true, flex: 1, minWidth: 110 }),
    []
  );

  // Fake "server": the grid asks for rows startRow..endRow with current sort + filters
  const datasource = useMemo<IDatasource>(
    () => ({
      getRows: (p: IGetRowsParams) => {
        console.log('Fetching rows', p.startRow, 'to', p.endRow, p.sortModel, p.filterModel);
        fetchEmployees(p)
          .then(({ rows, total }) => p.successCallback(rows, total))
          .catch(() => p.failCallback());
      },
    }),
    []
  );

  return (
    <div style={{ padding: 16 }}>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={paginated}
          onChange={(e) => setPaginated(e.target.checked)}
        />
        Pagination (uncheck for infinite scroll)
      </label>

      <div style={{ height: '85vh', marginTop: 12 }}>
        <AgGridReact<Employee>
          rowModelType="infinite"
          datasource={datasource}
          cacheBlockSize={100}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={paginated}
          paginationPageSize={50}
          getRowId={(p) => String(p.data.id)}
        />
      </div>
    </div>
  );
}