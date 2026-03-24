import {getImageById} from "~/server/queries";
import Image from "next/image";
import {clerkClient} from "@clerk/nextjs/server";

export default async function FullPageImage(props: { photoId: number }) {
    if (isNaN(props.photoId)) {
        throw new Error("Invalid photo ID");
    }

    const image = await getImageById(props.photoId);

    const userId = image.userId;
    let uploaderName = "Unknown user";

    if (userId.startsWith("user_")) {
        try {
            const client = await clerkClient();
            const user = await client.users.getUser(userId);
            
            // Explicitly extract primitive strings
            const fullName = user.fullName ?? "";
            const username = user.username ?? "";
            const email = user.primaryEmailAddress?.emailAddress ?? "";
            
            uploaderName = fullName || username || email || "Unknown user";
        } catch {
            uploaderName = "Unknown user";
        }
    }

    return (
        <div className="flex flex-col md:flex-row h-full w-full max-w-6xl mx-auto overflow-hidden rounded-[2rem] bg-card shadow-2xl">
            <div className="relative flex-[2] min-h-[400px] bg-foreground/5">
                <Image
                    src={image.url}
                    alt={image.name}
                    priority
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                />
            </div>
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-between border-t md:border-t-0 md:border-l border-foreground/5">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-sm font-bold tracking-widest uppercase text-foreground/40 mb-2">Image Details</h2>
                        <h1 className="text-4xl font-bold tracking-tight">{image.name}</h1>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <span className="block text-xs font-bold uppercase tracking-widest text-foreground/30 mb-1">Uploaded By</span>
                            <span className="font-serif text-lg italic">{uploaderName}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold uppercase tracking-widest text-foreground/30 mb-1">Created On</span>
                            <span className="font-serif text-lg italic">{new Date(image.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-12">
                    <button className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download Image
                    </button>
                </div>
            </div>
        </div>
    );
}
