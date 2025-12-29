// Date/Time utilities

/**
 * Format a date to Asia/Bangkok timezone in 24-hour format
 */
export function formatDateTime(date: Date | number | string): string {
    const d = new Date(date);
    return d.toLocaleString('en-GB', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

/**
 * Format a date to Asia/Bangkok timezone (date only)
 */
export function formatDate(date: Date | number | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

/**
 * Format a date to Asia/Bangkok timezone (time only, 24-hour)
 */
export function formatTime(date: Date | number | string): string {
    const d = new Date(date);
    return d.toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Bangkok',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}
