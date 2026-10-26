"use client";

import Chip from "@repo/ui/components/chip";
import Text from "@repo/ui/text";

import { useAdminHeader } from "@components/adminFrame";
import AdminPageHeader from "@components/adminPageHeader";
import AdminPager from "@components/adminPager";
import AdminTable, { type AdminColumn } from "@components/adminTable";
import {
  ADMIN_PAGE_SIZE,
  adminPanelClass,
  adminTextErrorColor,
  adminTextLabelColor,
} from "@constants/adminUi";
import { type AdminLog, listLogs } from "@lib/adminData";
import {
  ADMIN_LOG_MENUS,
  ADMIN_LOG_MENU_LABEL,
  type AdminLogMenu,
} from "@lib/adminMenu";
import { formatAdminDate } from "@lib/formatDate";
import useAdminList from "@lib/useAdminList";

/**
 * constants
 */
const FILTERS: LogFilter[] = ["all", ...ADMIN_LOG_MENUS];

const COLUMNS: AdminColumn<AdminLog>[] = [
  {
    key: "createdAt",
    label: "일시",
    className: "whitespace-nowrap text-gray-600",
    render: log => formatAdminDate({ value: log.createdAt, hasTime: true }),
  },
  {
    key: "actor",
    label: "누가",
    className: "whitespace-nowrap",
    render: log => <Text variant="label-3">{log.actorName}</Text>,
  },
  {
    key: "menu",
    label: "메뉴",
    className: "whitespace-nowrap",
    render: log => (
      <Chip
        variant="line"
        color="gray"
        size="small"
        text={ADMIN_LOG_MENU_LABEL[log.menu] ?? log.menu}
      />
    ),
  },
  {
    key: "action",
    label: "무엇을",
    render: log => (
      <div className="flex min-w-0 flex-col">
        <Text variant="label-3">{log.action}</Text>
        {log.target ? (
          <Text variant="caption-2" color={adminTextLabelColor}>
            {log.target}
          </Text>
        ) : null}
      </div>
    ),
  },
];

/**
 * types
 */
type LogFilter = AdminLogMenu | "all";

type ReadLogsParams = {
  search: string;
  page: number;
  filter: LogFilter;
};

/**
 * pre-root runtime
 */
const readLogs = (params: ReadLogsParams) => {
  const { search, page, filter } = params;
  return listLogs({ search, page, menu: filter });
};

/**
 * screen — 관리 기록. 운영자가 관리 화면에서 바꾼 일을 새것부터 보여 준다
 */
const LogsScreen = () => {
  // hooks
  const list = useAdminList({ initialFilter: "all", load: readLogs });
  useAdminHeader({
    value: list.search,
    placeholder: "이름, 한 일, 대상",
    onChange: list.setSearch,
    onSubmit: list.handleSearchSubmit,
  });
  // variables
  const total = list.result?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  // render
  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title="관리 기록"
        description="누가 언제 어떤 메뉴에서 무엇을 바꿨는지 쌓아 둡니다. 기록은 지우거나 고칠 수 없어요."
      />
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(filter => (
          <Chip
            key={filter}
            variant={list.filter === filter ? "contain" : "line"}
            color="gray"
            text={`${filter === "all" ? "전체" : ADMIN_LOG_MENU_LABEL[filter]} ${list.result?.counts[filter] ?? 0}`}
            isSelected={list.filter === filter}
            onClick={() => list.handleFilterChange(filter)}
          />
        ))}
      </div>
      {list.error ? (
        <Text variant="caption-1" color={adminTextErrorColor}>
          {list.error}
        </Text>
      ) : null}
      <section className={adminPanelClass}>
        <AdminTable
          columns={COLUMNS}
          rows={list.result?.items ?? []}
          emptyText="남은 기록이 없어요."
          isLoading={list.isLoading}
          readRowKey={log => log.id}
        />
        <AdminPager
          page={list.page}
          pageCount={pageCount}
          total={total}
          unit="건"
          onChange={list.setPage}
        />
      </section>
    </div>
  );
};

export default LogsScreen;
