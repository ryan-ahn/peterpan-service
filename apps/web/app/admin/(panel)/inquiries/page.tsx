import { desc } from "drizzle-orm";
import { donationInquiries, getDb } from "@repo/db";

import { formatDate } from "@/lib/format";

const KIND_LABEL: Record<string, string> = {
  founding: "창립발기",
  monthly: "정기",
  once: "일시",
};

const InquiriesPage = async () => {
  const rows = await getDb()
    .select()
    .from(donationInquiries)
    .orderBy(desc(donationInquiries.createdAt));
  return (
    <section>
      <h1 className="text-3xl font-semibold text-green">후원 문의</h1>
      <div className="mt-6 flex flex-col gap-3">
        {rows.length === 0 ? <p className="text-muted">들어온 문의가 없습니다.</p> : null}
        {rows.map(row => (
          <article key={row.id} className="rounded-2xl border border-beige px-4 py-3">
            <p className="font-medium">
              {row.name} · {KIND_LABEL[row.kind] ?? row.kind}
              {row.amount ? ` · ${row.amount}` : ""}
            </p>
            <p className="text-sm text-muted">
              {row.email} {row.phone} · {formatDate(row.createdAt)}
            </p>
            {row.message ? <p className="mt-2 text-sm">{row.message}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default InquiriesPage;
