import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { categoryLabel, getPostBySlug, listPostFiles } from "@/lib/posts";
import { formatDate, publicStorageUrl } from "@/lib/format";

type NewsDetailProps = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({ params }: NewsDetailProps): Promise<Metadata> => {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  return { title: post?.title ?? "소식" };
};

const NewsDetailPage = async ({ params }: NewsDetailProps) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post || post.board !== "news" || !post.published) {
    notFound();
  }
  const files = await listPostFiles(post.id).catch(() => []);
  const paragraphs = post.body.split(/\n{2,}/).map(item => item.trim()).filter(Boolean);
  return (
    <article className="mx-auto w-[min(820px,calc(100%-2rem))] py-16">
      <Link href="/news" className="text-sm text-green">
        목록으로
      </Link>
      <p className="mt-6 text-sm text-gold-deep">{categoryLabel(post.category)}</p>
      <h1 className="mt-2 text-3xl font-semibold text-green md:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-muted">{formatDate(post.createdAt)}</p>
      <div className="mt-8 flex flex-col gap-5 leading-8">
        {paragraphs.map(paragraph => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
      {post.externalUrl ? (
        <a href={post.externalUrl} className="mt-8 inline-flex text-green underline" target="_blank" rel="noreferrer">
          관련 링크
        </a>
      ) : null}
      {files.length > 0 ? (
        <ul className="mt-8 flex flex-col gap-2">
          {files.map(file => (
            <li key={file.id}>
              <a
                className="text-green underline"
                href={publicStorageUrl({ bucket: file.bucket, path: file.path })}>
                {file.fileName}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
};

export default NewsDetailPage;
