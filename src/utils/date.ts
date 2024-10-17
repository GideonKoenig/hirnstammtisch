export function dateOnly(date: Date | undefined) {
    if (!date) return;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getUnique(dates: (Date | undefined)[]) {
    const uniqueDates: Date[] = [];

    dates.forEach((date) => {
        if (
            date &&
            !uniqueDates.some((uniqueDate) => uniqueDate.toISOString() === date.toISOString())
        )
            uniqueDates.push(date);
    });
    return uniqueDates;
}
