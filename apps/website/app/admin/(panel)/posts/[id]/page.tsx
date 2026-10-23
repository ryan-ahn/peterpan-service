import { notFound } from "next/navigation";

import PostEditor from "@/components/postEditor";
import { getPostById, listPostFiles } from "@/lib/posts";
import { publicStorageUrl } from "@/lib/format";

type EditPostProps = {
  params: Promise<{ id: string }>;
};

const EditPostPage = async ({ params }: EditPostProps) => {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) {
    notFound();
  }
  const files = await listPostFiles(id);
  return (
    <div className="flex flex-col gap-6">
      <PostEditor post={post} />
      {files.length > 0 ? (
        <ul className="text-sm">
          {files.map(file => (
            <li key={file.id}>
              <a className="text-green underline" href={publicStorageUrl({ bucket: file.bucket, path: file.path })}>
                {file.fileName}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default EditPostPage;
