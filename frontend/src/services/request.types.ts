export interface RequestItem {
    itemName: string
    category: string
    quantity: number

    brandPreference?: string
    specifications?: string
}

export interface Request {
    priority: ReactNode
    availability: string

    requestId: number

    department: string

    requestedBy: string
    email: string
    phone: string
    address: string

    createdDate: string
    requiredDate: string

    status: string

    itemsCount: number
    totalQuantity: number

    items: RequestItem[]
}