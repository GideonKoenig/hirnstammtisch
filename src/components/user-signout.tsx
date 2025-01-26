import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteCookie } from "~/lib/utils";

export function UserSignout() {
    const router = useRouter();

    return (
        <button
            className="hover:bg-menu-hover flex flex-row items-center gap-1 rounded-md bg-transparent p-2 text-sm"
            onMouseDown={() => {
                deleteCookie("username");
                router.push("/");
            }}
        >
            <LogOut className="h-4 w-4" />
            Sign Out
        </button>
    );
}
