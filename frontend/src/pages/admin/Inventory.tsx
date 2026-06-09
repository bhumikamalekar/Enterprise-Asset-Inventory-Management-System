import { useState, useEffect } from "react"
import { Card, Table, Tag, Input } from "antd"

export default function Inventory() {

  const [inventory, setInventory] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {

    const storedInventory = JSON.parse(localStorage.getItem("inventory") || "[]")

    setInventory(storedInventory)

  }, [])

  /* ---------------- SEARCH FILTER ---------------- */

  const filtered = inventory.filter((item: any) =>
    item.itemName.toLowerCase().includes(search.toLowerCase())
  )

  /* ---------------- TABLE COLUMNS ---------------- */

  const columns = [

    {
      title: "Item Name",
      dataIndex: "itemName"
    },

    {
      title: "Category",
      dataIndex: "category"
    },

    {
      title: "Total Quantity",
      dataIndex: "total"
    },

    {
      title: "Allocated",
      dataIndex: "allocated"
    },

    {
      title: "Available",
      render: (_: any, record: any) => {

        const available = record.total - record.allocated

        return available

      }
    },

    {
      title: "Status",
      render: (_: any, record: any) => {

        const available = record.total - record.allocated

        if (available <= record.minStock) {

          return <Tag color="red">Low Stock</Tag>

        }

        return <Tag color="green">Normal</Tag>

      }
    }

  ]

  return (

    <Card title="Inventory">

      <Input.Search
        placeholder="Search item"
        allowClear
        style={{ marginBottom: 16 }}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="itemName"
      />

    </Card>

  )

}