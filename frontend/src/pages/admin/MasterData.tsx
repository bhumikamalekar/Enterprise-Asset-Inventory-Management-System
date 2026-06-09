import { useState, useEffect } from "react"
import {
  Card,
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag
} from "antd"

const { Option } = Select

/* ---------------- ITEMS ---------------- */

interface Item {
  itemId: number
  itemName: string
  category: string
  unit: string
  description: string
  status: string
  minStock: number
}

/* ---------------- SUPPLIERS ---------------- */

interface Supplier {
  supplierId: number
  name: string
  contact: string
  email: string
  phone: string
  address: string
  gst: string
  status: string
}

/* ---------------- DEPARTMENTS ---------------- */

interface Department {
  departmentId: number
  departmentName: string
  hod: string
  email: string
  phone: string
  status: string
}

export default function MasterData() {

  const [items, setItems] = useState<Item[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [departments, setDepartments] = useState<Department[]>([])

  const [itemOpen, setItemOpen] = useState(false)
  const [supplierOpen, setSupplierOpen] = useState(false)
  const [deptOpen, setDeptOpen] = useState(false)

  const [itemForm] = Form.useForm()
  const [supplierForm] = Form.useForm()
  const [deptForm] = Form.useForm()

  useEffect(() => {

    setItems(JSON.parse(localStorage.getItem("items") || "[]"))
    setSuppliers(JSON.parse(localStorage.getItem("suppliers") || "[]"))
    setDepartments(JSON.parse(localStorage.getItem("departments") || "[]"))

  }, [])

  /* ---------------- ADD ITEM ---------------- */

  const addItem = (values: any) => {

    const newItem: Item = {

      itemId: Date.now(),
      itemName: values.itemName,
      category: values.category,
      unit: values.unit,
      description: values.description,
      status: "Active",
      minStock: Number(values.minStock)

    }

    const updated = [...items, newItem]

    setItems(updated)

    localStorage.setItem("items", JSON.stringify(updated))

    itemForm.resetFields()

    setItemOpen(false)

  }

  /* ---------------- ADD SUPPLIER ---------------- */

  const addSupplier = (values: any) => {

    const newSupplier: Supplier = {

      supplierId: Date.now(),
      name: values.name,
      contact: values.contact,
      email: values.email,
      phone: values.phone,
      address: values.address,
      gst: values.gst,
      status: "Active"

    }

    const updated = [...suppliers, newSupplier]

    setSuppliers(updated)

    localStorage.setItem("suppliers", JSON.stringify(updated))

    supplierForm.resetFields()

    setSupplierOpen(false)

  }

  /* ---------------- ADD DEPARTMENT ---------------- */

  const addDepartment = (values: any) => {

    const newDept: Department = {

      departmentId: Date.now(),
      departmentName: values.departmentName,
      hod: values.hod,
      email: values.email,
      phone: values.phone,
      status: "Active"

    }

    const updated = [...departments, newDept]

    setDepartments(updated)

    localStorage.setItem("departments", JSON.stringify(updated))

    deptForm.resetFields()

    setDeptOpen(false)

  }

  /* ---------------- TABLE COLUMNS ---------------- */

  const itemColumns = [

    { title: "Item ID", dataIndex: "itemId" },
    { title: "Item Name", dataIndex: "itemName" },
    { title: "Category", dataIndex: "category" },
    { title: "Unit", dataIndex: "unit" },
    { title: "Minimum Stock", dataIndex: "minStock" },
    {
      title: "Status",
      render: () => <Tag color="green">Active</Tag>
    }

  ]

  const supplierColumns = [

    { title: "Supplier ID", dataIndex: "supplierId" },
    { title: "Supplier Name", dataIndex: "name" },
    { title: "Contact Person", dataIndex: "contact" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Status",
      render: () => <Tag color="green">Active</Tag>
    }

  ]

  const deptColumns = [

    { title: "Department ID", dataIndex: "departmentId" },
    { title: "Department", dataIndex: "departmentName" },
    { title: "HOD", dataIndex: "hod" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Status",
      render: () => <Tag color="green">Active</Tag>
    }

  ]

  return (

    <Card title="Master Data">

      <Tabs defaultActiveKey="1">

        {/* ITEMS */}

        <Tabs.TabPane tab="Items" key="1">

          <Button
            type="primary"
            onClick={() => setItemOpen(true)}
            style={{ marginBottom: 16 }}
          >
            Add Item
          </Button>

          <Table
            columns={itemColumns}
            dataSource={items}
            rowKey="itemId"
          />

        </Tabs.TabPane>

        {/* SUPPLIERS */}

        <Tabs.TabPane tab="Suppliers" key="2">

          <Button
            type="primary"
            onClick={() => setSupplierOpen(true)}
            style={{ marginBottom: 16 }}
          >
            Add Supplier
          </Button>

          <Table
            columns={supplierColumns}
            dataSource={suppliers}
            rowKey="supplierId"
          />

        </Tabs.TabPane>

        {/* DEPARTMENTS */}

        <Tabs.TabPane tab="Departments" key="3">

          <Button
            type="primary"
            onClick={() => setDeptOpen(true)}
            style={{ marginBottom: 16 }}
          >
            Add Department
          </Button>

          <Table
            columns={deptColumns}
            dataSource={departments}
            rowKey="departmentId"
          />

        </Tabs.TabPane>

      </Tabs>

      {/* ITEM MODAL */}

      <Modal
        title="Add Item"
        open={itemOpen}
        footer={null}
        onCancel={() => setItemOpen(false)}
      >

        <Form layout="vertical" form={itemForm} onFinish={addItem}>

          <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="category" label="Category">
            <Input />
          </Form.Item>

          <Form.Item name="unit" label="Unit">
            <Select>
              <Option value="Piece">Piece</Option>
              <Option value="Box">Box</Option>
              <Option value="Set">Set</Option>
            </Select>
          </Form.Item>

          <Form.Item name="minStock" label="Minimum Stock">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Save Item
          </Button>

        </Form>

      </Modal>

      {/* SUPPLIER MODAL */}

      <Modal
        title="Add Supplier"
        open={supplierOpen}
        footer={null}
        onCancel={() => setSupplierOpen(false)}
      >

        <Form layout="vertical" form={supplierForm} onFinish={addSupplier}>

          <Form.Item name="name" label="Supplier Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="contact" label="Contact Person">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="gst" label="GST Number">
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input.TextArea />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Save Supplier
          </Button>

        </Form>

      </Modal>

      {/* DEPARTMENT MODAL */}

      <Modal
        title="Add Department"
        open={deptOpen}
        footer={null}
        onCancel={() => setDeptOpen(false)}
      >

        <Form layout="vertical" form={deptForm} onFinish={addDepartment}>

          <Form.Item name="departmentName" label="Department Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="hod" label="HOD Name">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Contact Number">
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Save Department
          </Button>

        </Form>

      </Modal>

    </Card>

  )

}