import { getDb, siteSettings } from "./index";

/**
 * 푸터·관리자 기본정보에 쓰는 재단 연락처. site_settings 키 값으로 저장한다.
 */

/**
 * constants
 */
export const DEFAULT_CONTACT: SiteContact = {
  representative: "변경희 (설립발기인 대표)",
  address: "서울특별시 (주된 사무소) · 설립추진 사무공간은 서울특별시 강동구",
  phone: "",
  email: "",
  registrationNumber: "",
};

const KEYS: Record<keyof SiteContact, string> = {
  representative: "representative",
  address: "address",
  phone: "phone",
  email: "email",
  registrationNumber: "registration_number",
};

/**
 * types
 */
export type SiteContact = {
  representative: string;
  address: string;
  phone: string;
  email: string;
  registrationNumber: string;
};

/**
 * actions
 */
export const getSiteContact = async (): Promise<SiteContact> => {
  try {
    const rows = await getDb().select().from(siteSettings);
    const values = new Map(rows.map(row => [row.key, row.value]));
    return {
      representative:
        values.get(KEYS.representative) || DEFAULT_CONTACT.representative,
      address: values.get(KEYS.address) || DEFAULT_CONTACT.address,
      phone: values.get(KEYS.phone) ?? "",
      email: values.get(KEYS.email) ?? "",
      registrationNumber: values.get(KEYS.registrationNumber) ?? "",
    };
  } catch {
    return DEFAULT_CONTACT;
  }
};

export const saveSiteContact = async (contact: SiteContact) => {
  const db = getDb();
  const entries = Object.entries(KEYS) as [keyof SiteContact, string][];
  for (const [field, key] of entries) {
    await db
      .insert(siteSettings)
      .values({ key, value: contact[field] })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: contact[field] },
      });
  }
};
