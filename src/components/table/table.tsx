import React from "react";
import clsx from "clsx";
import { ReactComponent as ChevronIcon } from "assets/icons/chevron.svg";
import { ReactComponent as CloseIcon } from "assets/icons/close.svg";

type TableProps = {
  title?: string;
  headerProperties?: string[];
  children?: React.ReactNode;
};

export const Table: React.FC<TableProps> = ({
  title,
  headerProperties = [],
  children,
}) => {
  return (
    <>
      {title && <p className="uppercase text-sm mt-4 mb-1">{title}</p>}
      <table className="w-full">
        <thead className="border-t border-b border-gray-300 bg-gray-200">
          <tr>
            <th className="w-7"></th>
            {headerProperties.map((key: string) => (
              <th key={key} className="text-left pl-2">
                {key}
              </th>
            ))}
            <th className="w-7"></th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </>
  );
};

type CommonPropsType = {
  className?: string;
  children: React.ReactNode;
};

type TableRowProps = {
  isExpanded?: boolean;
  hasColapseIcon?: boolean;
  showRemoveButton?: boolean;
  onColapseClick?(): void;
  onDeleteRow?(): void;
} & CommonPropsType;

export const TableRow: React.FC<TableRowProps> = ({
  children,
  isExpanded,
  hasColapseIcon,
  showRemoveButton = true,
  onColapseClick,
  onDeleteRow,
  ...props
}) => (
  <tr {...props}>
    <td className="w-7 pl-2 cursor-pointer hover:opacity-60">
      {hasColapseIcon && (
        <ChevronIcon
          role="collapse-btn"
          className={clsx("w-4 h-4", { "rotate-90": isExpanded })}
          onClick={onColapseClick}
        />
      )}
    </td>
    {children}
    {showRemoveButton && (
      <td className="w-7 cursor-pointer hover:opacity-60">
        <CloseIcon
          role="remove-btn"
          className="w-3 h-3"
          onClick={onDeleteRow}
        />
      </td>
    )}
  </tr>
);

type TableCellProps = { colSpan?: number } & CommonPropsType;

export const TableCell: React.FC<TableCellProps> = ({ children, ...props }) => (
  <td {...props}>{children}</td>
);
