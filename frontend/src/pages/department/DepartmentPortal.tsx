import { useEffect, useState } from "react"
import {
  Card,
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  message
} from "antd"

export default function DepartmentRequests() {

  const [requests, setRequests] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  const user = JSON.parse(localStorage.getItem("user") || "{}")

  /* LOAD REQUESTS */

  useEffect(() => {

    const stored = JSON.parse(localStorage.getItem("requests") || "[]")

    const filtered = stored.filter((r: any) => r.email === user.email)

    setRequests(filtered)

  }, [])

  /* CREATE REQUEST */

  const createRequest = (values: any) => {

    const newRequest = {

      requestId: Date.now(),

      department: user.department,

      requestedBy: user.email,

      email: user.email,

      phone: user.phone,

      address: user.address,

      requiredDate: values.requiredDate?.format("YYYY-MM-DD"),

      priority: values.priority,

      items: values.items,

      status: "Pending"

    }

    const stored = JSON.parse(localStorage.getItem("requests") || "[]")

    const updated = [...stored, newRequest]

    localStorage.setItem("requests", JSON.stringify(updated))

    const filtered = updated.filter((r: any) => r.email === user.email)

    setRequests(filtered)

    form.resetFields()

    setOpen(false)

    message.success("Request Submitted")

  }

  /* TABLE COLUMNS */

  const columns = [

    {
      title: "Request ID",
      dataIndex: "requestId"
    },

    {
      title: "Required Date",
      dataIndex: "requiredDate"
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

  ]

  return (

    <Card title="Department Requests">

      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => setOpen(true)}
      >
        Raise Request
      </Button>

      <Table
        columns={columns}
        dataSource={requests}
        rowKey="requestId"
        expandable={{

          expandedRowRender: (record: any) => (

            <Table
              pagination={false}
              rowKey="itemName"
              dataSource={record.items}
              columns={[

                {
                  title: "Item Name",
                  dataIndex: "itemName"
                },

                {
                  title: "Category",
                  dataIndex: "category"
                },

                {
                  title: "Quantity",
                  dataIndex: "quantity"
                },

                {
                  title: "Specifications",
                  dataIndex: "specifications"
                }

              ]}
            />

          )

        }}
      />

      {/* REQUEST MODAL */}

      <Modal
        title="Raise New Request"
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
      >

        <Form
          layout="vertical"
          form={form}
          onFinish={createRequest}
        >

          {/* AUTO FILLED USER DETAILS */}

          <Form.Item label="Department">
            <Input value={user.department} disabled />
          </Form.Item>

          <Form.Item label="Email">
            <Input value={user.email} disabled />
          </Form.Item>

          <Form.Item label="Contact Number">
            <Input value={user.phone} disabled />
          </Form.Item>

          <Form.Item label="Address">
            <Input.TextArea value={user.address} disabled />
          </Form.Item>

          {/* ITEMS */}

          <Form.List name="items" initialValue={[{}]}>

            {(fields, { add }) => (

              <>

                {fields.map(({ key, name }) => (

                  <Space key={key} style={{ display: "flex", marginBottom: 10 }}>

                    <Form.Item
                      name={[name, "itemName"]}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Item Name" />
                    </Form.Item>

                    <Form.Item
                      name={[name, "category"]}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Category" />
                    </Form.Item>

                    <Form.Item
                      name={[name, "quantity"]}
                      rules={[{ required: true }]}
                    >
                      <Input type="number" placeholder="Quantity" />
                    </Form.Item>

                    <Form.Item name={[name, "specifications"]}>
                      <Input placeholder="Specifications" />
                    </Form.Item>

                  </Space>

                ))}

                <Button onClick={() => add()}>
                  Add Item
                </Button>

              </>

            )}

          </Form.List>

          <Form.Item
            name="requiredDate"
            label="Required Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" }
              ]}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Submit Request
          </Button>

        </Form>

      </Modal>

    </Card>

  )

}