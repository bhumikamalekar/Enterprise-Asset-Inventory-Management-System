import { useEffect, useState } from "react"
import {
    Card,
    Table,
    Tag,
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    Select,
    Space,
    message
} from "antd"

export default function IssueReturnTracking() {

    const [issues, setIssues] = useState<any[]>([])
    const [allocations, setAllocations] = useState<any[]>([])
    const [open, setOpen] = useState(false)

    const [form] = Form.useForm()

    /* LOAD DATA */

    useEffect(() => {

        setIssues(JSON.parse(localStorage.getItem("issues") || "[]"))

        setAllocations(JSON.parse(localStorage.getItem("allocations") || "[]"))

    }, [])

    /* ISSUE ITEM */

    const issueItem = (values: any) => {

        const allocation = allocations.find(a => a.allocationId === values.allocationId)

        if (!allocation) {

            message.error("Allocation not found")

            return

        }

        const issue = {

            issueId: "ISS-" + Date.now(),

            allocationId: values.allocationId,

            itemName: allocation.itemName,

            issuedTo: values.issuedTo,

            issueDate: values.issueDate.format("YYYY-MM-DD"),

            returnDate: values.returnDate.format("YYYY-MM-DD"),

            status: "Issued"

        }

        const updated = [...issues, issue]

        setIssues(updated)

        localStorage.setItem("issues", JSON.stringify(updated))

        setOpen(false)

        form.resetFields()

        message.success("Item Issued Successfully")

    }

    /* RETURN ITEM */

    const returnItem = (record: any) => {

        const updated = issues.map(i => {

            if (i.issueId === record.issueId) {

                return { ...i, status: "Returned" }

            }

            return i

        })

        setIssues(updated)

        localStorage.setItem("issues", JSON.stringify(updated))

        message.success("Item Returned")

    }

    /* CHECK OVERDUE */

    const getStatus = (record: any) => {

        if (record.status === "Returned") return <Tag color="green">Returned</Tag>

        const today = new Date()

        const returnDate = new Date(record.returnDate)

        if (today > returnDate) {

            return <Tag color="red">Overdue</Tag>

        }

        return <Tag color="blue">Issued</Tag>

    }

    /* TABLE COLUMNS */

    const columns = [

        {
            title: "Issue ID",
            dataIndex: "issueId"
        },

        {
            title: "Item",
            dataIndex: "itemName"
        },

        {
            title: "Issued To",
            dataIndex: "issuedTo"
        },

        {
            title: "Issue Date",
            dataIndex: "issueDate"
        },

        {
            title: "Return Date",
            dataIndex: "returnDate"
        },

        {
            title: "Status",
            render: (_: any, r: any) => getStatus(r)
        },

        {
            title: "Action",
            render: (_: any, r: any) =>

                r.status === "Returned"
                    ? null
                    :
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => returnItem(r)}
                    >
                        Mark Returned
                    </Button>

        }

    ]

    return (

        <Card title="Issue / Return Tracking">

            <Button
                type="primary"
                style={{ marginBottom: 20 }}
                onClick={() => setOpen(true)}
            >
                Issue Item
            </Button>

            <Table
                columns={columns}
                dataSource={issues}
                rowKey="issueId"
            />

            {/* ISSUE MODAL */}

            <Modal
                title="Issue Item"
                open={open}
                footer={null}
                onCancel={() => setOpen(false)}
            >

                <Form
                    layout="vertical"
                    form={form}
                    onFinish={issueItem}
                >

                    <Form.Item
                        name="allocationId"
                        label="Allocation Item"
                        rules={[{ required: true }]}
                    >

                        <Select
                            options={allocations.map(a => ({

                                value: a.allocationId,

                                label: `${a.itemName} (${a.allocationId})`

                            }))}
                        />

                    </Form.Item>

                    <Form.Item
                        name="issuedTo"
                        label="Issued To"
                        rules={[{ required: true }]}
                    >

                        <Input placeholder="Person Name" />

                    </Form.Item>

                    <Form.Item
                        name="issueDate"
                        label="Issue Date"
                        rules={[{ required: true }]}
                    >

                        <DatePicker style={{ width: "100%" }} />

                    </Form.Item>

                    <Form.Item
                        name="returnDate"
                        label="Return Date"
                        rules={[{ required: true }]}
                    >

                        <DatePicker style={{ width: "100%" }} />

                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                    >
                        Issue Item
                    </Button>

                </Form>

            </Modal>

        </Card>

    )

}