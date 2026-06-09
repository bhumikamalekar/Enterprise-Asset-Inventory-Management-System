import { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function ItemsMaster() {

  const [items, setItems] = useState([
    {
      id: 1,
      name: "Laptop",
      category: "Electronics",
      unit: "Piece",
      description: "Dell laptop",
      minStock: 5,
      status: "Active"
    }
  ]);

  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  const handleAdd = (values: any) => {

    const newItem = {
      id: Date.now(),
      ...values
    };

    setItems([...items, newItem]);

    setOpen(false);

    form.resetFields();
  };

  const columns = [

    { title: "Item ID", dataIndex: "id" },

    { title: "Item Name", dataIndex: "name" },

    { title: "Category", dataIndex: "category" },

    { title: "Unit", dataIndex: "unit" },

    { title: "Description", dataIndex: "description" },

    { title: "Min Stock", dataIndex: "minStock" },

    { title: "Status", dataIndex: "status" },

    {
      title: "Action",
      render: (_: any, record: any) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() =>
            setItems(items.filter((i) => i.id !== record.id))
          }
        >
          Delete
        </Button>
      )
    }

  ];

  return (

    <>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
        style={{ marginBottom: 15 }}
      >
        Add Item
      </Button>

      <Table columns={columns} dataSource={items} rowKey="id" />

      <Modal
        title="Add Item"
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
      >

        <Form layout="vertical" form={form} onFinish={handleAdd}>

          <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="category" label="Category">
            <Input />
          </Form.Item>

          <Form.Item name="unit" label="Unit">
            <Select>
              <Option value="Piece">Piece</Option>
              <Option value="Box">Box</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>

          <Form.Item name="minStock" label="Minimum Stock">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Add Item
          </Button>

        </Form>

      </Modal>

    </>
  );
}