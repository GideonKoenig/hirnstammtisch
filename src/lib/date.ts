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

export function formatWeekDistance(date: Date) {
    const weekDistance = getWeekDistance(date);
    if (weekDistance === 0) return "This week";
    if (weekDistance === 1) return "Next week";
    if (weekDistance === -1) return "Last week";
    if (weekDistance < 0) return `${Math.abs(weekDistance)} weeks ago`;
    return `In ${weekDistance} weeks`;
}
