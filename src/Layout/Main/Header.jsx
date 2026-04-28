import { Badge, Button, Dropdown, Menu, Modal } from "antd";
import { useCallback, useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa6";
import { Menu as MenuIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getImageUrl } from "../../components/common/imageUrl";
import { useUser } from "../../provider/User";
import { useGetUnreadCountQuery } from "../../redux/apiSlices/notificationSlice";
import socketService from "../../components/common/socketService";
import { api } from "../../redux/api/baseApi";

const Header = ({ toggleSidebar, isMobile }) => {
  const { user } = useUser();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get unread notification count
  const { data: notificationData, refetch: refetchNotifications } =
    useGetUnreadCountQuery();
  const unreadCount = notificationData?.data?.unreadCount || 0;

  // Handle new notification from socket
  const handleNewNotification = useCallback(() => {
    console.log("🔔 Header: New notification received, refetching count...");
    refetchNotifications();
  }, [refetchNotifications]);

  useEffect(() => {
    if (user?._id) {
      // Connect to socket
      socketService.connect(user._id);

      // Subscribe to new notifications
      socketService.subscribeToUserNotifications(handleNewNotification);
    }

    // Cleanup on unmount
    return () => {
      socketService.unsubscribeFromUserNotifications(handleNewNotification);
    };
  }, [user?._id, handleNewNotification]);

  const showLogoutConfirm = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogout = () => {
    // Clear Redux cache to remove previous user's data
    dispatch(api.util.resetApiState());
    
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setIsLogoutModalOpen(false);
    navigate("/auth/login");
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="settings">
        <Link to="/profile">Settings</Link>
      </Menu.Item>
      <Menu.Item
        key="logout"
        danger
        onClick={showLogoutConfirm}
        style={{ display: "flex", alignItems: "center" }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex items-center justify-between gap-5 w-full px-6 rounded-md shadow-sm py-2 bg-white border-b border-gray-200">
      <div className="py-2 flex items-center gap-4">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle Sidebar"
          >
            <MenuIcon size={24} color="#3FAE6A" />
          </button>
        )}
        <h2 className="font-bold text-xl text-secondary">
          Business Dashboard{" "}
          <span className="text-primary">
            (
            {user?.subscriptions && user.subscriptions.length > 0
              ? "No Plan"
              : "No Plan"}
            )
          </span>
        </h2>
      </div>
      <div className="flex items-center gap-3">
        {/* Profile Icon with Dropdown Menu */}
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="flex flex-row gap-1">
              <p></p>{" "}
              <p className="text-[16px] font-semibold">
                {user?.businessName || ""}
              </p>
            </div>
            <img
              style={{
                clipPath: "circle()",
                width: 45,
                height: 45,
                objectFit: "cover",
              }}
              src={getImageUrl(user?.profile)}
              alt="profile-pic"
              className="clip"
            />
          </div>
        </Dropdown>

        {/* Notification Icon */}
        <Link to="/notification" className="h-fit mt-[10px]">
          <Badge count={unreadCount} overflowCount={99} color="#3FC7EE">
            <FaRegBell color="#3FAE6A" size={24} />
          </Badge>
        </Link>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        visible={isLogoutModalOpen}
        onCancel={handleCancelLogout}
        footer={[
          <Button key="cancel" onClick={handleCancelLogout}>
            Cancel
          </Button>,
          <Button key="logout" danger onClick={handleLogout}>
            Logout
          </Button>,
        ]}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </div>
  );
};

export default Header;
