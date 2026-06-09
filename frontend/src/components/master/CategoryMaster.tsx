import { useState } from "react";
import { Card, Table, Button, Modal, Form, Input, Space, Tag, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Category {
    id: number;
    name: string;
    description: string;
    status: string;
}

export default function CategoryMaster() {

    const [categories, setCategories] = useState<Category[]>([
        { id: 1, name: "Electronics", description: "Electronic devices", status: "Active" },
        { id: 2, name: "Furniture", description: "Office furniture", status: "Active" }
    ]);

    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);

    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    /* ADD CATEGORY */

    const handleAdd = (values: any) => {

        const newCategory: Category = {
            id: Date.now(),
            ...values
        };

        setCategories([...categories, newCategory]);
        form.resetFields();
        setOpen(false);
    };

    /* EDIT CATEGORY */

    const openEdit = (record: Category) => {

        setEditing(record);
        editForm.setFieldsValue(record);
        setEditOpen(true);
    };

    const handleEdit = (values: any) => {

        const updated = categories.map((cat) =>
            cat.id === editing?.id ? { ...cat, ...values } : cat
        );

        setCategories(updated);
        setEditOpen(false);
    };

    /* DELETE CATEGORY */

    const handleDelete = (id: number) => {

        const filtered = categories.filter((cat) => cat.id !== id);
        setCategories(filtered);
    };

    /* TABLE */

    const columns = [

        {
            title: "Category ID",
            dataIndex: "id"
        },

        {
            title: "Category Name",
            dataIndex: "name"
        },

        {
            title: "Description",
            dataIndex: "description"
        },

        {
            title: "Status",
            dataIndex: "status",
            render: (status: string) =>
                status === "Active"
                    ? <Tag color="green">Active</Tag>
                    : <Tag color="red">Inactive</Tag>
        },

        {
            title: "Actions",
            render: (_: any, record: Category) => (

                <Space>

                    <Button
                        icon={<EditOutlined />}
                        onClick={() => openEdit(record)}
                        size="small"
                    >
                        Edit
                    </Button>

                    <Popconfirm
                        title="Delete category?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Delete
                        </Button>
                    </Popconfirm>

                </Space>
            )
        }

    ];

    return (

        <Card
            title="Category Master"
            extra={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setOpen(true)}
                >
                    Add Category
                </Button>
            }
        >

            <Table
                dataSource={categories}
                columns={columns}
                rowKey="id"
            />

            {/* ADD MODAL */}

            <Modal
                title="Add Category"
                open={open}
                footer={null}
                onCancel={() => setOpen(false)}
            >

                <Form layout="vertical" form={form} onFinish={handleAdd}>

                    <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input />
                    </Form.Item>

                    <Form.Item name="status" label="Status">
                        <Input placeholder="Active / Inactive" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Add Category
                    </Button>

                </Form>

            </Modal>

            {/* EDIT MODAL */}

            <Modal
                title="Edit Category"
                open={editOpen}
                footer={null}
                onCancel={() => setEditOpen(false)}
            >

                <Form layout="vertical" form={editForm} onFinish={handleEdit}>

                    <Form.Item name="name" label="Category Name">
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input />
                    </Form.Item>

                    <Form.Item name="status" label="Status">
                        <Input />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Update Category
                    </Button>

                </Form>

            </Modal>

        </Card>
    );
}