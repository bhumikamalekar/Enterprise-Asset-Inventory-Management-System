import { Card, Form, Input, Button, Typography, Select, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const { Title } = Typography;
const { Option } = Select;

export default function Login() {

  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [role, setRole] = useState("admin");

  const onFinish = (values: any) => {

    const { email, password, phone, address } = values;

    const userData = {
      email,
      role,
      phone,
      address
    };

    localStorage.setItem("user", JSON.stringify(userData));

    auth?.login(email, password, role);

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/department/dashboard");
    }

    message.success("Login successful");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb"
      }}
    >
      <Card style={{ width: 420 }}>
        <Title level={3}>Inventory Login</Title>

        <Form layout="vertical" onFinish={onFinish}>

          {/* ROLE + PHONE ROW */}

          <Row gutter={12}>

            <Col span={12}>
              <Form.Item label="Login As">
                <Select value={role} onChange={(v) => setRole(v)}>
                  <Option value="admin">Admin</Option>
                  <Option value="hod">HOD</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="phone"
                label="Contact Number"
                rules={[
                  { required: true, message: "Contact number required" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Enter a valid 10 digit number"
                  }
                ]}
              >
                <Input placeholder="10 digit phone number" />
              </Form.Item>
            </Col>

          </Row>

          {/* EMAIL */}

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email required" },
              { type: "email", message: "Enter a valid email" }
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          {/* PASSWORD */}

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Password required" },
              { min: 6, message: "Minimum 6 characters" }
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          {/* ADDRESS */}

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Address required" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter address" />
          </Form.Item>

          {/* LOGIN BUTTON */}

          <Button type="primary" htmlType="submit" block>
            Login
          </Button>

        </Form>
      </Card>
    </div>
  );
}