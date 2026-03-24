import {SignInButton, UserButton} from "@clerk/nextjs";
import {auth} from "@clerk/nextjs/server";
import {SimpleUploadButton} from "~/app/_components/simple-upload-button";
import Link from "next/link";

export async function TopNav() {
    const { userId } = await auth();

    return (
        <nav className="flex w-full justify-between items-center px-10 py-6 text-xl">
            <Link href="/" className="font-serif text-3xl font-bold tracking-tight">
                GALLERY
            </Link>

            <div className="flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
                <Link href="/" className="hover:opacity-70 transition-opacity">Discover</Link>
                
                {!userId ? (
                    <SignInButton mode="modal">
                        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-full hover:opacity-90 transition-all">
                            Sign In
                        </button>
                    </SignInButton>
                ) : (
                    <div className="flex items-center gap-6">
                        <SimpleUploadButton />
                        <UserButton 
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-10 h-10 border border-foreground/10"
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        </nav>
    );
}
