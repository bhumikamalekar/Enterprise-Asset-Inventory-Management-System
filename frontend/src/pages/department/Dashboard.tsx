import { useEffect, useState } from "react"
import { Card, Row, Col, Statistic, Table, Tag } from "antd"
import { Pie } from "@ant-design/plots"

export default function DepartmentDashboard() {

  const [requests, setRequests] = useState<any[]>([])
  const [allocations, setAllocations] = useState<any[]>([])
  const [issues, setIssues] = useState<any[]>([])

  const user = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {

    const allRequests = JSON.parse(localStorage.getItem("requests") || "[]")
    const allAllocations = JSON.parse(localStorage.getItem("allocations") || "[]")
    const allIssues = JSON.parse(localStorage.getItem("issues") || "[]")

    setRequests(allRequests.filter((r: any) => r.email === user.email))

    setAllocations(allAllocations.filter((a: any) => a.department === user.department))

    setIssues(allIssues || [])

  }, [])

  /* STATUS COUNTS */

  const pending = requests.filter(r => r.status === "Pending").length
  const approved = requests.filter(r => r.status === "Approved").length
  const procurement = requests.filter(r => r.status === "Procurement").length
  const allocated = requests.filter(r => r.status === "Allocated").length

  /* CHART DATA */

  const chartData = [

    { type: "Pending", value: pending },
    { type: "Approved", value: approved },
    { type: "Procurement", value: procurement },
    { type: "Allocated", value: allocated }

  ]

  const chartConfig = {

    data: chartData,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    height: 250

  }

  const recentRequests = [...requests].slice(-5)

  return (

    <Card title="Department Dashboard">

      {/* STATS */}

      <Row gutter={16} style={{ marginBottom: 20 }}>

        <Col span={6}>
          <Card>
            <Statistic title="Total Requests" value={requests.length} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="Pending Requests" value={pending} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="Allocated Items" value={allocated} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="Active Issues" value={issues.length} />
          </Card>
        </Col>

      </Row>

      <Row gutter={16}>

        {/* REQUEST STATUS CHART */}

        <Col span={12}>

          <Card title="Request Status Overview">

            <Pie {...chartConfig} />

          </Card>

        </Col>

        {/* RECENT REQUESTS */}

        <Col span={12}>

          <Card title="Recent Requests">

            <Table
              rowKey="requestId"
              pagination={false}
              dataSource={recentRequests}
              columns={[

                {
                  title: "Request ID",
                  dataIndex: "requestId"
                },

                {
                  title: "Priority",
                  dataIndex: "priority"
                },

                {
                  title: "Status",
                  render: (_: any, r: any) => {

                    switch (r.status) {

                      case "Pending":
                        return <Tag color="orange">Pending</Tag>

                      case "Approved":
                        return <Tag color="blue">Approved</Tag>

                      case "Procurement":
                        return <Tag color="purple">Procurement</Tag>

                      case "Allocated":
                        return <Tag color="green">Allocated</Tag>

                      case "Rejected":
                        return <Tag color="red">Rejected</Tag>

                      default:
                        return <Tag>Unknown</Tag>

                    }

                  }

                }

              ]}
            />

          </Card>

        </Col>

      </Row>

      <br />

      {/* ALLOCATED ITEMS */}

      <Card title="Department Allocations">

        <Table
          rowKey="allocationId"
          dataSource={allocations}
          columns={[

            {
              title: "Allocation ID",
              dataIndex: "allocationId"
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
            }

          ]}
        />

      </Card>

    </Card>

  )

}