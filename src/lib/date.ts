export function dateOnly(date: Date | undefined) {
    if (!date) return;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function compareDate(a: Date | undefined, b: Date | undefined) {
    if (!a || !b) return false;
    return a.toISOString() === b.toISOString();
}

export function getUnique(dates: (Date | undefined)[]) {
    const uniqueDates: Date[] = [];

    dates.forEach((date) => {
        if (
            date &&
            !uniqueDates.some(
                (uniqueDate) => uniqueDate.toISOString() === date.toISOString(),
            )
        )
            uniqueDates.push(date);
    });
    return uniqueDates;
}

export function getWeekDistance(eventDate: Date) {
    const date = new Date(eventDate);
    const today = new Date();

    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    date.setDate(date.getDate() - date.getDay());
    today.setDate(today.getDate() - today.getDay());

    const diffTime = date.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return Math.round(diffDays / 7);
}

export function formatWeekDistance(date?: Date | null) {
    if (!date) return "";
    const weekDistance = getWeekDistance(date);
    if (weekDistance === 0) return "This week";
    if (weekDistance === 1) return "Next week";
    if (weekDistance === -1) return "Last week";
    if (weekDistance < 0) return `${Math.abs(weekDistance)} weeks ago`;
    return `In ${weekDistance} weeks`;
}

export function formatTimestamp(date?: Date | null) {
    if (!date) return "No date";
    return `${formatDate(date)} ${formatTime(date)}`;
}

export const formatDate = (date?: Date | null, short?: boolean) => {
    if (!date) return "No date";

    if (short) {
        return new Intl.DateTimeFormat("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date(date));
    }
    return new Intl.DateTimeFormat("de-DE", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(date));
};

export const formatTime = (date?: Date | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
};
