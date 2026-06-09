import { useState, useEffect } from "react"
import {
  Card,
  Tabs,
  Table,
  Button,
  Modal,
  Input,
  DatePicker,
  Space,
  Row,
  Col,
  Tag,
  message
} from "antd"

export default function Procurement() {

  const [requests, setRequests] = useState<any[]>([])
  const [summary, setSummary] = useState<any[]>([])
  const [tenders, setTenders] = useState<any[]>([])
  const [quotes, setQuotes] = useState<any[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])

  const [closingDate, setClosingDate] = useState<any>(null)
  const [deliveryDate, setDeliveryDate] = useState<any>(null)

  const [tenderModal, setTenderModal] = useState(false)
  const [quoteModal, setQuoteModal] = useState(false)

  const [selectedTender, setSelectedTender] = useState<any>(null)

  const [manualItems, setManualItems] = useState([
    { category: "", item: "", description: "", quantity: "" }
  ])

  const [supplier, setSupplier] = useState("")
  const [price, setPrice] = useState("")
  const [delivery, setDelivery] = useState("")
  const [warranty, setWarranty] = useState("")
  const [contact, setContact] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")

  useEffect(() => {

    const req = JSON.parse(localStorage.getItem("requests") || "[]")
    const procurementReq = req.filter((r: any) => r.status === "Procurement")

    setRequests(procurementReq)

    generateSummary(procurementReq)

    setTenders(JSON.parse(localStorage.getItem("tenders") || "[]"))
    setQuotes(JSON.parse(localStorage.getItem("quotes") || "[]"))
    setPurchaseOrders(JSON.parse(localStorage.getItem("purchaseOrders") || "[]"))

  }, [])

  const generateSummary = (data: any[]) => {

    const map: any = {}

    data.forEach((r) => {

      r.items.forEach((i: any) => {

        if (!map[i.itemName]) {

          map[i.itemName] = {
            category: i.category,
            item: i.itemName,
            description: i.specifications || "",
            quantity: 0
          }

        }

        map[i.itemName].quantity += i.quantity

      })

    })

    setSummary(Object.values(map))

  }

  const generateTenderId = () => {
    return "TND-" + (tenders.length + 1)
  }

  const addItem = () => {

    setManualItems([
      ...manualItems,
      { category: "", item: "", description: "", quantity: "" }
    ])

  }

  const updateItem = (index: number, field: string, value: string) => {

    const updated = [...manualItems]
    updated[index][field] = value
    setManualItems(updated)

  }

  const createManualTender = () => {

    if (!closingDate || !deliveryDate) {
      message.error("Please select closing and delivery date")
      return
    }

    const tender = {
      tenderId: generateTenderId(),
      items: manualItems,
      totalItems: manualItems.length,
      closingDate: closingDate.format("YYYY-MM-DD"),
      deliveryDate: deliveryDate.format("YYYY-MM-DD")
    }

    const updated = [...tenders, tender]

    setTenders(updated)
    localStorage.setItem("tenders", JSON.stringify(updated))

    setTenderModal(false)

  }

  const createAutoTender = () => {

    if (!closingDate || !deliveryDate) {
      message.error("Please select closing and delivery date")
      return
    }

    const tender = {
      tenderId: generateTenderId(),
      items: summary,
      totalItems: summary.length,
      closingDate: closingDate.format("YYYY-MM-DD"),
      deliveryDate: deliveryDate.format("YYYY-MM-DD")
    }

    const updated = [...tenders, tender]

    setTenders(updated)
    localStorage.setItem("tenders", JSON.stringify(updated))

    setTenderModal(false)

  }

  const isTenderClosed = (tender: any) => {

    const today = new Date()
    const close = new Date(tender.closingDate)

    return today > close

  }

  const addQuotation = () => {

    const quote = {
      quoteId: "QTN-" + Date.now(),
      tenderId: selectedTender.tenderId,
      supplier,
      price: Number(price),
      delivery,
      warranty,
      contact,
      email,
      address,
      status: "Pending"
    }

    const updated = [...quotes, quote]

    setQuotes(updated)
    localStorage.setItem("quotes", JSON.stringify(updated))

    setQuoteModal(false)

  }

  const getBestPrice = (tenderId: string) => {

    const tenderQuotes = quotes.filter(q => q.tenderId === tenderId)

    if (tenderQuotes.length === 0) return null

    return Math.min(...tenderQuotes.map(q => q.price))

  }

  const approveSupplier = (q: any) => {

    const tender = tenders.find(t => t.tenderId === q.tenderId)

    const items = tender?.items || []

    const totalQty = items.reduce(
      (sum: number, i: any) => sum + Number(i.quantity || 0), 0
    )

    const totalPrice = totalQty * q.price

    const po = {
      poId: "PO-" + Date.now(),
      tenderId: q.tenderId,
      supplier: q.supplier,
      contact: q.contact,
      email: q.email,
      address: q.address,
      items,
      quantity: totalQty,
      totalPrice,
      deliveryDate: tender.deliveryDate,
      status: "Ordered"
    }

    const updatedPO = [...purchaseOrders, po]

    setPurchaseOrders(updatedPO)
    localStorage.setItem("purchaseOrders", JSON.stringify(updatedPO))

    /* remove other quotes */

    const remainingQuotes = quotes.filter(
      qt => qt.tenderId !== q.tenderId
    )

    const finalQuotes = [
      ...remainingQuotes,
      { ...q, status: "Approved" }
    ]

    setQuotes(finalQuotes)
    localStorage.setItem("quotes", JSON.stringify(finalQuotes))

  }

  const markReceived = (po: any) => {

    const updatedPO = purchaseOrders.map(p => {

      if (p.poId === po.poId)
        return { ...p, status: "Received" }

      return p

    })

    setPurchaseOrders(updatedPO)
    localStorage.setItem("purchaseOrders", JSON.stringify(updatedPO))

    /* update inventory */

    let inventory = JSON.parse(localStorage.getItem("inventory") || "[]")

    po.items.forEach((item: any) => {

      const existing = inventory.find(
        (i: any) => i.itemName === item.item
      )

      if (existing) {

        existing.total += Number(item.quantity)

      } else {

        inventory.push({
          itemId: "ITM-" + Date.now(),
          itemName: item.item,
          category: item.category,
          total: Number(item.quantity),
          allocated: 0,
          minStock: 5
        })

      }

    })

    localStorage.setItem("inventory", JSON.stringify(inventory))

    message.success("Inventory Updated")

  }

  return (

    <Card title="Procurement Module">

      <Tabs>

        <Tabs.TabPane tab="Tender Creation" key="1">

          <Button
            type="primary"
            onClick={() => setTenderModal(true)}
            style={{ marginBottom: 20 }}
          >
            Create Tender
          </Button>

          <Table
            columns={[
              { title: "Tender ID", dataIndex: "tenderId" },
              { title: "Total Items", dataIndex: "totalItems" },
              { title: "Closing Date", dataIndex: "closingDate" },
              { title: "Delivery Date", dataIndex: "deliveryDate" },
              {
                title: "Quotation",
                render: (_: any, r: any) => (
                  <Button
                    disabled={isTenderClosed(r)}
                    onClick={() => {
                      setSelectedTender(r)
                      setQuoteModal(true)
                    }}
                  >
                    Add Quote
                  </Button>
                )
              }
            ]}
            dataSource={tenders}
            rowKey="tenderId"
          />

          <br />

          <Row gutter={16}>

            <Col span={12}>

              <Card title="Requirement Summary">

                <Table
                  columns={[
                    { title: "Category", dataIndex: "category" },
                    { title: "Item", dataIndex: "item" },
                    { title: "Description", dataIndex: "description" },
                    { title: "Quantity", dataIndex: "quantity" }
                  ]}
                  dataSource={summary}
                  rowKey="item"
                  pagination={false}
                />

              </Card>

            </Col>

            <Col span={12}>

              <Card title="Procurement Requests">

                <Table
                  columns={[
                    { title: "Request ID", dataIndex: "requestId" },
                    {
                      title: "Item",
                      render: (_: any, r: any) => r.items?.[0]?.itemName
                    },
                    {
                      title: "Quantity",
                      render: (_: any, r: any) => r.items?.[0]?.quantity
                    }
                  ]}
                  dataSource={requests}
                  rowKey="requestId"
                  pagination={false}
                />

              </Card>

            </Col>

          </Row>

        </Tabs.TabPane>

        <Tabs.TabPane tab="Comparative Statement" key="2">

          <Table
            columns={[
              { title: "Tender ID", dataIndex: "tenderId" },
              { title: "Supplier", dataIndex: "supplier" },
              { title: "Price", dataIndex: "price" },
              { title: "Delivery", dataIndex: "delivery" },
              { title: "Warranty", dataIndex: "warranty" },
              {
                title: "Status",
                render: (_: any, r: any) =>
                  r.status === "Approved"
                    ? <Tag color="green">Approved</Tag>
                    : <Tag color="blue">Pending</Tag>
              },
              {
                title: "Action",
                render: (_: any, r: any) => (
                  <Button
                    type="primary"
                    onClick={() => approveSupplier(r)}
                  >
                    Approve
                  </Button>
                )
              }
            ]}
            dataSource={quotes}
            rowKey="quoteId"
            rowClassName={(r) =>
              r.price === getBestPrice(r.tenderId)
                ? "best-row"
                : ""
            }
          />

        </Tabs.TabPane>

        <Tabs.TabPane tab="Purchase Orders" key="3">

          <Table
            columns={[
              { title: "PO ID", dataIndex: "poId" },
              { title: "Tender ID", dataIndex: "tenderId" },
              { title: "Supplier", dataIndex: "supplier" },
              { title: "Quantity", dataIndex: "quantity" },
              { title: "Total Price", dataIndex: "totalPrice" },
              { title: "Delivery Date", dataIndex: "deliveryDate" },
              {
                title: "Status",
                render: (_: any, r: any) =>
                  r.status === "Received"
                    ? <Tag color="green">Received</Tag>
                    : <Tag color="blue">Ordered</Tag>
              },
              {
                title: "Action",
                render: (_: any, r: any) =>
                  r.status === "Received"
                    ? null
                    : <Button
                      type="primary"
                      onClick={() => markReceived(r)}
                    >
                      Mark Received
                    </Button>
              }
            ]}
            dataSource={purchaseOrders}
            rowKey="poId"
          />

        </Tabs.TabPane>

      </Tabs>

      <Modal
        title="Create Tender"
        open={tenderModal}
        footer={null}
        onCancel={() => setTenderModal(false)}
      >

        <DatePicker
          placeholder="Tender Closing Date"
          style={{ width: "100%", marginBottom: 10 }}
          onChange={(d) => setClosingDate(d)}
        />

        <DatePicker
          placeholder="Delivery Date"
          style={{ width: "100%", marginBottom: 20 }}
          onChange={(d) => setDeliveryDate(d)}
        />

        <Button
          type="primary"
          onClick={createAutoTender}
          style={{ marginBottom: 20 }}
        >
          Auto Tender
        </Button>

        <h4>Manual Tender</h4>

        {manualItems.map((i, index) => (

          <Space key={index} style={{ marginBottom: 10 }}>

            <Input placeholder="Category"
              onChange={(e) => updateItem(index, "category", e.target.value)}
            />

            <Input placeholder="Item"
              onChange={(e) => updateItem(index, "item", e.target.value)}
            />

            <Input placeholder="Description"
              onChange={(e) => updateItem(index, "description", e.target.value)}
            />

            <Input placeholder="Quantity"
              onChange={(e) => updateItem(index, "quantity", e.target.value)}
            />

          </Space>

        ))}

        <Button onClick={addItem}>Add Item</Button>

        <br /><br />

        <Button type="primary" onClick={createManualTender}>
          Create Manual Tender
        </Button>

      </Modal>

      <Modal
        title="Add Supplier Quote"
        open={quoteModal}
        onOk={addQuotation}
        onCancel={() => setQuoteModal(false)}
      >

        <Input placeholder="Supplier Name"
          onChange={(e) => setSupplier(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        <Input placeholder="Price"
          onChange={(e) => setPrice(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        <Input placeholder="Delivery Days"
          onChange={(e) => setDelivery(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        <Input placeholder="Warranty"
          onChange={(e) => setWarranty(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        <Input placeholder="Contact"
          onChange={(e) => setContact(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        <Input placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        <Input placeholder="Address"
          onChange={(e) => setAddress(e.target.value)}
          style={{ marginBottom: 10 }}
        />

      </Modal>

    </Card>

  )

}