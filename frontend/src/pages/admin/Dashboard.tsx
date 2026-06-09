import { useEffect, useState } from "react"
import { Card, Row, Col, Statistic, Table, Button } from "antd"
import { useNavigate } from "react-router-dom"
import { Column } from "@ant-design/plots"

export default function Dashboard() {

  const navigate = useNavigate()

  const [requests, setRequests] = useState<any[]>([])
  const [tenders, setTenders] = useState<any[]>([])
  const [pos, setPOs] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])

  useEffect(() => {

    setRequests(JSON.parse(localStorage.getItem("requests") || "[]"))
    setTenders(JSON.parse(localStorage.getItem("tenders") || "[]"))
    setPOs(JSON.parse(localStorage.getItem("purchaseOrders") || "[]"))
    setInventory(JSON.parse(localStorage.getItem("inventory") || "[]"))
    setInvoices(JSON.parse(localStorage.getItem("invoices") || "[]"))

  }, [])

  /* REQUESTS */

  const pendingRequests = requests.filter(r => r.status === "Pending")

  /* LOW STOCK */

  const lowStock = inventory.filter(i => {
    const available = (i.total || 0) - (i.allocated || 0)
    return available < i.minStock
  })

  /* PAYMENTS */

  const pendingPayments = invoices.filter(i => i.status === "Pending")

  const outstanding = invoices.reduce(
    (sum, i) => sum + (i.remainingAmount || 0), 0
  )

  /* CATEGORY TOTAL QUANTITY */

  const categoryTotals: any = {}

  inventory.forEach((i: any) => {

    const category = i.category || i.Category || "Other"

    const qty = Number(i.total || 0)

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0
    }

    categoryTotals[category] += qty

  })

  const categoryStats = Object.entries(categoryTotals).map(([key, value]) => ({
    category: key,
    total: value
  }))

  /* PROCUREMENT GRAPH */

  const procurementData = [

    { type: "Tenders", value: tenders.length },

    { type: "Purchase Orders", value: pos.length },

    {
      type: "Received Orders",
      value: pos.filter(p => p.status === "Received").length
    }

  ]

  const graphConfig = {

    data: procurementData,

    xField: "type",

    yField: "value",

    height: 220,

    color: "#1677ff",

    label: { position: "middle" }

  }

  return (

    <Card title="Admin Dashboard">

      {/* STATISTICS */}

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>

        {categoryStats.map((c: any) => (
          <Col span={4} key={c.category}>
            <Card
              size="small"
              style={{
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}
            >
              <Statistic
                title={c.category}
                value={c.total}
                valueStyle={{ color: "#1677ff" }}
              />
            </Card>
          </Col>
        ))}

        <Col span={4}>
          <Card size="small" style={{ borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <Statistic
              title="Low Stock"
              value={lowStock.length}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>

        <Col span={4}>
          <Card size="small" style={{ borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <Statistic
              title="Pending Requests"
              value={pendingRequests.length}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>

        <Col span={4}>
          <Card size="small" style={{ borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <Statistic
              title="Active Tenders"
              value={tenders.length}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>

        <Col span={4}>
          <Card size="small" style={{ borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <Statistic
              title="Pending Payments"
              value={pendingPayments.length}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>

        <Col span={4}>
          <Card size="small" style={{ borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <Statistic
              title="Outstanding ₹"
              value={outstanding}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>

      </Row>

      {/* TABLE SECTION */}

      <Row gutter={16}>

        {/* LOW STOCK TABLE */}

        <Col span={12}>

          <Card
            title="Low Stock Alert"
            extra={
              <Button
                type="link"
                onClick={() => navigate("/admin/inventory")}
              >
                View All
              </Button>
            }
          >

            <Table
              dataSource={lowStock}
              rowKey="itemId"
              pagination={false}
              columns={[

                { title: "Item", dataIndex: "itemName" },

                {
                  title: "Available",
                  render: (_: any, r: any) => r.total - r.allocated
                },

                { title: "Min Stock", dataIndex: "minStock" }

              ]}

              scroll={{ y: 200 }}

            />

          </Card>

        </Col>

        {/* PENDING REQUEST TABLE */}

        <Col span={12}>

          <Card
            title="Pending Requests"
            extra={
              <Button
                type="link"
                onClick={() => navigate("/admin/request-management")}
              >
                View All
              </Button>
            }
          >

            <Table
              dataSource={pendingRequests}
              rowKey="requestId"
              pagination={false}
              columns={[

                { title: "Request ID", dataIndex: "requestId" },

                { title: "Department", dataIndex: "department" },

                { title: "Priority", dataIndex: "priority" }

              ]}

              scroll={{ y: 200 }}

            />

          </Card>

        </Col>

      </Row>

      <br />

      {/* GRAPH + FINANCE */}

      <Row gutter={16}>

        {/* PROCUREMENT GRAPH */}

        <Col span={12}>

          <Card
            title="Procurement Analytics"
            extra={
              <Button
                type="link"
                onClick={() => navigate("/admin/procurement")}
              >
                View Details
              </Button>
            }
          >

            <Column {...graphConfig} />

          </Card>

        </Col>

        {/* FINANCE OVERVIEW */}

        <Col span={12}>

          <Card
            title="Finance Overview"
            extra={
              <Button
                type="link"
                onClick={() => navigate("/admin/finance")}
              >
                View All
              </Button>
            }
            style={{ height: 260 }}
          >

            <Table
              pagination={false}
              dataSource={[
                {
                  key: "1",
                  metric: "Total Invoices",
                  value: invoices.length
                },
                {
                  key: "2",
                  metric: "Pending Payments",
                  value: pendingPayments.length
                },
                {
                  key: "3",
                  metric: "Outstanding Amount",
                  value: outstanding
                }
              ]}
              columns={[
                { title: "Metric", dataIndex: "metric" },
                { title: "Value", dataIndex: "value" }
              ]}
            />

          </Card>

        </Col>

      </Row>

    </Card>

  )

}