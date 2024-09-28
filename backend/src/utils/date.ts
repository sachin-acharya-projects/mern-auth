export function xYearsFromNow(x: number = 1) {
    const current_date = new Date()
    current_date.setFullYear(current_date.getFullYear() + x)
    return current_date
}

export function xDaysFromNow(x: number = 1) {
    const current_date = new Date()
    current_date.setDate(current_date.getDate() + x)
    return current_date
}

export function xHoursFromNow(x: number = 1) {
    const current_date = new Date()
    current_date.setHours(current_date.getHours() + x)
    return current_date
}

export function xMinutesFromNow(x: number = 1) {
    const current_date = new Date()
    current_date.setMinutes(current_date.getMinutes() + x)
    return current_date
}

export function xMinutesAgo(x: number = 1) {
    const current_date = new Date()
    current_date.setMinutes(current_date.getMinutes() - x)
    return current_date
}

export function xSecondsFromNow(x: number = 1) {
    const current_date = new Date()
    current_date.setSeconds(current_date.getSeconds() + x)
    return current_date
}

export const ONE_DAY_MILLS = 24 * 60 * 60 * 1000
