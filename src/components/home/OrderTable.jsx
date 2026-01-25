import React, { useState, useMemo } from "react";
import { Table, Tooltip, Modal, Spin } from "antd";
import dayjs from "dayjs";
import { useGetRecentCustomersQuery } from "../../redux/apiSlices/selleManagementSlice";

const components = {
  header: {
    row: (props) => (
      <tr
        {...props}
        style={{
          backgroundColor: "#f0f5f9",
          height: "50px",
          color: "secondary",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
    cell: (props) => (
      <th
        {...props}
        style={{
          color: "secondary",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
  },
};

const OrderTable = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Fetch customers from API
  const {
    data: customersResponse,
    isLoading,
    isFetching,
  } = useGetRecentCustomersQuery({
    page: pagination.current,
    limit: pagination.pageSize,
  });

  // Transform API data to table format
  const data = useMemo(() => {
    if (!customersResponse?.data) return [];
    return customersResponse.data.map((item, index) => ({
      id:
        pagination.current * pagination.pageSize -
        pagination.pageSize +
        index +
        1,
      customerId: item.customUserId || item.id || "-",
      customerName: item.name || item.customerName || "-",
      points: item.availablePoints || item.points || 0,
      tier: item.loyaltyTier || item.tier || "-",
      joiningDate:
        item.joiningDate || item.createdAt
          ? dayjs(item.joiningDate || item.createdAt).format("DD/MM/YYYY")
          : "-",
      accountStatus: item.accountStatus || item.status || "Active",
      key: index,
    }));
  }, [customersResponse?.data, pagination]);

  const showViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Customer ID",
      dataIndex: "customerId",
      key: "customerId",
      align: "center",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      align: "center",
    },
    { title: "Points", dataIndex: "points", key: "points", align: "center" },
    { title: "Tier", dataIndex: "tier", key: "tier", align: "center" },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      key: "joiningDate",
      align: "center",
    },
    {
      title: "Account Status",
      dataIndex: "accountStatus",
      key: "accountStatus",
      align: "center",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between mb-2 items-start sm:items-center gap-2 sm:gap-0">
        <h1 className="text-lg sm:text-xl md:text-xl font-bold text-secondary mb-2">
          Recent New Members
        </h1>
      </div>

      <div className="overflow-x-auto">
        <Spin spinning={isLoading || isFetching}>
          <Table
            dataSource={data}
            columns={columns}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: customersResponse?.pagination?.total || 0,
            }}
            onChange={(pag) =>
              setPagination({ current: pag.current, pageSize: pag.pageSize })
            }
            bordered={false}
            size="small"
            rowClassName="custom-row"
            components={components}
            className="custom-table"
            scroll={{ x: "max-content" }}
          />
        </Spin>
      </div>
    </div>
  );
};

export default OrderTable;
