import { cacheLife } from "next/cache";
import Image, { type StaticImageData } from "next/image";

import heroBackground from "@assets/images/background/section-1.jpg";
import storyBackground from "@assets/images/background/section-2.png";
import neverlandBackground from "@assets/images/background/section-3.png";
import communityBackground from "@assets/images/background/section-4.png";
import bookDeco from "@assets/images/deco/second-2-right.png";
import neverlandBloom from "@assets/images/deco/section-3-bottom-left.png";
import neverlandCity from "@assets/images/deco/section-3-bottom-right.png";
import neverlandStar from "@assets/images/deco/section-3-star.png";
import neverlandLeaf from "@assets/images/deco/section-3-top-left.png";
import communityAlbum from "@assets/images/deco/section-4-album.png";
import communityFlower from "@assets/images/deco/section-4-flower.png";
import communityFlowerTall from "@assets/images/deco/section-4-flower2.png";
import communityStar from "@assets/images/deco/section-4-star.png";
import Button from "@components/button";
import Icon from "@components/icon";
import SiteHeader from "@components/siteHeader";
import Text from "@components/text";

/**
 * constants
 */
const BRUNCH_PROFILE_ID = "kkokdu";
const BRUNCH_BOOK_ADDRESS = "4th1";
const BRUNCH_BOOK_URL = "https://brunch.co.kr/brunchbook/4th1";
const BRUNCH_API_URL = "https://api.brunch.co.kr/v2/article/@kkokdu";
const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/Wb9lgXZjfeQ?rel=0";
const STORY_COUNT = 4;
const RECORD_COUNT = 3;
const ARTICLE_PAGE_COUNT = 3;

const NEVERLAND_CARDS = [
  {
    kind: "lamp",
    title: "꿈을 지키는 일",
    body: "혼자 남겨진 하루가 등불이 될 수 있도록, 한 사람의 자리를 따뜻하게 지킵니다.",
  },
  {
    kind: "hands",
    title: "서로의 손을 잡는 일",
    body: "혼자서는 닿지 않는 길이 있어도, 서로의 어깨에 기대어 길을 만듭니다.",
  },
  {
    kind: "path",
    title: "오래도록 이어가는 일",
    body: "한 번의 마음이 끊기지 않도록, 내일의 이야기를 준비합니다.",
  },
] as const;

const FOOTER_LINKS = [
  { id: "story", label: "재단 이야기" },
  { id: "neverland", label: "우리가 만드는 네버랜드" },
  { id: "community", label: "피터팬즈" },
  { id: "news", label: "소식과 기록" },
  { id: "support", label: "후원과 참여" },
];

/**
 * types
 */
type BrunchImageRaw = {
  url?: string | null;
};

type BrunchArticleRaw = {
  no: number;
  title?: string | null;
  contentSummary?: string | null;
  publishTime: number;
  magazineAddress?: string | null;
  magazineTitle?: string | null;
  profileId?: string | null;
  articleImageForHome?: string | null;
  articleImageList?: BrunchImageRaw[] | null;
};

type BrunchPayload = {
  data?: {
    list?: BrunchArticleRaw[];
    moreList?: boolean;
  } | null;
};

type BrunchCard = {
  id: number;
  title: string;
  summary: string;
  imageUrl: string | null;
  href: string;
  publishedOn: string;
  magazineTitle: string | null;
};

type HomeBrunch = {
  stories: BrunchCard[];
  records: BrunchCard[];
};

type NeverlandKind = (typeof NEVERLAND_CARDS)[number]["kind"];

/**
 * pre-root runtime
 * 브런치 글 목록. 프로필 글에서 브런치북과 재단 기록을 나눈다.
 */
const readHomeBrunch = async (): Promise<HomeBrunch> => {
  "use cache";
  cacheLife("hours");
  try {
    const articles = await readProfileArticles();
    return {
      stories: pickStories(articles),
      records: pickRecords(articles),
    };
  } catch {
    return { stories: [], records: [] };
  }
};

/**
 * screen — 피터팬 재단 홈
 */
const HomeScreen = async () => {
  // variables
  const brunch = await readHomeBrunch();
  // render
  return (
    <>
      <div className="fixed inset-0 z-0 bg-sky" aria-hidden="true">
        <Image
          src={heroBackground}
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="relative z-1 max-w-full overflow-x-hidden">
        <SiteHeader />
        <main className="max-w-full overflow-x-clip">
          <HeroSection />
          <FilmSection />
          <StorySection />
          <NeverlandSection />
          <CommunitySection stories={brunch.stories} />
          <NewsSection records={brunch.records} />
          <SupportSection />
          <FooterSection />
        </main>
      </div>
    </>
  );
};

/**
 * section
 */
const HeroSection = () => {
  // render
  return (
    <section
      className="relative flex min-h-dvh flex-col justify-center px-5 pt-[calc(var(--header-height)+24px)] pb-22 md:px-8"
      id="top">
      <div className="hero-shade" />
      <div className="relative grid w-full max-w-[1120px] grid-cols-1 items-end gap-10 lg:mx-auto lg:grid-cols-[minmax(0,1.15fr)_minmax(220px,0.7fr)]">
        <div className="flex flex-col gap-4.5">
          <Text as="h1" variant="display" color="white">
            어른이 되어서도,
            <br />
            꿈을 잃지 않도록.
          </Text>
          <Text variant="body" color="whiteSoft">
            한 사람의 자리에서 시작된 이야기가,
            <br />
            이제 우리가 함께 이어갑니다.
          </Text>
          <div className="flex flex-wrap gap-2.5">
            <Button variant="solid" text="피터팬즈 이야기" hasChevron />
            <Button variant="ghostLight" text="우리 재단 함께하기" hasChevron />
          </div>
        </div>
        <div className="max-w-none text-left lg:max-w-70 lg:justify-self-end lg:text-right">
          <Text as="p" variant="quote" color="white">
            “꿈을 꾸는 사람은
            <br />
            결코 혼자가 아니니까”
          </Text>
          <p className="mt-2.5">
            <Text as="span" variant="caption" color="whiteSoft">
              — 꼭두
            </Text>
          </p>
        </div>
      </div>
      <p className="static mt-7 max-w-60 text-left lg:absolute lg:right-[max(32px,calc((100%-1120px)/2))] lg:bottom-7 lg:mt-0 lg:text-right">
        <Text as="span" variant="caption" color="whiteSoft">
          꿈을 잃지 않도록, 어른이 된 우리가 네버랜드를 지키는 밤
        </Text>
      </p>
      <a
        className="absolute bottom-7 left-1/2 hidden size-10.5 -translate-x-1/2 place-items-center rounded-full border border-ivory/45 text-ivory md:grid"
        href="#film"
        aria-label="다음 이야기">
        <Icon name="chevron-down" size={18} />
      </a>
    </section>
  );
};

const FilmSection = () => {
  // render
  return (
    <section
      className="relative z-0 flex min-h-[78vh] items-center justify-center px-4 pt-12 pb-18 md:min-h-dvh md:px-5 md:pt-18 md:pb-24"
      id="film"
      aria-label="영상">
      <div className="aspect-video w-full max-w-[960px] overflow-hidden rounded-sheet border border-ivory/30 bg-sea shadow-player">
        <iframe
          className="size-full border-0"
          src={YOUTUBE_EMBED_URL}
          title="피터팬 재단 영상"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </section>
  );
};

const StorySection = () => {
  // render
  return (
    <section
      className="sheet-story relative z-1 scroll-mt-19 overflow-x-clip overflow-y-visible bg-paper px-0 pt-21 pb-16 lg:min-h-dvh lg:pt-27 lg:pb-24"
      id="story">
      <SheetBackdrop
        src={storyBackground}
        backdropClassName="sheet-backdrop-story"
        priority
      />
      <div className="relative z-2 mx-auto grid w-[min(1120px,calc(100%-32px))] items-center gap-7 md:w-[min(1120px,calc(100%-40px))] lg:grid-cols-[minmax(0,1fr)_minmax(260px,480px)]">
        <div className="flex flex-col gap-4.5">
          <Text as="p" variant="label" color="gold">
            Our Story
          </Text>
          <Text as="h2" variant="title">
            한 사람이 남긴 마음은,
            <br />
            수많은 사람의 내일이 됩니다.
          </Text>
          <Text variant="body" color="soft">
            좋은 어른이 되는 일은 사람을 바꾸는 일입니다. 사람은 혼자 세상을
            바꿀 수 없다고 말하지만, 한 사람이 있었습니다. 작가이자, 아버지이자,
            늘 다른 사람을 응원하던 사람. 그가 남긴 온기가 「피터팬 재단」이라는
            이름으로 많은 사람의 손에 이어지고 있습니다.
          </Text>
          <div>
            <Button variant="solid" text="꼭두의 이야기 읽기" hasChevron />
          </div>
        </div>
        <Image
          src={bookDeco}
          alt="안녕, 피터팬 책과 사진"
          className="h-auto w-full"
          sizes="(min-width: 1024px) 480px, 90vw"
        />
      </div>
    </section>
  );
};

const NeverlandSection = () => {
  // render
  return (
    <section
      className="sheet-neverland relative z-1 scroll-mt-19 overflow-x-clip overflow-y-visible bg-forest pt-21 lg:pt-27"
      id="neverland">
      <SheetBackdrop
        src={neverlandBackground}
        backdropClassName="sheet-backdrop-neverland"
      />
      <Image
        src={neverlandLeaf}
        alt=""
        className="pointer-events-none absolute top-0 left-0 z-3 h-auto w-17 opacity-85 select-none lg:w-[clamp(72px,10vw,152px)] lg:opacity-100"
      />
      <Image
        src={neverlandBloom}
        alt=""
        className="pointer-events-none absolute bottom-0 left-0 z-3 h-auto w-12 select-none lg:w-[clamp(54px,7.5vw,107px)]"
      />
      <Image
        src={neverlandStar}
        alt=""
        className="pointer-events-none absolute top-[14%] right-[6%] z-3 hidden h-auto w-[clamp(28px,3.2vw,48px)] select-none md:block"
      />
      <div className="relative z-2 mx-auto w-[min(1120px,calc(100%-32px))] pb-10 md:w-[min(1120px,calc(100%-40px))] lg:pb-16">
        <div className="grid items-end gap-9 lg:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.7fr)]">
          <div className="flex flex-col gap-4.5">
            <Text as="p" variant="label" color="goldLight">
              Our Neverland
            </Text>
            <Text as="h2" variant="title" color="cream">
              우리가 함께 만드는 네버랜드
            </Text>
            <Text variant="body" color="creamSoft">
              피터팬 재단은 더 많은 사람이 더 이상 혼자가 아니라고 느끼도록,
              포기하지 않도록 서로의 등불이 되어 연결하는 일을 합니다.
            </Text>
          </div>
          <div className="text-left lg:text-right">
            <Text as="p" variant="quote" color="cream">
              “좋은 나는 늘 사람이 있어
              <br />
              시작되고, 함께 만들어갑니다.”
            </Text>
            <p className="mt-2.5">
              <Text as="span" variant="caption" color="creamSoft">
                — 피터팬 재단
              </Text>
            </p>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5.5 lg:grid-cols-3">
          {NEVERLAND_CARDS.map(card => (
            <article key={card.kind} className="flex flex-col gap-3.5">
              <NeverlandArt kind={card.kind} />
              <Text as="h3" variant="heading" color="cream">
                {card.title}
              </Text>
              <Text variant="caption" color="creamSoft">
                {card.body}
              </Text>
            </article>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute right-0 bottom-0 z-4 h-[clamp(48px,12vw,72px)] w-[clamp(140px,42vw,240px)] overflow-hidden leading-none opacity-90 select-none lg:h-[clamp(56px,9vw,108px)] lg:w-[clamp(168px,26vw,340px)] lg:opacity-100">
        <Image
          src={neverlandCity}
          alt=""
          className="block size-full max-w-none object-cover object-right-bottom"
          sizes="480px"
        />
      </div>
    </section>
  );
};

const CommunitySection = ({ stories }: { stories: BrunchCard[] }) => {
  // render
  return (
    <section
      className="sheet-community relative z-2 scroll-mt-19 overflow-x-clip overflow-y-visible bg-transparent pt-21 pb-24 md:pt-16 lg:pt-20"
      id="community">
      <SheetBackdrop
        src={communityBackground}
        backdropClassName="sheet-backdrop-community"
      />
      <div className="relative z-2 mx-auto grid w-[min(1120px,calc(100%-32px))] items-center gap-9 md:w-[min(1120px,calc(100%-40px))] lg:grid-cols-[minmax(260px,420px)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4.5">
          <Text as="p" variant="label" color="gold">
            Our Community
          </Text>
          <Text as="h2" variant="title">
            피터팬즈,
            <br />
            꿈을 이어가는 사람들
          </Text>
          <Text variant="body" color="soft">
            피터팬즈는 각자의 자리에서 등불이 되어, 이 이야기를 함께 이어가는
            사람들입니다. 지금 이 페이지에서, 네버랜드를 꿈꾸는 피터팬즈의
            이야기를 만납니다.
          </Text>
          <div>
            <Button
              variant="solid"
              text="이야기 보기"
              href={BRUNCH_BOOK_URL}
              isExternal
              hasChevron
            />
          </div>
        </div>
        {stories.length === 0 ? (
          <Text variant="body" color="soft">
            브런치에서 이야기를 불러오지 못했습니다. 이야기 보기로 바로 이동할
            수 있습니다.
          </Text>
        ) : (
          <div className="relative max-w-full min-w-0 overflow-x-clip px-1 pt-4 pb-1">
            <Image
              src={communityFlower}
              alt=""
              className="pointer-events-none absolute top-[44%] left-0 z-3 h-auto w-9 -rotate-[14deg] select-none lg:top-[47%] lg:-left-[4%] lg:w-[clamp(44px,6vw,72px)]"
            />
            <Image
              src={communityFlowerTall}
              alt=""
              className="pointer-events-none absolute top-0 left-1/2 z-1 h-auto w-8 -translate-x-[52%] rotate-[8deg] select-none lg:top-[2%] lg:w-[clamp(38px,5.5vw,64px)]"
            />
            <Image
              src={communityFlower}
              alt=""
              className="pointer-events-none absolute top-[42%] right-0 z-3 h-auto w-8.5 rotate-[16deg] select-none lg:top-[45%] lg:-right-[4%] lg:w-[clamp(42px,6vw,70px)]"
            />
            <Image
              src={communityStar}
              alt=""
              className="pointer-events-none absolute top-0 left-[34%] z-4 h-auto w-4 select-none lg:left-[36%] lg:w-[clamp(18px,2.6vw,32px)]"
            />
            <div className="relative z-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-0.5 pt-2 pb-4 lg:grid lg:grid-cols-2 lg:gap-x-3 lg:gap-y-4.5 lg:overflow-visible lg:p-0">
              {stories.map(story => (
                <StoryPolaroid key={story.id} story={story} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const NewsSection = ({ records }: { records: BrunchCard[] }) => {
  // render
  return (
    <section className="scroll-mt-19 bg-cream pt-7 pb-27" id="news">
      <div className="mx-auto w-[min(1120px,calc(100%-32px))] md:w-[min(1120px,calc(100%-40px))]">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div className="flex flex-col gap-4.5">
            <Text as="p" variant="label" color="gold">
              News & Journals
            </Text>
            <Text as="h2" variant="title">
              우리의 모든 걸음을 기록합니다.
            </Text>
            <Text variant="body" color="soft">
              피터팬 재단이 새로운 소식과 기록을 정성껏 전합니다.
            </Text>
          </div>
          <Button
            variant="ghostDark"
            size="small"
            text="전체 보기"
            hasChevron
          />
        </div>
        {records.length === 0 ? (
          <div className="mt-7">
            <Text variant="body" color="soft">
              기록을 불러오지 못했습니다. 잠시 후 다시 열어 주세요.
            </Text>
          </div>
        ) : (
          <div className="mt-9 grid grid-cols-1 gap-7 lg:grid-cols-3">
            {records.map(record => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const SupportSection = () => {
  // render
  return (
    <section
      className="support-night relative scroll-mt-19 overflow-hidden pt-30 pb-18"
      id="support">
      <span className="shooting" aria-hidden="true" />
      <Image
        src={communityStar}
        alt=""
        className="pointer-events-none absolute top-[14%] right-[18%] z-3 h-auto w-[clamp(48px,6vw,84px)] select-none"
      />
      <Image
        src={communityFlower}
        alt=""
        className="pointer-events-none absolute right-0 bottom-0 z-3 h-auto w-[clamp(90px,12vw,170px)] select-none"
      />
      <div className="mx-auto grid w-[min(1120px,calc(100%-32px))] items-center gap-8 md:w-[min(1120px,calc(100%-40px))] lg:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.7fr)]">
        <div className="flex flex-col gap-4.5">
          <Text as="p" variant="label" color="goldLight">
            Together
          </Text>
          <Text as="h2" variant="title" color="cream">
            이 이야기는
            <br />
            아직 끝나지 않았습니다.
          </Text>
          <Text variant="body" color="creamSoft">
            피터팬 재단과 함께 네버랜드를 지켜 주세요. 지금, 또 다른 누군가의
            네버랜드가 시작될 수 있습니다.
          </Text>
          <div>
            <Button variant="gold" text="함께하기" hasChevron />
          </div>
        </div>
        <div className="text-left lg:text-right">
          <Text as="p" variant="quote" color="cream">
            “사람, 사랑, 그리고 꿈을
            <br />
            잃지 않는 사람이 있다면,
            <br />그 별은, 결코 꺼지지 않는다.”
          </Text>
          <p className="mt-2.5">
            <Text as="span" variant="caption" color="creamSoft">
              — 피터팬 재단
            </Text>
          </p>
        </div>
      </div>
    </section>
  );
};

const FooterSection = () => {
  // render
  return (
    <footer className="bg-night-deep pt-9 pb-7 text-cream">
      <div className="mx-auto w-[min(1120px,calc(100%-32px))] md:w-[min(1120px,calc(100%-40px))]">
        <div className="flex flex-col items-start justify-between gap-7 lg:flex-row">
          <a className="flex items-center gap-2.5" href="#top">
            <Icon name="star" size={16} color="#e7cb8d" />
            <Text as="span" variant="heading" color="cream">
              피터팬 재단
            </Text>
          </a>
          <nav
            className="flex max-w-[460px] flex-wrap gap-x-5.5 gap-y-2 text-4 opacity-80"
            aria-label="하단 메뉴">
            {FOOTER_LINKS.map(link => (
              <a key={link.id} href={`#${link.id}`}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col items-start gap-3.5 lg:items-end">
            <div className="flex gap-2">
              <button
                className="grid size-9 cursor-pointer place-items-center rounded-full border border-cream/30 bg-transparent p-0 text-cream"
                type="button"
                aria-label="인스타그램">
                <Icon name="instagram" size={16} />
              </button>
              <button
                className="grid size-9 cursor-pointer place-items-center rounded-full border border-cream/30 bg-transparent p-0 text-cream"
                type="button"
                aria-label="유튜브">
                <Icon name="youtube" size={16} />
              </button>
              <button
                className="grid size-9 cursor-pointer place-items-center rounded-full border border-cream/30 bg-transparent p-0 text-cream"
                type="button"
                aria-label="메일">
                <Icon name="mail" size={16} />
              </button>
            </div>
            <Button variant="gold" size="small" text="함께하기" />
          </div>
        </div>
        <p className="mt-7 text-3 opacity-55">
          © 2026 Peter Pan Foundation. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

/**
 * inner components
 */
type SheetBackdropProps = {
  src: StaticImageData;
  backdropClassName: string;
  priority?: boolean;
};

const SheetBackdrop = ({
  src,
  backdropClassName,
  priority,
}: SheetBackdropProps) => {
  // render
  return (
    <div className={`sheet-backdrop ${backdropClassName}`} aria-hidden>
      <div className="sheet-backdrop-media">
        <Image
          src={src}
          alt=""
          fill
          priority={priority}
          className="object-cover object-top"
          sizes="100vw"
        />
      </div>
    </div>
  );
};

const NeverlandArt = ({ kind }: { kind: NeverlandKind }) => {
  // variables
  const artClassName = {
    lamp: "art-lamp",
    hands: "art-hands",
    path: "art-path",
  }[kind];
  const starClassName = {
    lamp: "absolute right-[14%] bottom-[16%] h-auto w-13.5",
    hands:
      "absolute top-[42%] left-1/2 h-auto w-23 -translate-x-1/2 -translate-y-1/2",
    path: "",
  }[kind];
  // render
  return (
    <div
      className={`relative h-60 overflow-hidden rounded-sheet bg-forest-night ${artClassName}`}>
      {kind === "path" ? (
        <Image
          src={neverlandCity}
          alt=""
          className="absolute inset-x-0 bottom-0 h-auto w-full"
        />
      ) : (
        <Image src={neverlandStar} alt="" className={starClassName} />
      )}
    </div>
  );
};

const StoryPolaroid = ({ story }: { story: BrunchCard }) => {
  // render
  return (
    <a
      className="flex w-[min(240px,72vw)] shrink-0 snap-start flex-col gap-3 text-inherit lg:w-auto lg:min-w-0 lg:odd:-rotate-4 lg:even:mt-7 lg:even:rotate-[3.5deg]"
      href={story.href}
      target="_blank"
      rel="noreferrer">
      <div className="relative aspect-[1284/1225]">
        {story.imageUrl ? (
          <div className="absolute top-[8%] left-[16%] z-0 h-[61%] w-[64%] overflow-hidden">
            <Image
              src={story.imageUrl}
              alt=""
              fill
              sizes="(max-width: 1023px) 45vw, 240px"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="photo-fallback absolute top-[8%] left-[16%] z-0 h-[61%] w-[64%]" />
        )}
        <Image
          src={communityAlbum}
          alt=""
          fill
          sizes="360px"
          className="pointer-events-none absolute inset-0 z-1 size-full"
        />
      </div>
      <Text as="span" variant="caption" color="soft">
        {story.title}
      </Text>
    </a>
  );
};

const RecordCard = ({ record }: { record: BrunchCard }) => {
  // render
  return (
    <a
      className="flex min-w-0 flex-col gap-3 border-t border-gold-deep/45 pt-4 text-inherit"
      href={record.href}
      target="_blank"
      rel="noreferrer">
      <Text as="span" variant="caption" color="gold">
        {record.publishedOn}
      </Text>
      <Text as="span" variant="heading" className="line-clamp-3">
        {record.title}
      </Text>
      <Text as="span" variant="caption" color="soft" className="line-clamp-4">
        {record.summary}
      </Text>
    </a>
  );
};

/**
 * utils
 * inner·runtime이 참조하는 순수 함수.
 */
const readProfileArticles = async (): Promise<BrunchArticleRaw[]> => {
  const articles: BrunchArticleRaw[] = [];
  let lastTime = 0;
  for (let page = 0; page < ARTICLE_PAGE_COUNT; page += 1) {
    const url = new URL(BRUNCH_API_URL);
    url.searchParams.set("lastTime", String(lastTime));
    url.searchParams.set("thumbnail", "Y");
    url.searchParams.set("membershipContent", "false");
    const response = await fetch(url);
    if (!response.ok) {
      return articles;
    }
    const payload = (await response.json()) as BrunchPayload;
    const list = payload.data?.list ?? [];
    articles.push(...list);
    const nextTime = list.at(-1)?.publishTime;
    if (!payload.data?.moreList || !nextTime) {
      return articles;
    }
    lastTime = nextTime;
  }
  return articles;
};

const pickStories = (articles: BrunchArticleRaw[]): BrunchCard[] => {
  const stories: BrunchCard[] = [];
  articles.forEach(article => {
    if (stories.length >= STORY_COUNT) {
      return;
    }
    if (article.magazineAddress !== BRUNCH_BOOK_ADDRESS) {
      return;
    }
    const card = toCard(article);
    if (!card) {
      return;
    }
    stories.push(card);
  });
  return stories;
};

const pickRecords = (articles: BrunchArticleRaw[]): BrunchCard[] => {
  const records: BrunchCard[] = [];
  articles.forEach(article => {
    if (records.length >= RECORD_COUNT) {
      return;
    }
    const card = toCard(article);
    if (!card) {
      return;
    }
    records.push(card);
  });
  return records;
};

const toCard = (article: BrunchArticleRaw): BrunchCard | null => {
  const title = article.title?.trim() ?? "";
  if (!article.no || !title) {
    return null;
  }
  const profileId = article.profileId || BRUNCH_PROFILE_ID;
  return {
    id: article.no,
    title,
    summary: (article.contentSummary ?? "").replace(/\s+/g, " ").trim(),
    imageUrl: pickImageUrl(article),
    href: `https://brunch.co.kr/@${profileId}/${article.no}`,
    publishedOn: formatPublishDate({ publishTime: article.publishTime }),
    magazineTitle: article.magazineTitle ?? null,
  };
};

const pickImageUrl = (article: BrunchArticleRaw): string | null => {
  const listed = article.articleImageList ?? [];
  const fromList = listed.find(image => image.url)?.url ?? "";
  const raw = article.articleImageForHome || fromList;
  if (!raw) {
    return null;
  }
  if (raw.startsWith("http://")) {
    return `https://${raw.slice("http://".length)}`;
  }
  return raw;
};

type FormatPublishDateParams = {
  publishTime: number;
};

const formatPublishDate = (params: FormatPublishDateParams): string => {
  const { publishTime } = params;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(publishTime));
};

export default HomeScreen;
