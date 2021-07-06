/**
 * Filters everything aside from numbers and periods from a string
 * @param str 
 * @returns string containing only numbers and periods
 */
export default function numberFilter(str: string) {
    return str.split("").filter((e: any) => (!isNaN(e) || e === ".") && e !== " ").join("");
}