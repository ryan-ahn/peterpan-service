"use client";

import { useEffect, useState } from "react";

import type { SiteContact } from "@repo/db/siteContact";
import Button from "@repo/ui/components/button";
import Input from "@repo/ui/components/input";
import Spinner from "@repo/ui/components/spinner";
import { useToast } from "@repo/ui/components/toast";
import cn from "@repo/ui/lib/cn";
import Text from "@repo/ui/text";

import AdminPageHeader from "@components/adminPageHeader";
import { adminPanelClass, adminTextErrorColor } from "@constants/adminUi";
import { readContact, saveContact } from "@lib/adminData";

/**
 * constants
 */
const FIELDS: { key: keyof SiteContact; label: string; placeholder: string }[] =
  [
    { key: "representative", label: "대표", placeholder: "홍길동 (이사장)" },
    { key: "address", label: "주소", placeholder: "서울특별시 …" },
    { key: "phone", label: "연락처", placeholder: "02-000-0000" },
    { key: "email", label: "이메일", placeholder: "hello@peterpan.or.kr" },
    {
      key: "registrationNumber",
      label: "고유번호",
      placeholder: "000-00-00000",
    },
  ];

/**
 * screen — 기본정보. 웹사이트 하단에 보이는 재단 연락처
 */
const SettingsScreen = () => {
  // hooks
  const toast = useToast();
  // states
  const [contact, setContact] = useState<SiteContact | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // functions
  const changeField = (key: keyof SiteContact, value: string) => {
    setContact(current => (current ? { ...current, [key]: value } : current));
  };
  // handlers
  const handleSave = async () => {
    if (!contact) {
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await saveContact(contact);
      toast.show({
        text: "저장했어요. 웹사이트 하단에 반영돼요.",
        variant: "success",
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "저장하지 못했어요.",
      );
    }
    setIsSaving(false);
  };
  // initialize
  useEffect(() => {
    let isCancelled = false;
    readContact()
      .then(result => {
        if (!isCancelled) {
          setContact(result);
        }
      })
      .catch((loadError: unknown) => {
        if (!isCancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "기본정보를 불러오지 못했어요.",
          );
        }
      });
    return () => {
      isCancelled = true;
    };
  }, []);
  // render
  return (
    <div className="flex max-w-160 flex-col gap-5">
      <AdminPageHeader
        title="기본정보"
        description="웹사이트 하단에 보이는 재단 연락처입니다. 비워 두면 “준비 중”으로 보여요."
      />
      {error ? (
        <Text
          variant="caption-1"
          color={adminTextErrorColor}
          className="rounded-medium bg-red-50 px-3 py-2">
          {error}
        </Text>
      ) : null}
      <section
        className={cn(adminPanelClass, "flex flex-col gap-4 p-5 md:p-6")}>
        {contact ? (
          <>
            {FIELDS.map(field => (
              <Input
                key={field.key}
                label={field.label}
                value={contact[field.key]}
                placeholder={field.placeholder}
                onChange={value => changeField(field.key, value)}
              />
            ))}
            <Button
              variant="solid"
              color="black"
              size="small"
              text="저장"
              className="self-start"
              isLoading={isSaving}
              onClick={handleSave}
            />
          </>
        ) : (
          <div className="grid h-60 place-items-center text-gray-400">
            <Spinner size="large" />
          </div>
        )}
      </section>
    </div>
  );
};

export default SettingsScreen;
