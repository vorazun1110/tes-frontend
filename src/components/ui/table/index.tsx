import React, { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
  rowSpan?: number;
  colSpan?: number;
  style?: React.CSSProperties;
}

const Table: React.FC<TableProps> = ({ children, className, style }) => {
  return (
    <table className={`min-w-full ${className}`} style={style}>
      {children}
    </table>
  );
};

const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return (
    <thead className={`bg-gray-100/80 dark:bg-white/[0.06] ${className}`}>
      {children}
    </thead>
  );
};

const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return (
    <tr className={`border-b border-gray-300 dark:border-gray-600 transition-colors ${className}`}>
      {children}
    </tr>
  );
};

const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  rowSpan,
  colSpan,
  className = "",
  style,
}) => {
  if (isHeader) {
    return (
      <th
        className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-r border-gray-300 dark:border-gray-600 last:border-r-0 ${className}`}
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
      className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600 last:border-r-0 ${className}`}
      rowSpan={rowSpan}
      colSpan={colSpan}
      style={style}
    >
      {children}
    </td>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
