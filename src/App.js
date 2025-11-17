import logo from './logo.svg';
import './App.css';
import DataTable from './components/DataTable';

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Data Table Component — Sample</h2>
      <p style={{ maxWidth: 800 }}>
        This sample app attempts to load the BIN dataset from the GitHub repository (raw CSV) and
        renders a configurable Data Table with search, filters, sorting, formatting, pagination and export.
      </p>
      <DataTable />
    </div>
  );
}
