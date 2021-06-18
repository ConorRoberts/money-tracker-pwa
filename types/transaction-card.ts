export default interface TransactionCardProps {
    id: string,
    amount: number,
    note?: string,
    created_at: Date,
    type: string,
    category: string
}