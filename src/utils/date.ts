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

export function getWeekDistance(date: Date) {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
}

export function formatWeekDistance(date: Date) {
    const weekDistance = getWeekDistance(date);
    if (weekDistance === 0) return "This week";
    if (weekDistance === 1) return "Next week";
    if (weekDistance === -1) return "Last week";
    if (weekDistance < 0) return `${Math.abs(weekDistance)} weeks ago`;
    return `In ${weekDistance} weeks`;
}
