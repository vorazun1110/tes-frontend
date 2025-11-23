import React, { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
  style?: React.CSSProperties; // Optional style for the table
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
  style?: React.CSSProperties; // Optional style for the cell
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className, style }) => {
  return <table className={`min-w-full  ${className}`} style={style}>{children}</table>;
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
  style,
}) => {
  const commonClasses =
    "align-middle whitespace-nowrap";

  if (isHeader) {
    return (
      <th
        className={`text-gray-500 dark:text-gray-400 text-theme-xs ${commonClasses} ${className}`}
        rowSpan={rowSpan}
        colSpan={colSpan}
        scope="col"
        style={style}
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
      style={style}
    >
      {children}
    </td>
  );
};


export { Table, TableHeader, TableBody, TableRow, TableCell };
