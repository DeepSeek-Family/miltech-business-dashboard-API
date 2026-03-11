import { Menu, Modal, Upload, Button, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";

import {
  Dashboard,
  Sales,
  People,
  PromotionManagement,
  Rewords,
  Settings,
} from "../../components/common/Svg";
import image4 from "../../assets/image4.png";
import { useUser } from "../../provider/User";
import { getImageUrl } from "../../components/common/imageUrl";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logo, setLogo] = useState(image4); // state for logo
  const navigate = useNavigate();
  const user = useUser();

  const showLogoutConfirm = () => setIsLogoutModalOpen(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogoutModalOpen(false);
    navigate("/auth/login");
  };
  const handleCancel = () => setIsLogoutModalOpen(false);

  // Logo upload handler
  const handleLogoUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
      return Upload.LIST_IGNORE; // Prevent non-JPG/PNG files
    }

    const reader = new FileReader();
    reader.onload = (e) => setLogo(e.target.result);
    reader.readAsDataURL(file);

    return false; // Prevent auto-upload
  };

  const isItemActive = (itemKey) =>
    selectedKey === itemKey ||
    (itemKey === "subMenuSetting" &&
      ["/profile", "/terms-and-conditions", "/privacy-policy"].includes(
        selectedKey,
      ));

  const renderIcon = (IconComponent, itemKey) => {
    const isActive = isItemActive(itemKey);
    return (
      <div
        style={{ width: 20, height: 20 }}
        className={isActive ? "svg-active" : ""}
      >
        <IconComponent
          className="menu-icon"
          fill={isActive ? "#ffffff" : "#1E1E1E"}
        />
      </div>
    );
  };

  // Check user role
  const userRole = user?.user?.role || user?.role;
  const isViewMerchant = userRole === "VIEW_MERCENT";

  const menuItems = [
    ...(isViewMerchant
      ? []
      : [
          {
            key: "/",
            icon: renderIcon(Dashboard, "/"),
            label: <Link to="/">{collapsed ? "" : "Dashboard Overview"}</Link>,
          },
        ]),
    {
      key: "/sell-management",
      icon: renderIcon(Sales, "/sell-management"),
      label: (
        <Link to="/sell-management">{collapsed ? "" : "Sell Management"}</Link>
      ),
    },
    {
      key: "/point-tyre-system",
      icon: renderIcon(People, "/point-tyre-system"),
      label: (
        <Link to="/point-tyre-system">
          {collapsed ? "" : "Point & Tier System"}
        </Link>
      ),
    },
    {
      key: "/customer-management",
      icon: renderIcon(People, "/customer-management"),
      label: (
        <Link to="/customer-management">
          {collapsed ? "" : "Customer Management"}
        </Link>
      ),
    },
    {
      key: "/promotion-management",
      icon: renderIcon(PromotionManagement, "/promotion-management"),
      label: (
        <Link to="/promotion-management">
          {collapsed ? "" : "Promotions & Discounts"}
        </Link>
      ),
    },
    {
      key: "/reporting-analytics",
      icon: renderIcon(Rewords, "/reporting-analytics"),
      label: (
        <Link to="/reporting-analytics">
          {collapsed ? "" : "Reporting & Analytics"}
        </Link>
      ),
    },
    {
      key: "subMenuSetting",
      icon: renderIcon(Settings, "subMenuSetting"),
      label: collapsed ? "" : "Settings",
      children: [
        {
          key: "/profile",
          label: <Link to="/profile">{collapsed ? "" : "Update Profile"}</Link>,
        },
        ...(isViewMerchant
          ? []
          : [
              {
                key: "/user-management",
                label: (
                  <Link to="/user-management">
                    {collapsed ? "" : "User Management"}
                  </Link>
                ),
              },
            ]),
        {
          key: "/terms-and-conditions",
          label: (
            <Link to="/terms-and-conditions">
              {collapsed ? "" : "Terms And Conditions"}
            </Link>
          ),
        },
        {
          key: "/privacy-policy",
          label: (
            <Link to="/privacy-policy">
              {collapsed ? "" : "Privacy Policy"}
            </Link>
          ),
        },
      ],
    },
    {
      key: "/logout",
      icon: <IoIosLogOut size={24} />,
      label: <p onClick={showLogoutConfirm}>{collapsed ? "" : "Logout"}</p>,
    },
  ];

  useEffect(() => {
    const selectedItem = menuItems.find(
      (item) =>
        item.key === path || item.children?.some((sub) => sub.key === path),
    );
    if (selectedItem) {
      setSelectedKey(path);
      if (selectedItem.children) setOpenKeys([selectedItem.key]);
      else {
        const parentItem = menuItems.find((item) =>
          item.children?.some((sub) => sub.key === path),
        );
        if (parentItem) setOpenKeys([parentItem.key]);
      }
    }
  }, [path]);

  const handleOpenChange = (keys) => setOpenKeys(keys);

  return (
    <div
      className="h-full flex flex-col bg-white border-r border-primary transition-all duration-300"
      style={{ width: collapsed ? 80 : 250 }}
    >
      {/* Logo + Upload */}
      {!collapsed && (
        <div className="flex flex-col items-center py-4">
          <Link to={"/"}>
            <img
              src={getImageUrl(user?.user?.profile)}
              alt="logo"
              className="w-40 h-40 object-contain"
            />
          </Link>
        </div>
      )}

      {/* Menu */}
      <div className="flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          className="font-poppins text-black border-none"
          items={menuItems.map((item) => ({
            ...item,
            children: item.children
              ? item.children.map((subItem) => ({ ...subItem }))
              : undefined,
          }))}
        />
      </div>

      {/* Logout Modal */}
      <Modal
        centered
        title="Confirm Logout"
        open={isLogoutModalOpen}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Logout"
        cancelText="Cancel"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
};

export default Sidebar;
