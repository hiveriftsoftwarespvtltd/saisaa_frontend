import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  Download,
  X,
  FileQuestion,
} from 'lucide-react';

export const DataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchKeys = [],
  filters = [],
  headerActions = null,
  pageSize: initialPageSize = 10,
  selectable = false,
  onBulkDelete = null,
  emptyMessage = 'No matching records found in this view.',
  title = null,
  subtitle = null,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle Dropdown Filter Change
  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Handle Sorting
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return { key: null, direction: 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Filtered & Searched Data
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // 1. Text Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const keysToSearch = searchKeys.length > 0 ? searchKeys : Object.keys(row);
        const matches = keysToSearch.some((k) => {
          const val = row[k];
          if (val === null || val === undefined) return false;
          if (typeof val === 'object') {
            return JSON.stringify(val).toLowerCase().includes(query);
          }
          return String(val).toLowerCase().includes(query);
        });
        if (!matches) return false;
      }

      // 2. Facet Filters
      for (const [filterKey, filterVal] of Object.entries(filterValues)) {
        if (!filterVal || filterVal === 'all') continue;
        const rowVal = row[filterKey];
        if (String(rowVal).toLowerCase() !== String(filterVal).toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchQuery, searchKeys, filterValues]);

  // Sorted Data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination Slice
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, safePage, pageSize]);

  // Selection Logic
  const allCurrentSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedIds.has(row[keyField]));

  const toggleSelectAll = () => {
    if (allCurrentSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedData.forEach((row) => next.delete(row[keyField]));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedData.forEach((row) => next.add(row[keyField]));
        return next;
      });
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExportCSV = () => {
    if (sortedData.length === 0) return;
    const exportColumns = columns.filter((col) => col.key && col.key !== 'actions');
    const headers = exportColumns.map((col) => col.label).join(',');
    const rows = sortedData.map((row) =>
      exportColumns
        .map((col) => {
          const val = row[col.key];
          const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
          return `"${stringVal.replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `saisaa_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col transition-all">
      {/* 1. Header Toolbar & Filters */}
      <div className="p-4 sm:p-5 border-b border-stone-200/70 bg-[#FCFBF8] space-y-4">
        {(title || subtitle || headerActions) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              {title && (
                <h3 className="font-serif text-lg font-bold text-stone-900 tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-stone-500 font-light mt-0.5">{subtitle}</p>
              )}
            </div>
            {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
          {/* Search Box */}
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-8 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C] focus:ring-1 focus:ring-[#0A261C] text-stone-800 placeholder-stone-400 shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Filters & Export Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 ml-auto">
            {filters.map((flt) => (
              <div key={flt.key} className="flex items-center gap-1.5">
                <select
                  value={filterValues[flt.key] || 'all'}
                  onChange={(e) => handleFilterChange(flt.key, e.target.value)}
                  className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-700 focus:outline-none focus:border-[#0A261C] shadow-2xs font-medium cursor-pointer"
                >
                  <option value="all">All {flt.label}</option>
                  {flt.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <button
              onClick={handleExportCSV}
              title="Export current filtered view to CSV"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 shadow-2xs transition-all"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Bulk Action Banner when rows selected */}
        {selectable && selectedIds.size > 0 && (
          <div className="flex items-center justify-between bg-[#0A261C]/5 border border-[#0A261C]/15 rounded-xl px-4 py-2 text-xs text-[#0A261C] animate-fade-in">
            <span className="font-semibold">
              {selectedIds.size} row{selectedIds.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              {onBulkDelete && (
                <button
                  onClick={() => {
                    onBulkDelete(Array.from(selectedIds));
                    setSelectedIds(new Set());
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected</span>
                </button>
              )}
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-stone-500 hover:text-stone-800 underline ml-2"
              >
                Clear selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Responsive Table Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/80 border-b border-stone-200/80 text-[11px] uppercase tracking-wider text-stone-500 font-semibold select-none">
              {selectable && (
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allCurrentSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-stone-300 text-[#0A261C] focus:ring-[#0A261C] w-4 h-4 cursor-pointer"
                  />
                </th>
              )}

              {columns.map((col) => {
                const isSorted = sortConfig.key === col.key;
                return (
                  <th
                    key={col.key || col.label}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`py-3.5 px-4 whitespace-nowrap transition-colors ${
                      col.sortable ? 'cursor-pointer hover:bg-stone-100 hover:text-stone-800' : ''
                    } ${col.className || ''}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.label}</span>
                      {col.sortable && (
                        <span className="text-stone-400">
                          {isSorted ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowUp className="w-3 h-3 text-[#0A261C]" />
                            ) : (
                              <ArrowDown className="w-3 h-3 text-[#0A261C]" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-normal">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-12 text-center text-stone-400"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileQuestion className="w-8 h-8 text-stone-300" />
                    <p className="text-sm font-medium text-stone-600">{emptyMessage}</p>
                    <p className="text-xs text-stone-400">
                      Try clearing filters or refining your search parameters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const rowKey = row[keyField] ?? idx;
                const isSelected = selectedIds.has(rowKey);
                return (
                  <tr
                    key={rowKey}
                    className={`hover:bg-[#FAF9F5]/70 transition-colors ${
                      isSelected ? 'bg-[#0A261C]/5' : ''
                    }`}
                  >
                    {selectable && (
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(rowKey)}
                          className="rounded border-stone-300 text-[#0A261C] focus:ring-[#0A261C] w-4 h-4 cursor-pointer"
                        />
                      </td>
                    )}

                    {columns.map((col) => {
                      const cellValue = row[col.key];
                      return (
                        <td
                          key={col.key || col.label}
                          className={`py-3 px-4 align-middle ${col.className || ''}`}
                        >
                          {col.render ? col.render(cellValue, row) : cellValue ?? '—'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Pagination Footer */}
      <div className="p-4 border-t border-stone-200/70 bg-[#FCFBF8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
        <div className="flex items-center gap-3">
          <span>
            Showing{' '}
            <strong className="text-stone-800">
              {totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1}
            </strong>{' '}
            to{' '}
            <strong className="text-stone-800">
              {Math.min(safePage * pageSize, totalItems)}
            </strong>{' '}
            of <strong className="text-stone-800">{totalItems}</strong> entries
          </span>

          <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200">
            <span className="text-[11px] text-stone-400">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:border-[#0A261C]"
            >
              {[5, 10, 20, 50].map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Page Nav Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={safePage === 1}
            className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 font-semibold text-stone-700 text-xs">
            Page {safePage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={safePage >= totalPages}
            className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
