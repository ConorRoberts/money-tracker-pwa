
/**
 * @param  {string} date
 * @returns Date
 */
export default function dateConvert(date: string): Date {
    const arr = date.split("-").map((e: string) => +e);

    return new Date(arr[0], arr[1] - 1, arr[2]);
}