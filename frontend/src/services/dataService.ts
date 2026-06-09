import { mockDB } from "./mockData"
import type { Request } from "./request.types"

/* ---------------- REQUESTS ---------------- */

export const getRequests = () => {
    return mockDB.requests
}

export const addRequest = (request: Request) => {
    mockDB.requests.push(request)
}

export const updateRequest = (id: number, status: string) => {

    const req = mockDB.requests.find(r => r.requestId === id)

    if (req) req.status = status

}

/* ---------------- INVENTORY ---------------- */

export const getInventory = () => {
    return mockDB.inventory
}

/* ---------------- ALLOCATION ---------------- */

export const addAllocation = (allocation: any) => {
    mockDB.allocations.push(allocation)
}

export const getAllocations = () => {
    return mockDB.allocations
}

/* ---------------- PROCUREMENT ---------------- */

export const addProcurement = (proc: any) => {
    mockDB.procurements.push(proc)
}

export const getProcurements = () => {
    return mockDB.procurements
}

/* ---------------- INVOICE ---------------- */

export const addInvoice = (invoice: any) => {
    mockDB.invoices.push(invoice)
}

export const getInvoices = () => {
    return mockDB.invoices
}