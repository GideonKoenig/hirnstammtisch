import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User2 } from "lucide-react";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function UserAvatar(props: {
    userId: string;
    className?: string;
    fallbackClassName?: string;
    alt?: string;
}) {
    const session = authClient.useSession();
    const { data: imageUrl, error } = api.user.getImage.useQuery(
        {
            id: props.userId,
        },
        {
            enabled: !!session.data?.user,
        },
    );

    if (error) toast.error(error.message);

    let fallback: React.ReactNode = (
        <User2 className={cn("h-6 w-6", props.fallbackClassName)} />
    );

    return (
        <Avatar className={props.className}>
            <AvatarImage
                src={imageUrl as string | undefined}
                alt={props.alt ?? "User Avatar"}
            />
            <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
    );
}
