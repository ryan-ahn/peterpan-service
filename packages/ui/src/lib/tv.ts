import { createTV } from "tailwind-variants";

import twMergeConfig from "./twMergeConfig";

/**
 * 토큰 이름을 아는 `tv`. 변형 정의는 이 함수로 만든다.
 */
const tv = createTV({ twMergeConfig });

export default tv;
