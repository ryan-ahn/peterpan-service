import type { ReactNode } from "react";

import Skeleton from "@repo/ui/components/skeleton";
import cn from "@repo/ui/lib/cn";
import Text from "@repo/ui/text";

import { adminTextLabelColor } from "@constants/adminUi";

/**
 * constants
 */
const SKELETON_ROW_COUNT = 5;

/**
 * types
 */
export type AdminColumn<T> = {
  key: string;
  label: string;
  className?: string;
  render: (row: T) => ReactNode;
};

type Props<T> = {
  columns: AdminColumn<T>[];
  rows: T[];
  emptyText: string;
  isLoading: boolean;
  readRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
};

/**
 * 관리 목록 표. `onRowClick`이 있으면 행을 눌러 편집 패널을 연다
 * @param columns 열 정의. `render`가 칸 내용을 그린다
 * @param rows 행 데이터
 * @param emptyText 행이 없을 때 문구
 * @param isLoading 불러오는 중. 첫 로딩에는 자리 표시를 보인다
 * @param readRowKey 행 key
 * @param onRowClick 행 클릭. 없으면 읽기 전용 표
 */
const AdminTable = <T,>({
  columns,
  rows,
  emptyText,
  isLoading,
  readRowKey,
  onRowClick,
}: Props<T>) => {
  // variables
  const isFirstLoading = isLoading && rows.length === 0;
  // render
  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          "w-full min-w-180 border-collapse text-left transition-opacity duration-150",
          isLoading && !isFirstLoading && "opacity-60",
        )}>
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map(column => (
              <th
                key={column.key}
                className={cn("px-4 py-3 whitespace-nowrap", column.className)}
                scope="col">
                <Text as="span" variant="label-4" color={adminTextLabelColor}>
                  {column.label}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isFirstLoading
            ? Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
                <tr key={index} className="border-b border-gray-100">
                  {columns.map(column => (
                    <td key={column.key} className="px-4 py-3.5">
                      <Skeleton className="h-4 w-full max-w-40" />
                    </td>
                  ))}
                </tr>
              ))
            : null}
          {!isLoading && rows.length === 0 ? (
            <tr>
              <td className="px-4 py-12 text-center" colSpan={columns.length}>
                <Text variant="body-3" color={adminTextLabelColor}>
                  {emptyText}
                </Text>
              </td>
            </tr>
          ) : null}
          {rows.map(row => (
            <tr
              key={readRowKey(row)}
              className={cn(
                "border-b border-gray-100 last:border-b-0",
                onRowClick &&
                  "cursor-pointer transition-colors duration-150 hover:bg-gray-50",
              )}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={event => {
                if (event.key === "Enter") {
                  onRowClick?.(row);
                }
              }}>
              {columns.map(column => (
                <td
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-4 leading-5",
                    column.className,
                  )}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
