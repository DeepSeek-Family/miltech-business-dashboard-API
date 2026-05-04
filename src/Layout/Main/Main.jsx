import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { Drawer } from "antd";

const Main = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) setDrawerVisible(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <div className="h-screen w-screen flex bg-baseBg overflow-hidden">
      {/* Desktop Sidebar (left) */}
      {!isMobile && <Sidebar collapsed={false} />}

      {/* Mobile Sidebar Drawer (right side) */}
      {isMobile && (
        <Drawer
          open={drawerVisible}
          placement="left"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          bodyStyle={{ padding: 0 }}
          width={250}
        >
          <Sidebar collapsed={false} />
        </Drawer>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header with toggle button */}
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />

        <div className="flex-1 px-8 py-8 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;