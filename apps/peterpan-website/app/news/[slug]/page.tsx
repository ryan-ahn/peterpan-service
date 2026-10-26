import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { categoryLabel, publicStorageUrl } from "@repo/db/boards";

import BrandText from "@components/brandText";
import { formatDate, summarize } from "@lib/format";
import { getNewsBySlug, listPostFiles } from "@lib/posts";

/**
 * types
 */
type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const post = await getNewsBySlug(slug).catch(() => null);
  if (!post) {
    return { title: "소식" };
  }
  const description =
    summarize(post.body) ||
    `${categoryLabel(post.category)} · 피터팬 재단 소식`;
  return {
    title: post.title,
    description,
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.createdAt.toISOString(),
    },
  };
};

/**
 * screen — 소식 본문과 첨부파일
 */
const NewsDetailScreen = async ({ params }: Props) => {
  // variables
  const { slug } = await params;
  const post = await getNewsBySlug(slug).catch(() => null);
  if (!post) {
    notFound();
  }
  const files = await listPostFiles(post.id).catch(() => []);
  const paragraphs = post.body
    .split(/\n{2,}/)
    .map(item => item.trim())
    .filter(Boolean);
  const isPress = post.category === "press";
  // render
  return (
    <article className="page-article py-10 lg:py-12">
      <Link href="/news" className="text-4 leading-5 text-pine">
        목록으로
      </Link>
      <BrandText variant="caption" color="goldDeep" className="mt-6">
        {categoryLabel(post.category)}
      </BrandText>
      <BrandText as="h1" variant="section" color="pine" className="mt-2">
        {post.title}
      </BrandText>
      <BrandText variant="caption" color="muted" className="mt-3">
        {isPress && post.summary
          ? `${post.summary} · ${formatDate(post.createdAt)}`
          : formatDate(post.createdAt)}
      </BrandText>
      <div className="mt-8 flex flex-col gap-5">
        {paragraphs.map(paragraph => (
          <BrandText key={paragraph.slice(0, 32)} variant="body">
            {paragraph}
          </BrandText>
        ))}
      </div>
      {post.externalUrl ? (
        <a
          href={post.externalUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex text-pine underline">
          {isPress ? "원문 기사 보기" : "관련 링크"}
        </a>
      ) : null}
      {files.length > 0 ? (
        <ul className="mt-8 flex flex-col gap-2">
          {files.map(file => (
            <li key={file.id}>
              <a
                href={publicStorageUrl({
                  bucket: file.bucket,
                  path: file.path,
                })}
                className="text-pine underline">
                {file.fileName}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
};

export default NewsDetailScreen;
