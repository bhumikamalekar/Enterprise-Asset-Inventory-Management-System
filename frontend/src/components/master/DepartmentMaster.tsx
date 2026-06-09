import { useState } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function DepartmentMaster() {

  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "IT",
      hod: "Dr. Smith",
      email: "it@company.com",
      phone: "9999999999",
      status: "Active"
    }
  ]);

  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  const handleAdd = (values: any) => {

    setDepartments([
      ...departments,
      { id: Date.now(), ...values }
    ]);

    setOpen(false);

    form.resetFields();
  };

  const columns = [

    { title: "Department Name", dataIndex: "name" },

    { title: "HOD Name", dataIndex: "hod" },

    { title: "Email", dataIndex: "email" },

    { title: "Contact Number", dataIndex: "phone" },

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
        Add Department
      </Button>

      <Table columns={columns} dataSource={departments} rowKey="id" />

      <Modal
        title="Add Department"
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
      >

        <Form layout="vertical" form={form} onFinish={handleAdd}>

          <Form.Item name="name" label="Department Name">
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

          <Form.Item name="status" label="Status">
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Add Department
          </Button>

        </Form>

      </Modal>

    </>
  );
}