import React from 'react';
export default function SearchBar({ value, onChange, onClear }) {
    return (
        <div className="dt-search">
            <input aria-label="Search" placeholder="Search..." value={value} onChange={(e) => onChange(e.target.value)} />
            <button onClick={onClear}>Clear</button>
        </div>
    );
}