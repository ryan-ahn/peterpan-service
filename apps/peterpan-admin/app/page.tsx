import Image from "next/image";
import { redirect } from "next/navigation";

import { getSessionProfile } from "@repo/auth/session";
import Button from "@repo/ui/components/button";
import cn from "@repo/ui/lib/cn";
import Text from "@repo/ui/text";

import SocialLoginButtons from "@components/socialLoginButtons";
import {
  adminPanelClass,
  adminTextErrorColor,
  adminTextHeadingColor,
  adminTextLabelColor,
} from "@constants/adminUi";
import { readAdminHome } from "@lib/adminMenu";
import { readAdminSelf } from "@lib/adminSession";

/**
 * constants
 */
const LOGIN_NEXT_PATH = "/";

/**
 * types
 */
type Props = {
  searchParams: Promise<{ error?: string }>;
};

type DeniedSectionProps = {
  message: string;
};

/**
 * screen — 관리자 로그인. 카카오·구글로 들어오고, 운영자면 쓸 수 있는 첫 관리 화면으로 보낸다
 */
const LoginScreen = async ({ searchParams }: Props) => {
  // variables
  const params = await searchParams;
  const [profile, self] = await Promise.all([
    getSessionProfile(),
    readAdminSelf(),
  ]);
  const home = self ? readAdminHome(self) : null;
  if (home) {
    redirect(home);
  }
  // render
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-110 flex-col justify-center gap-8 px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <Image
          src="/brand/logo-symbol.png"
          alt=""
          width={313}
          height={354}
          priority
          className="h-16 w-auto"
        />
        <div className="flex flex-col gap-1">
          <Text as="h1" variant="heading-2" color={adminTextHeadingColor}>
            피터팬 재단 어드민
          </Text>
          <Text variant="body-3" color={adminTextLabelColor}>
            운영자로 등록된 카카오·구글 계정으로 로그인하세요.
          </Text>
        </div>
      </div>
      <div className={cn(adminPanelClass, "flex flex-col gap-3 px-6 py-6")}>
        {params.error ? (
          <Text
            variant="caption-1"
            color={adminTextErrorColor}
            className="rounded-medium bg-red-50 px-3 py-2">
            {params.error}
          </Text>
        ) : null}
        {profile ? (
          <DeniedSection
            message={
              self
                ? "아직 쓸 수 있는 관리 메뉴가 없어요. 슈퍼 관리자에게 메뉴 권한을 요청해 주세요."
                : `${profile.email ?? "이 계정"}에는 관리자 권한이 없어요. 다른 계정으로 로그인해 주세요.`
            }
          />
        ) : (
          <ProviderSection />
        )}
      </div>
    </main>
  );
};

/**
 * section
 */
const ProviderSection = () => (
  <>
    <SocialLoginButtons nextPath={LOGIN_NEXT_PATH} />
    <Text variant="caption-2" color={adminTextLabelColor}>
      관리자로 지정된 계정만 들어올 수 있어요. 처음이라면 한 번 로그인한 뒤 재단
      담당자에게 지정을 요청하세요.
    </Text>
  </>
);

const DeniedSection = ({ message }: DeniedSectionProps) => (
  <>
    <Text variant="body-3">{message}</Text>
    <form action="/auth/logout" method="post">
      <Button
        variant="line"
        color="gray"
        type="submit"
        text="로그아웃"
        isFullWidth
      />
    </form>
  </>
);

export default LoginScreen;
