import "server-only";
import { db } from "~/server/db";
import { auth } from "@clerk/nextjs/server";
import { images } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getDefaultImages() {
  console.log("QUERIES: Fetching default images");

  return db
    .select({
      id: images.id,
      name: images.name,
      url: images.url,
      userId: images.userId,
    })
    .from(images)
    .where(eq(images.isPublic, true))
    .orderBy(desc(images.id));
}

export async function getUserImages() {
  const user = await auth();
  console.log("QUERIES: Fetching user images for", user.userId);

  if (!user.userId) throw new Error("Unauthorized");

  const result = await db
    .select({
      id: images.id,
      name: images.name,
      url: images.url,
      userId: images.userId,
    })
    .from(images)
    .where(eq(images.userId, user.userId))
    .orderBy(desc(images.id));

  console.log("QUERIES: Found", result.length, "images");

  return result;
}

export async function getImageById(id: number) {
  const user = await auth();

  const result = await db
    .select()
    .from(images)
    .where(eq(images.id, id))
    .limit(1);

  const image = result[0];

  if (!image) throw new Error("Image not found");

  if (!image.isPublic && (!user.userId || image.userId !== user.userId)) {
    throw new Error("Unauthorized");
  }

  return {
    id: image.id,
    name: image.name,
    url: image.url,
    userId: image.userId,
    createdAt: image.createdAt.toISOString(),
  };
}
