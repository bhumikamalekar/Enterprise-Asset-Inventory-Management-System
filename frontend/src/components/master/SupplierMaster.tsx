import { useState } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function SupplierMaster() {

  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: "Dell",
      contact: "John",
      email: "dell@mail.com",
      phone: "9876543210",
      address: "Bangalore",
      gst: "GST123",
      status: "Active"
    }
  ]);

  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  const handleAdd = (values: any) => {

    setSuppliers([
      ...suppliers,
      { id: Date.now(), ...values }
    ]);

    setOpen(false);

    form.resetFields();
  };

  const columns = [

    { title: "Supplier Name", dataIndex: "name" },

    { title: "Contact Person", dataIndex: "contact" },

    { title: "Email", dataIndex: "email" },

    { title: "Phone", dataIndex: "phone" },

    { title: "Address", dataIndex: "address" },

    { title: "GST", dataIndex: "gst" },

    { title: "Status", dataIndex: "status" }

  ];

  return (

    <>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
        style={{ marginBottom: 15 }}
      >
        Add Supplier
      </Button>

      <Table columns={columns} dataSource={suppliers} rowKey="id" />

      <Modal
        title="Add Supplier"
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
      >

        <Form layout="vertical" form={form} onFinish={handleAdd}>

          <Form.Item name="name" label="Supplier Name">
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

          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>

          <Form.Item name="gst" label="GST Number">
            <Input />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Add Supplier
          </Button>

        </Form>

      </Modal>

    </>
  );
}