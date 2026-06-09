import { Layout, Menu, Dropdown, Avatar, message } from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  InboxOutlined,
  ApartmentOutlined,
  UserOutlined,
  LogoutOutlined,
  DeleteOutlined,
  WarningOutlined
} from "@ant-design/icons";

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useContext(AuthContext);

  /* ---------- SIDEBAR MENU ---------- */

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard"
    },
    {
      key: "/admin/master-data",
      icon: <DatabaseOutlined />,
      label: "Master Data"
    },
    {
      key: "/admin/request-management",
      icon: <FileTextOutlined />,
      label: "Request Management"
    },
    {
      key: "/admin/procurement",
      icon: <ShoppingCartOutlined />,
      label: "Procurement"
    },
    {
      key: "/admin/finance",
      icon: <DollarOutlined />,
      label: "Finance"
    },
    {
      key: "/admin/inventory",
      icon: <InboxOutlined />,
      label: "Inventory"
    },
    {
      key: "/admin/allocation-tracking",
      icon: <ApartmentOutlined />,
      label: "Allocation Tracking"
    }
  ];

  /* ---------- RESET FUNCTIONS ---------- */

  const resetRequests = () => {
    localStorage.removeItem("requests");
    message.success("Requests data reset");
  };

  const resetInventory = () => {
    localStorage.removeItem("inventory");
    message.success("Inventory data reset");
  };

  const resetProcurement = () => {
    localStorage.removeItem("purchaseOrders");
    localStorage.removeItem("tenders");
    message.success("Procurement data reset");
  };

  const resetFinance = () => {
    localStorage.removeItem("invoices");
    message.success("Finance data reset");
  };

  const resetSystem = () => {
    localStorage.clear();
    message.success("Entire system data cleared");
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
        label: "Reset Requests"
      },

      {
        key: "resetInventory",
        icon: <DeleteOutlined />,
        label: "Reset Inventory"
      },

      {
        key: "resetProcurement",
        icon: <DeleteOutlined />,
        label: "Reset Procurement"
      },

      {
        key: "resetFinance",
        icon: <DeleteOutlined />,
        label: "Reset Finance"
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

      if (key === "resetRequests") resetRequests();

      if (key === "resetInventory") resetInventory();

      if (key === "resetProcurement") resetProcurement();

      if (key === "resetFinance") resetFinance();

      if (key === "resetSystem") resetSystem();

      if (key === "profile") {
        message.info("Admin Profile");
      }

    }

  };

  return (

    <Layout style={{ minHeight: "100vh" }}>

      {/* SIDEBAR */}

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
          Inventory Admin
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(e) => navigate(e.key)}
        />

      </Sider>

      {/* MAIN */}

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

        {/* CONTENT */}

        <Content style={{ padding: 24 }}>

          <Outlet />

        </Content>

      </Layout>

    </Layout>

  );

}