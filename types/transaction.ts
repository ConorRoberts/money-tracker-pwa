export default interface Transaction {
    created_at: Date,
    type: string,
    subcategory: string,
    category: string,
    note: string,
    amount: number,
    taxable: boolean,
    id: string,
}