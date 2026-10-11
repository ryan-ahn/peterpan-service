import { cacheLife } from "next/cache";
import Image, { type StaticImageData } from "next/image";

import heroBackground from "@assets/images/background/section-1.png";
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

import styles from "./home.module.css";

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
      <div className={styles.sky} aria-hidden="true">
        <Image
          src={heroBackground}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.skyImage}
        />
      </div>
      <div className={styles.page}>
        <SiteHeader />
        <main>
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
    <section className={styles.hero} id="top">
      <div className={styles.heroShade} />
      <div className={styles.heroGrid}>
        <div className={styles.stack}>
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
          <div className={styles.actions}>
            <Button variant="solid" text="피터팬즈 이야기" hasChevron />
            <Button variant="ghostLight" text="우리 재단 함께하기" hasChevron />
          </div>
        </div>
        <div className={styles.heroQuote}>
          <Text as="p" variant="quote" color="white">
            “꿈을 꾸는 사람은
            <br />
            결코 혼자가 아니니까”
          </Text>
          <p className={styles.quoteBy}>
            <Text as="span" variant="caption" color="whiteSoft">
              — 꼭두
            </Text>
          </p>
        </div>
      </div>
      <p className={styles.heroNote}>
        <Text as="span" variant="caption" color="whiteSoft">
          꿈을 잃지 않도록, 어른이 된 우리가 네버랜드를 지키는 밤
        </Text>
      </p>
      <a className={styles.scrollCue} href="#film" aria-label="다음 이야기">
        <Icon name="chevron-down" size={18} />
      </a>
    </section>
  );
};

const FilmSection = () => {
  // render
  return (
    <section className={styles.film} id="film" aria-label="영상">
      <div className={styles.player}>
        <iframe
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
      className={`${styles.sheet} ${styles.story} ${styles.anchor}`}
      id="story">
      <SheetBackdrop
        src={storyBackground}
        backdropClassName={styles.sheetBackdropStory}
      />
      <div className={`${styles.body} ${styles.wrap} ${styles.storyGrid}`}>
        <div className={styles.stack}>
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
          className={styles.book}
          sizes="(min-width: 980px) 480px, 90vw"
        />
      </div>
    </section>
  );
};

const NeverlandSection = () => {
  // render
  return (
    <section
      className={`${styles.sheet} ${styles.neverland} ${styles.anchor}`}
      id="neverland">
      <SheetBackdrop
        src={neverlandBackground}
        backdropClassName={styles.sheetBackdropNeverland}
      />
      <Image
        src={neverlandLeaf}
        alt=""
        className={`${styles.deco} ${styles.leaf}`}
      />
      <Image
        src={neverlandBloom}
        alt=""
        className={`${styles.deco} ${styles.bloom}`}
      />
      <Image
        src={neverlandStar}
        alt=""
        className={`${styles.deco} ${styles.floatingStar}`}
      />
      <div className={`${styles.body} ${styles.wrap}`}>
        <div className={styles.neverlandHead}>
          <div className={styles.stack}>
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
          <div className={styles.neverlandQuote}>
            <Text as="p" variant="quote" color="cream">
              “좋은 나는 늘 사람이 있어
              <br />
              시작되고, 함께 만들어갑니다.”
            </Text>
            <p className={styles.quoteBy}>
              <Text as="span" variant="caption" color="creamSoft">
                — 피터팬 재단
              </Text>
            </p>
          </div>
        </div>
        <div className={styles.cards}>
          {NEVERLAND_CARDS.map(card => (
            <article key={card.kind} className={styles.card}>
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
      <div className={`${styles.deco} ${styles.horizon}`}>
        <Image
          src={neverlandCity}
          alt=""
          className={styles.horizonImage}
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
      className={`${styles.sheet} ${styles.community} ${styles.anchor}`}
      id="community">
      <SheetBackdrop
        src={communityBackground}
        backdropClassName={styles.sheetBackdropCommunity}
      />
      <div className={`${styles.body} ${styles.wrap} ${styles.communityGrid}`}>
        <div className={styles.stack}>
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
          <div className={styles.polaroidsStage}>
            <Image
              src={communityFlower}
              alt=""
              className={styles.communityFlowerLeft}
            />
            <Image
              src={communityFlowerTall}
              alt=""
              className={styles.communityFlowerGap}
            />
            <Image
              src={communityFlower}
              alt=""
              className={styles.communityFlowerRight}
            />
            <Image
              src={communityStar}
              alt=""
              className={styles.communityStarDeco}
            />
            <div className={styles.polaroids}>
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
    <section className={`${styles.news} ${styles.anchor}`} id="news">
      <div className={styles.wrap}>
        <div className={styles.newsHead}>
          <div className={styles.stack}>
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
          <div className={styles.empty}>
            <Text variant="body" color="soft">
              기록을 불러오지 못했습니다. 잠시 후 다시 열어 주세요.
            </Text>
          </div>
        ) : (
          <div className={styles.records}>
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
    <section className={`${styles.support} ${styles.anchor}`} id="support">
      <span className={styles.shooting} aria-hidden="true" />
      <Image
        src={communityStar}
        alt=""
        className={`${styles.deco} ${styles.supportStar}`}
      />
      <Image
        src={communityFlower}
        alt=""
        className={`${styles.deco} ${styles.supportFlower}`}
      />
      <div className={`${styles.wrap} ${styles.supportGrid}`}>
        <div className={styles.stack}>
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
        <div className={styles.supportQuote}>
          <Text as="p" variant="quote" color="cream">
            “사람, 사랑, 그리고 꿈을
            <br />
            잃지 않는 사람이 있다면,
            <br />그 별은, 결코 꺼지지 않는다.”
          </Text>
          <p className={styles.quoteBy}>
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
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <div className={styles.footerGrid}>
          <a className={styles.footerBrand} href="#top">
            <Icon name="star" size={16} color="#e7cb8d" />
            <Text as="span" variant="heading" color="cream">
              피터팬 재단
            </Text>
          </a>
          <nav className={styles.footerLinks} aria-label="하단 메뉴">
            {FOOTER_LINKS.map(link => (
              <a key={link.id} href={`#${link.id}`}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className={styles.footerActions}>
            <div className={styles.socials}>
              <button
                className={styles.social}
                type="button"
                aria-label="인스타그램">
                <Icon name="instagram" size={16} />
              </button>
              <button
                className={styles.social}
                type="button"
                aria-label="유튜브">
                <Icon name="youtube" size={16} />
              </button>
              <button className={styles.social} type="button" aria-label="메일">
                <Icon name="mail" size={16} />
              </button>
            </div>
            <Button variant="gold" size="small" text="함께하기" />
          </div>
        </div>
        <p className={styles.copy}>
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
};

const SheetBackdrop = ({ src, backdropClassName }: SheetBackdropProps) => {
  // render
  return (
    <div
      className={`${styles.sheetBackdrop} ${backdropClassName}`}
      aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        className={styles.sheetBackdropImage}
        sizes="150vw"
      />
    </div>
  );
};

const NeverlandArt = ({ kind }: { kind: NeverlandKind }) => {
  // variables
  const artClassName = {
    lamp: styles.artLamp,
    hands: styles.artHands,
    path: styles.artPath,
  }[kind];
  // render
  return (
    <div className={`${styles.art} ${artClassName}`}>
      {kind === "path" ? (
        <Image src={neverlandCity} alt="" className={styles.artCity} />
      ) : (
        <Image src={neverlandStar} alt="" className={styles.artStar} />
      )}
    </div>
  );
};

const StoryPolaroid = ({ story }: { story: BrunchCard }) => {
  // render
  return (
    <a
      className={styles.polaroid}
      href={story.href}
      target="_blank"
      rel="noreferrer">
      <div className={styles.frame}>
        {story.imageUrl ? (
          <div className={styles.photoWrap}>
            <Image
              src={story.imageUrl}
              alt=""
              fill
              sizes="(max-width: 980px) 45vw, 240px"
              className={styles.photo}
              unoptimized
            />
          </div>
        ) : (
          <div className={styles.photoFallback} />
        )}
        <Image
          src={communityAlbum}
          alt=""
          fill
          sizes="360px"
          className={styles.frameImage}
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
      className={styles.record}
      href={record.href}
      target="_blank"
      rel="noreferrer">
      <Text as="span" variant="caption" color="gold">
        {record.publishedOn}
      </Text>
      <span className={styles.recordTitle}>
        <Text as="span" variant="heading">
          {record.title}
        </Text>
      </span>
      <span className={styles.recordSummary}>
        <Text as="span" variant="caption" color="soft">
          {record.summary}
        </Text>
      </span>
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
