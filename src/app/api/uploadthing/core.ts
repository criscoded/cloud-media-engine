import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({
        image: {
            /**
             * For full list of options and defaults, see the File Route API reference
             * @see https://docs.uploadthing.com/file-routes#route-config
             */
            maxFileSize: "4MB",
            maxFileCount: 10,
        },
    })
        // Set permissions and file types for this FileRoute
        .middleware(async () => {
            // This code runs on your server before upload
            const user = await auth();

            // If you throw, the user will not be able to upload
            if (!user.userId) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("SERVER: onUploadComplete started", { userId: metadata.userId, fileName: file.name });

            try {
                // Ensure the database operation is awaited and doesn't timeout
                const dbResult = await db.insert(images).values({
                    name: file.name,
                    url: file.url,
                    userId: metadata.userId,
                    isPublic: false,
                }).returning();
                
                console.log("SERVER: Database insertion success", dbResult);
                
                return { 
                    uploadedBy: metadata.userId, 
                    fileName: file.name,
                    status: "ok" 
                };
            } catch (err) {
                console.error("SERVER: Database insertion CRASHED", err);
                // Return a failure object instead of throwing to see if it reaches the client
                return { error: "Database failure", details: String(err) };
            }
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
