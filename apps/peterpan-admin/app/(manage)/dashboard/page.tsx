"use client";

import { type ReactNode, useEffect, useState } from "react";

import Link from "next/link";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts";

import { colors } from "@repo/tailwind-config/theme";
import Skeleton from "@repo/ui/components/skeleton";
import Tab from "@repo/ui/components/tab";
import Icon from "@repo/ui/icon";
import cn from "@repo/ui/lib/cn";
import Text from "@repo/ui/text";

import AdminPageHeader from "@components/adminPageHeader";
import {
  adminPanelClass,
  adminTextErrorColor,
  adminTextHeadingColor,
  adminTextLabelColor,
} from "@constants/adminUi";
import {
  type Dashboard,
  type DashboardDay,
  type DashboardMetric,
  type DashboardPeriod,
  readDashboard,
} from "@lib/adminData";

/**
 * constants
 */
const PERIODS: { id: `${DashboardPeriod}`; label: string }[] = [
  { id: "30", label: "30일" },
  { id: "90", label: "90일" },
  { id: "365", label: "1년" },
];

const PROVIDERS: Record<string, { label: string; color: string }> = {
  kakao: { label: "카카오", color: colors.brand.gold },
  google: { label: "구글", color: colors.primary[500] },
};

const MEMBER_SERIES: ChartSeries[] = [
  { key: "members", label: "가입", color: colors.primary[500] },
];

const INQUIRY_SERIES: ChartSeries[] = [
  { key: "inquiries", label: "후원", color: colors.orange[400] },
];

const BOARD_SERIES: ChartSeries[] = [
  { key: "posts", label: "글", color: colors.green[500] },
  { key: "comments", label: "댓글", color: colors.green[200] },
];

const METRIC_COUNT = 5;

const AXIS_TICK = { fontSize: 12, fill: colors.gray[500] };

const tooltipDate = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "UTC",
  month: "long",
  day: "numeric",
  weekday: "short",
});

/**
 * types
 */
type Loaded = {
  period: DashboardPeriod;
  result: Dashboard | null;
  error: string | null;
};

type ChartSeries = {
  key: keyof Omit<DashboardDay, "date">;
  label: string;
  color: string;
};

type SectionProps = {
  dashboard: Dashboard;
  period: DashboardPeriod;
};

type ChartSectionProps = {
  days: DashboardDay[];
};

type ProviderSectionProps = {
  providers: Dashboard["providers"];
};

type ChartPanelProps = {
  title: string;
  description: string;
  className?: string;
  children: ReactNode;
};

type MetricCardProps = {
  label: string;
  value: number;
  note: string;
  href?: string;
};

type DailyBarChartProps = {
  days: DashboardDay[];
  series: ChartSeries[];
};

type FormatChangeParams = {
  metric: DashboardMetric;
  period: DashboardPeriod;
};

/**
 * screen — 대시보드. 회원·게시판·후원 흐름을 기간별로 한눈에 본다
 */
const DashboardScreen = () => {
  // states
  const [period, setPeriod] = useState<DashboardPeriod>(30);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  // variables
  const dashboard = loaded?.result ?? null;
  const isLoading = !loaded || loaded.period !== period;
  // handlers
  const handlePeriodChange = (id: `${DashboardPeriod}`) => {
    setPeriod(Number(id) as DashboardPeriod);
  };
  // effects
  useEffect(() => {
    let isCancelled = false;
    readDashboard({ period })
      .then(result => {
        if (!isCancelled) {
          setLoaded({ period, result, error: null });
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setLoaded(current => ({
            period,
            result: current?.result ?? null,
            error:
              error instanceof Error
                ? error.message
                : "대시보드를 불러오지 못했어요.",
          }));
        }
      });
    return () => {
      isCancelled = true;
    };
  }, [period]);
  // render
  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title="대시보드"
        description="회원, 게시판, 후원 흐름을 기간별로 봅니다. 날짜는 한국 시간 기준이에요."
        actions={
          <Tab
            variant="segment"
            items={PERIODS}
            activeId={`${period}`}
            label="기간"
            className="w-60"
            onChange={handlePeriodChange}
          />
        }
      />
      {loaded?.error ? (
        <Text variant="caption-1" color={adminTextErrorColor}>
          {loaded.error}
        </Text>
      ) : null}
      {dashboard ? (
        <div
          className={cn(
            "flex flex-col gap-5 transition-opacity duration-150",
            isLoading && "opacity-60",
          )}
          aria-busy={isLoading}>
          <MetricSection dashboard={dashboard} period={period} />
          <div className="grid gap-5 lg:grid-cols-3">
            <MemberTrendSection days={dashboard.days} />
            <ProviderSection providers={dashboard.providers} />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartPanel
              title="일별 가입자"
              description="하루에 새로 가입한 회원 수">
              <DailyBarChart days={dashboard.days} series={MEMBER_SERIES} />
            </ChartPanel>
            <ChartPanel
              title="일별 후원"
              description="웹사이트 후원하기에서 남긴 후원 수">
              <DailyBarChart days={dashboard.days} series={INQUIRY_SERIES} />
            </ChartPanel>
          </div>
          <ChartPanel
            title="게시판 활동"
            description="회원 게시판에 올라온 글과 댓글 수">
            <DailyBarChart days={dashboard.days} series={BOARD_SERIES} />
          </ChartPanel>
        </div>
      ) : (
        <LoadingSection />
      )}
    </div>
  );
};

/**
 * section
 */
const MetricSection = ({ dashboard, period }: SectionProps) => {
  // render
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      <MetricCard
        label="총 회원"
        value={dashboard.members.total}
        note={`최근 ${formatPeriod(period)} +${formatCount(dashboard.members.current)}명`}
      />
      <MetricCard
        label={`신규 가입 (${formatPeriod(period)})`}
        value={dashboard.members.current}
        note={formatChange({ metric: dashboard.members, period })}
      />
      <MetricCard
        label={`회원 게시글 (${formatPeriod(period)})`}
        value={dashboard.posts.current}
        note={`댓글 ${formatCount(dashboard.comments.current)}개 · 전체 글 ${formatCount(dashboard.posts.total)}개`}
      />
      <MetricCard
        label={`후원 (${formatPeriod(period)})`}
        value={dashboard.inquiries.current}
        note={formatChange({ metric: dashboard.inquiries, period })}
        href="/inquiries"
      />
      <MetricCard
        label="언론 보도 승인 대기"
        value={dashboard.pendingPress}
        note={
          dashboard.pendingPress > 0
            ? "소식 관리에서 확인해 주세요"
            : "모두 확인했어요"
        }
        href="/news/press/pending"
      />
    </div>
  );
};

const MemberTrendSection = ({ days }: ChartSectionProps) => {
  // render
  return (
    <ChartPanel
      title="총 회원 수"
      description="날짜별 누적 회원 수 (탈퇴한 회원은 빠져요)"
      className="lg:col-span-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={days}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="member-area" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={colors.primary[500]}
                stopOpacity={0.24}
              />
              <stop
                offset="100%"
                stopColor={colors.primary[500]}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={colors.gray[100]} />
          <XAxis
            dataKey="date"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
            tickFormatter={formatTick}
          />
          <YAxis
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={40}
            domain={["dataMin", "auto"]}
          />
          <Tooltip
            content={ChartTooltip}
            cursor={{ stroke: colors.gray[300] }}
          />
          <Area
            type="monotone"
            dataKey="totalMembers"
            name="총 회원"
            stroke={colors.primary[500]}
            strokeWidth={2}
            fill="url(#member-area)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
};

const ProviderSection = ({ providers }: ProviderSectionProps) => {
  // variables
  const total = providers.reduce((sum, item) => sum + item.count, 0);
  const slices = providers.map(item => ({
    name: PROVIDERS[item.provider]?.label ?? item.provider,
    value: item.count,
    color: PROVIDERS[item.provider]?.color ?? colors.gray[300],
  }));
  // render
  return (
    <ChartPanel title="가입 경로" description="회원이 처음 로그인한 소셜 계정">
      {total > 0 ? (
        <div className="flex h-full flex-col gap-3">
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="60%"
                  outerRadius="90%"
                  paddingAngle={2}
                  stroke="none">
                  {slices.map(slice => (
                    <Cell key={slice.name} fill={slice.color} />
                  ))}
                </Pie>
                <Tooltip content={ChartTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {slices.map(slice => (
              <li key={slice.name} className="flex items-center gap-1.5">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <Text variant="caption-1" color={adminTextLabelColor}>
                  {slice.name} {formatCount(slice.value)}명 (
                  {Math.round((slice.value / total) * 100)}%)
                </Text>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Text
          variant="body-3"
          color={adminTextLabelColor}
          className="py-10 text-center">
          아직 가입한 회원이 없어요.
        </Text>
      )}
    </ChartPanel>
  );
};

const LoadingSection = () => {
  // render
  return (
    <div className="flex flex-col gap-5" aria-busy="true">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: METRIC_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-26 rounded-xlarge bg-white" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Skeleton className="h-84 rounded-xlarge bg-white lg:col-span-2" />
        <Skeleton className="h-84 rounded-xlarge bg-white" />
      </div>
    </div>
  );
};

/**
 * inner components
 */
/**
 * 차트 한 칸. 차트 영역 높이는 여기서 정한다
 */
const ChartPanel = ({
  title,
  description,
  className,
  children,
}: ChartPanelProps) => {
  // render
  return (
    <section
      className={cn(adminPanelClass, "flex flex-col gap-4 p-5", className)}>
      <div className="flex flex-col gap-0.5">
        <Text as="h2" variant="label-2" color={adminTextHeadingColor}>
          {title}
        </Text>
        <Text variant="caption-1" color={adminTextLabelColor}>
          {description}
        </Text>
      </div>
      <div className="h-60">{children}</div>
    </section>
  );
};

/**
 * 숫자 카드. `href`가 있으면 그 관리 화면으로 가는 링크가 된다
 */
const MetricCard = ({ label, value, note, href }: MetricCardProps) => {
  // variables
  const content = (
    <>
      <div className="flex items-center justify-between gap-2">
        <Text variant="caption-1" color={adminTextLabelColor} numberOfLines={1}>
          {label}
        </Text>
        {href ? (
          <Icon
            name="chevron-right"
            size={16}
            className="shrink-0 text-gray-400"
          />
        ) : null}
      </div>
      <Text variant="heading-3" color={adminTextHeadingColor}>
        {formatCount(value)}
      </Text>
      <Text variant="caption-2" color={adminTextLabelColor} numberOfLines={1}>
        {note}
      </Text>
    </>
  );
  // render
  if (!href) {
    return (
      <div className={cn(adminPanelClass, "flex flex-col gap-1 px-4 py-4")}>
        {content}
      </div>
    );
  }
  return (
    <Link
      className={cn(
        adminPanelClass,
        "flex flex-col gap-1 px-4 py-4 transition-colors duration-150 hover:border-gray-300",
      )}
      href={href}
      prefetch={false}>
      {content}
    </Link>
  );
};

/**
 * 날짜별 막대. 계열이 여럿이면 쌓는다
 */
const DailyBarChart = ({ days, series }: DailyBarChartProps) => {
  // render
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={days} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke={colors.gray[100]} />
        <XAxis
          dataKey="date"
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
          tickFormatter={formatTick}
        />
        <YAxis
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={40}
        />
        <Tooltip content={ChartTooltip} cursor={{ fill: colors.gray[50] }} />
        {series.map((item, index) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            name={item.label}
            stackId="day"
            fill={item.color}
            radius={index === series.length - 1 ? [3, 3, 0, 0] : 0}
            maxBarSize={24}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

/**
 * 차트 말풍선. 날짜 축이면 제목에 요일까지 적는다
 */
const ChartTooltip = ({ active, payload, label }: TooltipContentProps) => {
  // render
  if (!active || !payload?.length) return null;
  return (
    <div className="flex flex-col gap-1 rounded-medium border border-gray-200 bg-white px-3 py-2 shadow-small">
      {typeof label === "string" && label ? (
        <Text variant="label-4" color={adminTextHeadingColor}>
          {formatTooltipDate(label)}
        </Text>
      ) : null}
      {payload.map(item => (
        <div key={String(item.name)} className="flex items-center gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: item.payload?.color ?? item.color }}
          />
          <Text variant="caption-1" color={adminTextLabelColor}>
            {item.name} {formatCount(Number(item.value ?? 0))}
          </Text>
        </div>
      ))}
    </div>
  );
};

/**
 * utils
 */
const formatCount = (value: number) => value.toLocaleString("ko-KR");

const formatPeriod = (period: DashboardPeriod) =>
  period === 365 ? "1년" : `${period}일`;

const formatTick = (date: string) => `${date.slice(5, 7)}.${date.slice(8, 10)}`;

const formatTooltipDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? date : tooltipDate.format(parsed);
};

/**
 * 바로 앞 같은 길이 기간과 견준 변화
 */
const formatChange = (params: FormatChangeParams) => {
  const { metric, period } = params;
  const base = `이전 ${formatPeriod(period)}`;
  if (metric.previous === 0) {
    return metric.current > 0 ? `${base}에는 없었어요` : `${base}에도 없었어요`;
  }
  const rate = Math.round(
    ((metric.current - metric.previous) / metric.previous) * 100,
  );
  if (rate === 0) return `${base}과 같아요`;
  return `${base} 대비 ${rate > 0 ? "+" : ""}${rate}%`;
};

export default DashboardScreen;
