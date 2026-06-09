import { useState, useEffect } from "react"
import {
  Card,
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Tag,
  message
} from "antd"

export default function Finance() {

  const [pos, setPOs] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])

  const [openInvoice, setOpenInvoice] = useState(false)
  const [openPayment, setOpenPayment] = useState(false)

  const [selectedPO, setSelectedPO] = useState<any>(null)

  const [form] = Form.useForm()
  const [paymentForm] = Form.useForm()

  useEffect(() => {

    const allPO = JSON.parse(localStorage.getItem("purchaseOrders") || "[]")

    const receivedPO = allPO.filter((p: any) => p.status === "Received")

    setPOs(receivedPO)

    setInvoices(JSON.parse(localStorage.getItem("invoices") || "[]"))

    setPayments(JSON.parse(localStorage.getItem("payments") || "[]"))

  }, [])

  const handlePOChange = (poId: string) => {

    const po = pos.find(p => p.poId === poId)

    if (!po) return

    setSelectedPO(po)

    form.setFieldsValue({
      supplier: po.supplier,
      amount: po.totalPrice
    })

  }

  const createInvoice = (values: any) => {

    if (!selectedPO) {
      message.error("Select Purchase Order")
      return
    }

    const invoice = {

      invoiceId: "INV-" + Date.now(),

      poId: values.poId,

      supplier: values.supplier,

      invoiceNumber: values.invoiceNumber,

      invoiceDate: values.invoiceDate.format("YYYY-MM-DD"),

      items: selectedPO.items,

      totalAmount: Number(values.amount),

      paidAmount: 0,

      remainingAmount: Number(values.amount),

      status: "Pending"

    }

    const updated = [...invoices, invoice]

    setInvoices(updated)

    localStorage.setItem("invoices", JSON.stringify(updated))

    form.resetFields()

    setOpenInvoice(false)

    message.success("Invoice Created")

  }

  const addPayment = (values: any) => {

    const invoice = invoices.find(i => i.invoiceId === values.invoiceId)

    if (!invoice) return

    const amount = Number(values.amount)

    if (amount > invoice.remainingAmount) {

      message.error("Payment exceeds remaining amount")

      return

    }

    const payment = {

      paymentId: "PAY-" + Date.now(),

      invoiceId: values.invoiceId,

      amount,

      mode: values.mode,

      date: values.date.format("YYYY-MM-DD")

    }

    const updatedPayments = [...payments, payment]

    setPayments(updatedPayments)

    localStorage.setItem("payments", JSON.stringify(updatedPayments))

    const updatedInvoices = invoices.map(i => {

      if (i.invoiceId === invoice.invoiceId) {

        const paid = i.paidAmount + amount

        const remaining = i.totalAmount - paid

        return {

          ...i,

          paidAmount: paid,

          remainingAmount: remaining,

          status: remaining === 0 ? "Paid" : "Pending"

        }

      }

      return i

    })

    setInvoices(updatedInvoices)

    localStorage.setItem("invoices", JSON.stringify(updatedInvoices))

    paymentForm.resetFields()

    setOpenPayment(false)

    message.success("Payment Recorded")

  }

  const invoiceColumns = [

    { title: "Invoice ID", dataIndex: "invoiceId" },

    { title: "PO ID", dataIndex: "poId" },

    { title: "Supplier", dataIndex: "supplier" },

    { title: "Total Amount", dataIndex: "totalAmount" },

    { title: "Paid Amount", dataIndex: "paidAmount" },

    { title: "Remaining Amount", dataIndex: "remainingAmount" },

    {
      title: "Status",
      render: (_: any, r: any) =>
        r.status === "Paid"
          ? <Tag color="green">Paid</Tag>
          : <Tag color="orange">Pending</Tag>
    }

  ]

  const paymentColumns = [

    { title: "Payment ID", dataIndex: "paymentId" },

    { title: "Invoice ID", dataIndex: "invoiceId" },

    { title: "Amount", dataIndex: "amount" },

    { title: "Mode", dataIndex: "mode" },

    { title: "Date", dataIndex: "date" }

  ]

  return (

    <Card title="Finance Module">

      <Tabs>

        {/* Invoice Entry */}

        <Tabs.TabPane tab="Invoice Entry" key="1">

          <Button
            type="primary"
            onClick={() => setOpenInvoice(true)}
            style={{ marginBottom: 16 }}
          >
            Create Invoice
          </Button>

          <Table
            columns={invoiceColumns}
            dataSource={invoices}
            rowKey="invoiceId"
            expandable={{
              expandedRowRender: (record: any) => (

                <Table
                  columns={[
                    { title: "Category", dataIndex: "category" },
                    { title: "Item", dataIndex: "item" },
                    { title: "Description", dataIndex: "description" },
                    { title: "Quantity", dataIndex: "quantity" }
                  ]}
                  dataSource={record.items}
                  pagination={false}
                  rowKey="item"
                />

              )
            }}
          />

        </Tabs.TabPane>

        {/* Payment Processing */}

        <Tabs.TabPane tab="Payment Processing" key="2">

          <Button
            type="primary"
            onClick={() => setOpenPayment(true)}
            style={{ marginBottom: 16 }}
          >
            Add Payment
          </Button>

          <Table
            columns={paymentColumns}
            dataSource={payments}
            rowKey="paymentId"
          />

        </Tabs.TabPane>

      </Tabs>

      {/* Invoice Modal */}

      <Modal
        title="Create Invoice"
        open={openInvoice}
        footer={null}
        onCancel={() => setOpenInvoice(false)}
      >

        <Form layout="vertical" form={form} onFinish={createInvoice}>

          <Form.Item
            name="poId"
            label="Purchase Order ID"
            rules={[{ required: true }]}
          >

            <Select
              options={pos.map(p => ({ value: p.poId, label: p.poId }))}
              onChange={handlePOChange}
            />

          </Form.Item>

          <Form.Item name="supplier" label="Supplier">

            <Input disabled />

          </Form.Item>

          <Form.Item
            name="invoiceNumber"
            label="Invoice Number"
            rules={[{ required: true }]}
          >

            <Input />

          </Form.Item>

          <Form.Item
            name="invoiceDate"
            label="Invoice Date"
            rules={[{ required: true }]}
          >

            <DatePicker style={{ width: "100%" }} />

          </Form.Item>

          <Form.Item
            name="amount"
            label="Invoice Amount"
            rules={[{ required: true }]}
          >

            <Input type="number" />

          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Save Invoice
          </Button>

        </Form>

      </Modal>

      {/* Payment Modal */}

      <Modal
        title="Add Payment"
        open={openPayment}
        footer={null}
        onCancel={() => setOpenPayment(false)}
      >

        <Form layout="vertical" form={paymentForm} onFinish={addPayment}>

          <Form.Item
            name="invoiceId"
            label="Invoice ID"
            rules={[{ required: true }]}
          >

            <Select
              options={invoices.map(i => ({
                value: i.invoiceId,
                label: i.invoiceId
              }))}
            />

          </Form.Item>

          <Form.Item
            name="amount"
            label="Payment Amount"
            rules={[{ required: true }]}
          >

            <Input type="number" />

          </Form.Item>

          <Form.Item
            name="mode"
            label="Payment Mode"
            rules={[{ required: true }]}
          >

            <Select
              options={[
                { value: "Cash", label: "Cash" },
                { value: "Bank", label: "Bank" },
                { value: "Online", label: "Online" }
              ]}
            />

          </Form.Item>

          <Form.Item
            name="date"
            label="Payment Date"
            rules={[{ required: true }]}
          >

            <DatePicker style={{ width: "100%" }} />

          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Record Payment
          </Button>

        </Form>

      </Modal>

    </Card>

  )

}