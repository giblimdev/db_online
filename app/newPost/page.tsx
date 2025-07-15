// app/newPost/page.js
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

// Server action (can be inline or moved to separate file)
async function createPost(formData: FormData) {
  "use server";

  const titleEntry = formData.get("title");
  if (typeof titleEntry !== "string") {
    throw new Error(
      "Le titre est requis et doit être une chaîne de caractères."
    );
  }
  const title: string = titleEntry;
  const content = formData.get("content");
  const imageUrl = formData.get("imageUrl");
  const published = formData.get("published") === "on";

  try {
    // Your existing server action logic
    let user = await prisma.user.findFirst();

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "admin@example.com",
          name: "Administrateur",
          updatedAt: new Date(),
        },
      });
    }

    await prisma.post.create({
      data: {
        title,
        content: typeof content === "string" ? content : null,
        imageUrl: typeof imageUrl === "string" ? imageUrl : null,
        published,
        authorId: user.id,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    throw new Error("Impossible de créer le post");
  }

  redirect("/");
}

// This is the required React component default export
export default function NewPostPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Créer un nouveau post</h1>

      <form action={createPost} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Titre *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Contenu
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
            URL de l'image
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            name="published"
            className="mr-2"
          />
          <label htmlFor="published" className="text-sm font-medium">
            Publier immédiatement
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Créer le post
        </button>
      </form>
    </div>
  );
}
