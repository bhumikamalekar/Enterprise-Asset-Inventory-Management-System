import { useEffect, useState } from "react"
import {
    Card,
    Table,
    Tag,
    Input,
    Space
} from "antd"

export default function DepartmentAllocation() {

    const [allocations, setAllocations] = useState<any[]>([])
    const [search, setSearch] = useState("")

    /* LOAD ALLOCATIONS */

    useEffect(() => {

        const stored = JSON.parse(localStorage.getItem("allocations") || "[]")

        setAllocations(stored)

    }, [])

    /* SEARCH FILTER */

    const filtered = allocations.filter((a: any) => {

        return (
            (a.itemName || "").toLowerCase().includes(search.toLowerCase()) ||
            (a.department || "").toLowerCase().includes(search.toLowerCase()) ||
            String(a.requestId || "").includes(search)
        )

    })

    /* TABLE COLUMNS */

    const columns = [

        {
            title: "Allocation ID",
            dataIndex: "allocationId"
        },

        {
            title: "Request ID",
            dataIndex: "requestId"
        },

        {
            title: "Item",
            dataIndex: "itemName"
        },

        {
            title: "Quantity",
            dataIndex: "quantity"
        },

        {
            title: "Issue Date",
            dataIndex: "issueDate"
        },

        {
            title: "Barcode",
            dataIndex: "barcode"
        },

        {
            title: "Status",
            render: () => <Tag color="green">Allocated</Tag>
        }

    ]

    return (

        <Card title="Department Allocation">

            {/* SEARCH */}

            <Space style={{ marginBottom: 20 }}>

                <Input.Search
                    placeholder="Search item / request"
                    allowClear
                    style={{ width: 250 }}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </Space>

            {/* ALLOCATION TABLE */}

            <Table
                columns={columns}
                dataSource={filtered}
                rowKey="allocationId"
                expandable={{
                    expandedRowRender: (record: any) => (

                        <Table
                            pagination={false}
                            rowKey="itemName"
                            dataSource={[
                                {
                                    category: record.category,
                                    itemName: record.itemName,
                                    quantity: record.quantity
                                }
                            ]}
                            columns={[

                                {
                                    title: "Category",
                                    dataIndex: "category"
                                },

                                {
                                    title: "Item Name",
                                    dataIndex: "itemName"
                                },

                                {
                                    title: "Quantity Allocated",
                                    dataIndex: "quantity"
                                }

                            ]}
                        />

                    )
                }}
            />

        </Card>

    )

}