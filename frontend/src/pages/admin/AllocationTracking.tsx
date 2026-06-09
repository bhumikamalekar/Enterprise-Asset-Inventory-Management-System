import { useEffect, useState } from "react"
import { Card, Table, Tag, Input, Select, Space } from "antd"

const { Option } = Select

export default function AllocationTracking() {

  const [allocations, setAllocations] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {

    const stored = JSON.parse(localStorage.getItem("allocations") || "[]")

    setAllocations(stored)

  }, [])

  /* ---------------- SEARCH + FILTER ---------------- */

  const filtered = allocations.filter((a: any) => {

    const matchSearch =
      (a.department || "").toLowerCase().includes(search.toLowerCase()) ||
      String(a.requestId || "").includes(search) ||
      String(a.allocationId || "").includes(search)

    const matchCategory =
      categoryFilter === "All" ||
      (a.category && a.category === categoryFilter)

    return matchSearch && matchCategory

  })

  /* ---------------- SUMMARY ---------------- */

  const totalAllocations = allocations.length

  const totalItems = allocations.reduce((sum, a) => sum + a.quantity, 0)

  /* ---------------- MAIN TABLE ---------------- */

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
      title: "Department",
      dataIndex: "department"
    },

    {
      title: "Item Name",
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

    <Card title="Allocation & Tracking">

      {/* SUMMARY */}

      <Space style={{ marginBottom: 20 }}>

        <Tag color="blue">
          Total Allocations: {totalAllocations}
        </Tag>

        <Tag color="green">
          Total Quantity Allocated: {totalItems}
        </Tag>

      </Space>

      {/* SEARCH + FILTER */}

      <Space style={{ marginBottom: 20 }}>

        <Input.Search
          placeholder="Search Allocation / Department / Request"
          allowClear
          style={{ width: 260 }}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          defaultValue="All"
          style={{ width: 180 }}
          onChange={(v) => setCategoryFilter(v)}
        >

          <Option value="All">All Categories</Option>
          <Option value="Electronics">Electronics</Option>
          <Option value="Furniture">Furniture</Option>
          <Option value="Stationery">Stationery</Option>

        </Select>

      </Space>

      {/* MAIN TABLE */}

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="allocationId"
      />

    </Card>

  )

}