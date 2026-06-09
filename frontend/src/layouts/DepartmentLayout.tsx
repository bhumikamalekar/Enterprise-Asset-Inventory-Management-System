import { Layout, Menu, Dropdown, Avatar, message } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  SwapOutlined,
  UserOutlined,
  LogoutOutlined,
  DeleteOutlined,
  WarningOutlined
} from "@ant-design/icons";

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const { Header, Sider, Content } = Layout;

export default function DepartmentLayout() {

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useContext(AuthContext);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  /* ---------- SIDEBAR MENU ---------- */

  const menuItems = [
    {
      key: "/department/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard"
    },
    {
      key: "/department/portal",
      icon: <FileTextOutlined />,
      label: "Requests"
    },
    {
      key: "/department/allocation",
      icon: <AppstoreOutlined />,
      label: "Allocation"
    },
    {
      key: "/department/issues",
      icon: <SwapOutlined />,
      label: "Issue / Return"
    }
  ];

  /* ---------- RESET FUNCTIONS ---------- */

  const resetRequests = () => {

    const allRequests = JSON.parse(localStorage.getItem("requests") || "[]");

    const filtered = allRequests.filter((r: any) => r.email !== user.email);

    localStorage.setItem("requests", JSON.stringify(filtered));

    message.success("Your requests were reset");

  };

  const resetAllocations = () => {

    localStorage.removeItem("allocations");

    message.success("Allocation data reset");

  };

  const resetIssues = () => {

    localStorage.removeItem("issues");

    message.success("Issue / Return data reset");

  };

  const resetSystem = () => {

    localStorage.clear();

    message.success("System data cleared");

    navigate("/login");

  };

  /* ---------- LOGOUT ---------- */

  const logout = () => {

    auth?.logout();

    message.success("Logged out successfully");

    navigate("/login");

  };

  /* ---------- PROFILE MENU ---------- */

  const profileMenu = {
    items: [

      {
        key: "profile",
        icon: <UserOutlined />,
        label: "Profile"
      },

      {
        key: "resetRequests",
        icon: <DeleteOutlined />,
        label: "Reset My Requests"
      },

      {
        key: "resetAllocations",
        icon: <DeleteOutlined />,
        label: "Reset Allocation Data"
      },

      {
        key: "resetIssues",
        icon: <DeleteOutlined />,
        label: "Reset Issue/Return Data"
      },

      {
        key: "resetSystem",
        icon: <WarningOutlined />,
        label: "Reset Entire System"
      },

      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Logout"
      }

    ],

    onClick: ({ key }: any) => {

      if (key === "logout") logout();

      if (key === "profile") {
        message.info(`Logged in as ${user.email}`);
      }

      if (key === "resetRequests") resetRequests();

      if (key === "resetAllocations") resetAllocations();

      if (key === "resetIssues") resetIssues();

      if (key === "resetSystem") resetSystem();

    }
  };

  return (

    <Layout style={{ minHeight: "100vh" }}>

      {/* ---------- SIDEBAR ---------- */}

      <Sider width={230} theme="dark">

        <div
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: 600,
            padding: 16,
            textAlign: "center",
            borderBottom: "1px solid #303030"
          }}
        >
          Department Portal
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(e) => navigate(e.key)}
        />

      </Sider>

      {/* ---------- MAIN ---------- */}

      <Layout>

        {/* HEADER */}

        <Header
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: 20
          }}
        >

          <Dropdown menu={profileMenu} placement="bottomRight">

            <Avatar
              icon={<UserOutlined />}
              style={{ cursor: "pointer" }}
            />

          </Dropdown>

        </Header>

        {/* PAGE CONTENT */}

        <Content style={{ padding: 24 }}>

          <Outlet />

        </Content>

      </Layout>

    </Layout>

  );

}