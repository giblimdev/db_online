import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  // Récupération directe des posts avec Prisma
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes Posts</h1>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            Aucun post publié pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {post.imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {post.title}
                  </h2>

                  {post.content && (
                    <p className="text-gray-600 mb-4">
                      {post.content.length > 100
                        ? `${post.content.substring(0, 100)}...`
                        : post.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Par {post.User.name || post.User.email}</span>
                    <time>
                      {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                    </time>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Posts - Mon App",
  description: "Découvrez tous les posts publiés",
};
