import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  // Debug : vérifier tous les posts d'abord
  const allPosts = await prisma.post.findMany({
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  console.log("=== DEBUG ===");
  console.log("Tous les posts:", allPosts.length);
  console.log(
    "Posts détails:",
    allPosts.map((p) => ({
      id: p.id,
      title: p.title,
      published: p.published,
    }))
  );

  // Récupération des posts publiés
  const posts = await prisma.post.findMany({
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

  console.log("Posts publiés:", posts.length);
  console.log("=== FIN DEBUG ===");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête avec titre et bouton */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Posts</h1>
          <Link
            href="/newPost"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Nouveau Post
          </Link>
        </div>

        {/* Debug info - à supprimer plus tard */}
        <div className="mb-4 p-4 bg-yellow-100 rounded-lg">
          <p className="text-sm text-yellow-800">
            Debug: {allPosts.length} posts total, {posts.length} posts publiés
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {allPosts.length === 0
                ? "Aucun post créé pour le moment."
                : "Aucun post publié pour le moment."}
            </p>
            <Link
              href="/newPost"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {allPosts.length === 0
                ? "Créer votre premier post"
                : "Créer un nouveau post"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {post.imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h2>

                  {post.content && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.content.length > 150
                        ? `${post.content.substring(0, 150)}...`
                        : post.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="font-medium">
                        {post.User.name || post.User.email}
                      </span>
                    </div>
                    <time dateTime={post.createdAt.toISOString()}>
                      {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>

                  {/* Indicateurs de statut */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Publié
                    </span>
                    {post.createdAt !== post.updatedAt && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Modifié
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Informations supplémentaires */}
        {posts.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              {posts.length} post{posts.length > 1 ? "s" : ""} publié
              {posts.length > 1 ? "s" : ""}
            </p>
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
