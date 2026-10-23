import { saveSettings } from "@/app/admin/(panel)/actions";
import { getSiteContact } from "@/lib/settings";

type SettingsPageProps = {
  searchParams: Promise<{ saved?: string }>;
};

const SettingsPage = async ({ searchParams }: SettingsPageProps) => {
  const params = await searchParams;
  const contact = await getSiteContact();
  return (
    <form action={saveSettings} className="grid max-w-2xl gap-4">
      <h1 className="text-3xl font-semibold text-green">기본정보</h1>
      {params.saved ? <p className="text-sm text-green">저장했습니다. 하단 정보에 반영됩니다.</p> : null}
      <Field label="대표" name="representative" defaultValue={contact.representative} />
      <Field label="주소" name="address" defaultValue={contact.address} />
      <Field label="연락처" name="phone" defaultValue={contact.phone} />
      <Field label="이메일" name="email" defaultValue={contact.email} />
      <Field label="고유번호" name="registrationNumber" defaultValue={contact.registrationNumber} />
      <button type="submit" className="h-12 rounded-full bg-green text-white">
        저장
      </button>
    </form>
  );
};

const Field = ({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) => (
  <label className="grid gap-2 text-sm">
    {label}
    <input name={name} defaultValue={defaultValue} className="h-12 rounded-2xl border border-beige px-4" />
  </label>
);

export default SettingsPage;
