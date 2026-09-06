import type { ClientAsset } from "@/lib/types";

const PLAYER_URL = "https://video-player.gko.gg/";

export function getAssetUrl(asset: ClientAsset) {
    const { value, redacted } = asset.url;
    if (redacted || !value) return undefined;
    if (asset.type !== "audio" && asset.type !== "video") return value;

    return `${PLAYER_URL}#${new URLSearchParams({ src: value })}`;
}
