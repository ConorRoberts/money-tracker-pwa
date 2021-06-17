export default function getWeekStart(date: Date): Date {
    const day = date.getDate() - date.getDay(); 
    // + (date.getDay() === 0 ? -6 : 1);

    return new Date(date.getFullYear(), date.getMonth(), day);
}