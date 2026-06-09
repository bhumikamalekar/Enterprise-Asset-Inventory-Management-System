import type { Request } from "./request.types";

export interface InventoryItem {
    itemId: number
    itemName: string
    total: number
    available: number
    allocated: number
}

export interface Allocation {
    allocationId: number
    requestId: number
    department: string
    itemName: string
    quantity: number
    issueDate: string
    returnDate: string
    status: string
}

export interface Procurement {
    procurementId: number
    itemName: string
    quantity: number
    status: string
}

export interface Invoice {
    invoiceId: number
    poId: number
    amount: number
    status: string
}

/* ---------------- CENTRAL MOCK DATABASE ---------------- */

export const mockDB = {

    requests: [] as Request[],

    inventory: [] as InventoryItem[],

    allocations: [] as Allocation[],

    procurements: [] as Procurement[],

    invoices: [] as Invoice[]

}