"use client";

import type { ChangeEvent } from "react";
import { useActionState, useRef } from "react";

import { AVATAR_UPLOAD } from "@repo/db/boards";
import Avatar from "@repo/ui/components/avatar";
import Spinner from "@repo/ui/components/spinner";
import Icon from "@repo/ui/icon";

import { updateMyAvatar } from "@app/mypage/actions";

/**
 * constants
 */
const INITIAL_STATE = { message: "" };

/**
 * types
 */
type Props = {
  name: string;
  avatarUrl: string | null;
};

/**
 * 마이페이지 프로필 사진. 누르면 사진을 골라 바로 올린다
 * @param name 회원 이름. 사진이 없을 때 첫 글자로 쓴다
 * @param avatarUrl 지금 사진 주소
 */
const AvatarPicker = ({ name, avatarUrl }: Props) => {
  // refs
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // states
  const [state, formAction, isPending] = useActionState(
    updateMyAvatar,
    INITIAL_STATE,
  );
  // handlers
  const handlePickClick = () => {
    inputRef.current?.click();
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    formRef.current?.requestSubmit();
  };
  // render
  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col items-center gap-2">
      <button
        type="button"
        aria-label="프로필 사진 바꾸기"
        disabled={isPending}
        className="group relative rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
        onClick={handlePickClick}>
        <Avatar
          name={name}
          src={avatarUrl}
          className="size-24 bg-beige text-10 leading-12 text-pine"
        />
        <span className="absolute right-0 bottom-0 grid size-8 place-items-center rounded-full border-2 border-white bg-pine text-white transition group-hover:bg-pine-deep">
          <Icon name="camera" size={16} />
        </span>
        {isPending ? (
          <span className="absolute inset-0 grid place-items-center rounded-full bg-white/70 text-pine">
            <Spinner size="medium" />
          </span>
        ) : null}
      </button>
      <input
        ref={inputRef}
        name="avatar"
        type="file"
        accept={AVATAR_UPLOAD.types.join(",")}
        className="sr-only"
        tabIndex={-1}
        onChange={handleFileChange}
      />
      {state.message ? (
        <p role="alert" className="text-3.5 leading-5 text-gold-deep">
          {state.message}
        </p>
      ) : null}
    </form>
  );
};

export default AvatarPicker;
