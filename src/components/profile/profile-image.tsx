"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { UploadButton } from "@/lib/uploadthing";
import { LoaderCircle, Upload, X, User2 } from "lucide-react";
import { usePwa } from "@/components/pwa/pwa-provider";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/use-user";
import { toast } from "sonner";
import { UserAvatar } from "@/components/ui/user-avatar";
import { authClient } from "@/lib/auth-client";

export function ProfileImage(props: { className?: string }) {
    const { isOffline } = usePwa();
    const [isLoading, setIsLoading] = useState(false);
    const user = useUser();

    const utils = api.useUtils();
    const deleteProfileImage = api.user.deleteProfileImageAsset.useMutation();

    if (!user) return null;

    const imageSource = user.useProviderImage ? "Google" : "Custom";
    const hasImage = user.uploadedImageAssetId ?? user.useProviderImage;

    return (
        <div
            className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-6",
                props.className,
            )}
        >
            <div className="group relative flex-shrink-0">
                <div className="relative">
                    <UserAvatar
                        userId={user.id}
                        className="border-border h-40 w-40 border-2 shadow-lg lg:h-64 lg:w-64"
                        fallbackClassName="h-16 w-16 lg:h-24 lg:w-24"
                        alt={user.name}
                    />

                    {isLoading && (
                        <div className="bg-bg/80 absolute inset-0 flex items-center justify-center rounded-full">
                            <LoaderCircle className="h-8 w-8 animate-spin lg:h-12 lg:w-12" />
                        </div>
                    )}

                    {!isLoading && (
                        <div className="bg-bg/80 absolute inset-0 hidden items-center justify-center gap-2 rounded-full opacity-0 group-hover:opacity-100 lg:flex">
                            <UploadButton
                                disabled={isOffline}
                                appearance={{
                                    container: "h-12 w-12",
                                    button: "h-12 w-12 rounded-full bg-bg-muted hover:bg-bg-muted/80 p-0 flex items-center justify-center border border-border",
                                    allowedContent: "hidden",
                                }}
                                content={{
                                    button: <Upload className="h-5 w-5" />,
                                }}
                                endpoint="profileImageUploader"
                                onUploadBegin={() => setIsLoading(true)}
                                onUploadError={(error) => {
                                    toast.error(error.message);
                                    setIsLoading(false);
                                }}
                                onClientUploadComplete={(result) => {
                                    const assetId =
                                        result[0]?.serverData?.assetId;
                                    if (!assetId)
                                        toast.error("Failed to upload image");
                                    void authClient.updateUser({
                                        uploadedImageAssetId: assetId,
                                        useProviderImage: false,
                                    });
                                    void utils.user.getImage.invalidate();
                                    setIsLoading(false);
                                }}
                            />

                            {!user.useProviderImage && user.image && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-12 w-12 rounded-full p-0"
                                            disabled={isOffline}
                                            onMouseDown={() => {
                                                void authClient.updateUser({
                                                    useProviderImage: true,
                                                });
                                                void utils.user.getImage.invalidate();
                                            }}
                                        >
                                            <User2 className="h-5 w-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Use Google profile image
                                    </TooltipContent>
                                </Tooltip>
                            )}

                            <Button
                                variant="destructive"
                                size="sm"
                                className={cn(
                                    "h-12 w-12 rounded-full p-0",
                                    !hasImage && "hidden",
                                )}
                                disabled={isOffline}
                                onMouseDown={async () => {
                                    setIsLoading(true);
                                    if (user.uploadedImageAssetId)
                                        await deleteProfileImage.mutateAsync({
                                            id: user.uploadedImageAssetId,
                                        });
                                    await authClient.updateUser({
                                        uploadedImageAssetId: null,
                                        useProviderImage: false,
                                    });
                                    await utils.user.getImage.invalidate();
                                    setIsLoading(false);
                                }}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>

                {hasImage && (
                    <Badge
                        variant="secondary"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs"
                    >
                        {imageSource}
                    </Badge>
                )}
            </div>

            <div className="flex w-full items-center gap-2 lg:hidden">
                <UploadButton
                    disabled={isOffline}
                    appearance={{
                        container: "flex-1",
                        button: "w-full h-10 font-medium py-2 px-4 rounded-md text-sm bg-bg hover:bg-bg/70 border border-border",
                        allowedContent: "hidden",
                    }}
                    content={{
                        button: (
                            <div className="flex items-center justify-center gap-2">
                                <Upload className="h-4 w-4" />
                                Upload
                            </div>
                        ),
                    }}
                    endpoint="profileImageUploader"
                    onUploadBegin={() => setIsLoading(true)}
                    onUploadError={(error) => {
                        toast.error(error.message);
                        setIsLoading(false);
                    }}
                    onClientUploadComplete={(result) => {
                        const assetId = result[0]?.serverData?.assetId;
                        if (!assetId) toast.error("Failed to upload image");
                        void authClient.updateUser({
                            uploadedImageAssetId: assetId,
                            useProviderImage: false,
                        });
                        void utils.user.getImage.invalidate();
                        setIsLoading(false);
                    }}
                />

                {!user.useProviderImage && (
                    <Button
                        variant="outline"
                        className="h-10 px-4"
                        disabled={isOffline}
                        onMouseDown={() => {
                            void authClient.updateUser({
                                useProviderImage: true,
                            });
                            void utils.user.getImage.invalidate();
                        }}
                    >
                        Use Google
                    </Button>
                )}

                <Button
                    variant="destructive"
                    className={cn("h-10 px-4", !hasImage && "hidden")}
                    disabled={isOffline}
                    onMouseDown={async () => {
                        setIsLoading(true);
                        if (user.uploadedImageAssetId)
                            await deleteProfileImage.mutateAsync({
                                id: user.uploadedImageAssetId,
                            });
                        await authClient.updateUser({
                            uploadedImageAssetId: null,
                            useProviderImage: false,
                        });
                        await utils.user.getImage.invalidate();
                        setIsLoading(false);
                    }}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
