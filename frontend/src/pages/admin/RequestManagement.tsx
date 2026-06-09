import { useState, useEffect } from "react"
import type { Request } from "../../services/request.types"

import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Tabs,
  Modal,
  Input,
  Tooltip,
  message
} from "antd"

export default function RequestManagement() {

  const [requests, setRequests] = useState<Request[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [selected, setSelected] = useState<Request | null>(null)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {

    const storedRequests = JSON.parse(localStorage.getItem("requests") || "[]")
    const storedInventory = JSON.parse(localStorage.getItem("inventory") || "[]")

    setRequests(storedRequests)
    setInventory(storedInventory)

  }, [])

  /* ---------- STOCK CHECK ---------- */

  const checkStock = (request: Request) => {

    for (const item of request.items) {

      const inv = inventory.find((i: any) => i.itemName === item.itemName)

      if (!inv) return false

      const available = inv.total - inv.allocated

      if (available < item.quantity) return false

    }

    return true

  }

  /* ---------- APPROVE ---------- */

  const approve = (request: Request) => {

    const updated = requests.map(r => {

      if (r.requestId === request.requestId) {

        return { ...r, status: "Approved" }

      }

      return r

    })

    setRequests(updated)

    localStorage.setItem("requests", JSON.stringify(updated))

  }

  /* ---------- REJECT ---------- */

  const reject = (id: number) => {

    const updated = requests.filter(r => r.requestId !== id)

    setRequests(updated)

    localStorage.setItem("requests", JSON.stringify(updated))

  }

  /* ---------- DELETE REQUEST ---------- */

  const deleteRequest = (id: number) => {

    const updated = requests.filter(r => r.requestId !== id)

    setRequests(updated)

    localStorage.setItem("requests", JSON.stringify(updated))

  }

  /* ---------- MOVE TO ALLOCATION ---------- */

  const moveToAllocation = (request: Request) => {

    let allocations = JSON.parse(localStorage.getItem("allocations") || "[]")

    let updatedInventory = [...inventory]

    request.items.forEach((item: any) => {

      const inv = updatedInventory.find((i: any) => i.itemName === item.itemName)

      if (!inv) return

      const available = inv.total - inv.allocated

      if (available < item.quantity) {
        message.error("Insufficient stock")
        return
      }

      inv.allocated += item.quantity

      allocations.push({

        allocationId: "ALC-" + Date.now(),

        requestId: request.requestId,

        department: request.department,

        itemName: item.itemName,

        quantity: item.quantity,

        issueDate: new Date().toLocaleDateString(),

        returnDate: "",

        barcode:
          item.itemName.substring(0, 3).toUpperCase() +
          "-" +
          Date.now(),

        status: "Issued"

      })

    })

    localStorage.setItem("allocations", JSON.stringify(allocations))

    localStorage.setItem("inventory", JSON.stringify(updatedInventory))

    const updatedRequests = requests.map(r => {

      if (r.requestId === request.requestId) {

        return { ...r, status: "Allocated" }

      }

      return r

    })

    setRequests(updatedRequests)

    localStorage.setItem("requests", JSON.stringify(updatedRequests))

    setInventory(updatedInventory)

    message.success("Items Allocated Successfully")

  }

  /* ---------- MOVE TO PROCUREMENT ---------- */

  const moveToProcurement = (request: Request) => {

    const updated = requests.map(r => {

      if (r.requestId === request.requestId) {

        return { ...r, status: "Procurement" }

      }

      return r

    })

    setRequests(updated)

    localStorage.setItem("requests", JSON.stringify(updated))

    message.info("Moved to Procurement")

  }

  /* ---------- SEARCH ---------- */

  const filtered = requests.filter(r =>
    r.department.toLowerCase().includes(search.toLowerCase())
  )

  const pending = filtered.filter(r => r.status === "Pending")

  const approved = filtered.filter(r => r.status === "Approved")

  /* ---------- PENDING TABLE ---------- */

  const pendingColumns = [

    { title: "Request ID", dataIndex: "requestId" },

    { title: "Department", dataIndex: "department" },

    { title: "Requested By", dataIndex: "requestedBy" },

    { title: "Required Date", dataIndex: "requiredDate" },

    { title: "Priority", dataIndex: "priority" },

    {
      title: "Status",
      render: () => <Tag color="orange">Pending</Tag>
    },

    {
      title: "Action",
      render: (_: any, record: Request) => (
        <Space>

          <Tooltip title="Approve request">

            <Button
              type="primary"
              size="small"
              onClick={() => approve(record)}
            >
              Approve
            </Button>

          </Tooltip>

          <Tooltip title="Reject request">

            <Button
              danger
              size="small"
              onClick={() => reject(record.requestId)}
            >
              Reject
            </Button>

          </Tooltip>

        </Space>
      )
    },

    {
      title: "Details",
      render: (_: any, record: Request) => (
        <Button
          size="small"
          onClick={() => {
            setSelected(record)
            setOpen(true)
          }}
        >
          View
        </Button>
      )
    }

  ]

  /* ---------- APPROVED TABLE ---------- */

  const approvedColumns = [

    { title: "Request ID", dataIndex: "requestId" },

    { title: "Department", dataIndex: "department" },

    { title: "Requested By", dataIndex: "requestedBy" },

    { title: "Required Date", dataIndex: "requiredDate" },

    { title: "Priority", dataIndex: "priority" },

    {
      title: "Stock Status",
      render: (_: any, record: Request) => {

        const available = checkStock(record)

        return available
          ? <Tag color="green">Available</Tag>
          : <Tag color="red">Not Available</Tag>

      }
    },

    {
      title: "Next Action",
      render: (_: any, record: Request) => {

        const available = checkStock(record)

        return available ?

          <Button
            type="primary"
            size="small"
            onClick={() => moveToAllocation(record)}
          >
            Allocate
          </Button>

          :

          <Button
            type="primary"
            size="small"
            onClick={() => moveToProcurement(record)}
          >
            Move to Procurement
          </Button>

      }
    },

    {
      title: "Details",
      render: (_: any, record: Request) => (
        <Button
          size="small"
          onClick={() => {
            setSelected(record)
            setOpen(true)
          }}
        >
          View
        </Button>
      )
    }

  ]

  return (

    <Card title="Request Management">

      <Input.Search
        placeholder="Search department"
        allowClear
        style={{ marginBottom: 16 }}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Tabs defaultActiveKey="1">

        <Tabs.TabPane tab={`Pending (${pending.length})`} key="1">

          <Table
            columns={pendingColumns}
            dataSource={pending}
            rowKey="requestId"
            onRow={(record) => ({
              onContextMenu: (event) => {
                event.preventDefault()

                if (window.confirm("Delete this request?")) {

                  deleteRequest(record.requestId)

                }
              }
            })}
          />

        </Tabs.TabPane>

        <Tabs.TabPane tab={`Approved (${approved.length})`} key="2">

          <Table
            columns={approvedColumns}
            dataSource={approved}
            rowKey="requestId"
          />

        </Tabs.TabPane>

      </Tabs>

      <Modal
        open={open}
        title="Request Details"
        footer={null}
        width={900}
        onCancel={() => setOpen(false)}
      >

        {selected && (

          <>

            <h3>Requester Information</h3>

            <p><b>Department:</b> {selected.department}</p>
            <p><b>Requested By:</b> {selected.requestedBy}</p>
            <p><b>Email:</b> {selected.email}</p>
            <p><b>Phone:</b> {selected.phone}</p>
            <p><b>Address:</b> {selected.address}</p>
            <p><b>Required Date:</b> {selected.requiredDate}</p>
            <p><b>Priority:</b> {selected.priority}</p>

            <h3 style={{ marginTop: 20 }}>Item Details</h3>

            <Table
              pagination={false}
              dataSource={selected.items}
              rowKey="itemName"
              columns={[
                { title: "Item Name", dataIndex: "itemName" },
                { title: "Category", dataIndex: "category" },
                { title: "Quantity", dataIndex: "quantity" },
                { title: "Unit", dataIndex: "unit" },
                { title: "Preferred Brand", dataIndex: "brandPreference" },
                { title: "Specifications", dataIndex: "specifications" }
              ]}
            />

          </>

        )}

      </Modal>

    </Card>

  )

}