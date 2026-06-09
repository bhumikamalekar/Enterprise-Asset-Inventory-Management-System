import { Card, List } from "antd";
import { useNavigate } from "react-router-dom";

export default function Notifications() {

    const navigate = useNavigate();

    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");

    const handleClick = (notification: any) => {

        if (notification.type === "request") {

            navigate("/admin/request-management", {
                state: { requestId: notification.requestId }
            });

        }

        if (notification.type === "stock") {

            navigate("/admin/inventory");

        }

    };

    return (

        <Card title="Notifications">

            <List
                dataSource={notifications}
                renderItem={(item: any) => (

                    <List.Item
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClick(item)}
                    >

                        <div>
                            <div>{item.message}</div>
                            <small>{item.time}</small>
                        </div>

                    </List.Item>

                )}
            />

        </Card>

    );
}