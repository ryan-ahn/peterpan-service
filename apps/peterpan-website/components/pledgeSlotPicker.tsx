"use client";

import { type ChangeEvent, useState } from "react";

import { PLEDGE_SLOT_AMOUNT, PLEDGE_SLOT_MAX } from "@repo/db/boards";
import cn from "@repo/ui/lib/cn";
import Text from "@repo/ui/text";

/**
 * constants
 */
const SLOT_OPTIONS = [1, 2, 3, 4, 5, 10, 15, 20, 30, 50].filter(
  count => count <= PLEDGE_SLOT_MAX,
);

const FIELD_CLASS =
  "h-12 rounded-xlarge border border-beige bg-white px-4 outline-none focus:border-pine";

/**
 * utils
 */
const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

/**
 * 약정 구좌 선택. 1구좌 10만 원이며 선택한 구좌에 맞는 입금 금액을 함께 보여 준다
 */
const PledgeSlotPicker = () => {
  // states
  const [slots, setSlots] = useState(1);
  // variables
  const amount = slots * PLEDGE_SLOT_AMOUNT;
  // handlers
  const handleSlotChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSlots(Number(event.target.value));
  };
  // render
  return (
    <div className="flex flex-col gap-3 rounded-xlarge border border-beige bg-paper px-5 py-5">
      <input type="hidden" name="kind" value="pledge" />
      <label className="flex flex-col gap-2 text-4 leading-5">
        약정 구좌
        <select
          name="slotCount"
          value={String(slots)}
          className={cn(FIELD_CLASS, "w-full appearance-none")}
          onChange={handleSlotChange}>
          {SLOT_OPTIONS.map(count => (
            <option key={count} value={count}>
              {count}구좌 ({formatWon(count * PLEDGE_SLOT_AMOUNT)})
            </option>
          ))}
        </select>
      </label>
      <Text variant="body-3" color="muted">
        창립발기 약정은 1구좌 {formatWon(PLEDGE_SLOT_AMOUNT)}입니다. 구글폼에
        적어 주신 구좌 수와 같게 선택해 주세요.
      </Text>
      <p className="text-6 leading-9 font-semibold text-pine">
        입금 금액 {formatWon(amount)}
        <span className="ml-2 text-4 leading-6 font-normal text-ink/70">
          ({slots}구좌)
        </span>
      </p>
    </div>
  );
};

export default PledgeSlotPicker;
