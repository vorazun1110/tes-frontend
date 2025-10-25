import React, { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
  rowSpan?: number; // If > 1, renders as <th> or <td> with row span
  colSpan?: number; // If > 1, renders as <th> or <td> with column span
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  rowSpan,
  colSpan,
  className = "",
}) => {
  const commonClasses =
    "px-5 py-3 text-start align-middle whitespace-nowrap text-theme-sm";

  if (isHeader) {
    return (
      <th
        className={`text-gray-500 dark:text-gray-400 text-theme-xs ${commonClasses} ${className}`}
        rowSpan={rowSpan}
        colSpan={colSpan}
        scope="col"
      >
        {children}
      </th>
    );
  }

  return (
    <td
      className={`${commonClasses} ${className}`}
      rowSpan={rowSpan}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};


export { Table, TableHeader, TableBody, TableRow, TableCell };
