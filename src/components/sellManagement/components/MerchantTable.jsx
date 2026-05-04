import React from "react";
import { Button, Space, message, Spin } from "antd";
import { FaEye } from "react-icons/fa";
import CustomTable from "../../common/CustomTable";
import dayjs from "dayjs";
import { useGetMerchantsQuery } from "../../../redux/apiSlices/selleManagementSlice";

const MerchantTable = () => {
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
  });

  const { data: merchantData, isLoading, isFetching } = useGetMerchantsQuery({
    page: pagination.current,
    limit: pagination.pageSize,
  });

  const merchants = merchantData?.data || [];
  const paginationInfo = merchantData?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 1,
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "_id",
      key: "sl",
      width: 60,
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Merchant Name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 150,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 120,
    },
    {
      title: "Total Transactions",
      dataIndex: "totalTransactions",
      key: "totalTransactions",
      width: 130,
      align: "center",
    },
    {
      title: "Total Billed",
      dataIndex: "totalBilled",
      key: "totalBilled",
      width: 120,
      render: (value) => `$${value}`,
    },
    {
      title: "Final Billed",
      dataIndex: "finalBilled",
      key: "finalBilled",
      width: 120,
      render: (value) => `$${value}`,
    },
    {
      title: "Points Earned",
      dataIndex: "totalPointsEarned",
      key: "totalPointsEarned",
      width: 120,
    },
    {
      title: "Points Redeemed",
      dataIndex: "totalPointsRedeemed",
      key: "totalPointsRedeemed",
      width: 120,
    },
    {
      title: "Card IDs",
      dataIndex: "cardIds",
      key: "cardIds",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => {
        const statusColors = {
          completed: "green",
          pending: "orange",
          failed: "red",
        };
        return (
          <span style={{ color: statusColors[status] || "gray" }}>
            {status?.charAt(0).toUpperCase() + status?.slice(1)}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      fixed: "right",
      render: (text, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<FaEye />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record) => {
    message.info(`Viewing details for merchant: ${record.name}`);
    // Add navigation or modal logic here
  };

  const handleTableChange = (newPagination) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  return (
    <div className="w-full">
      <h1 className="text-[24px] font-bold mb-4">Merchants</h1>
      <CustomTable
        columns={columns}
        data={merchants}
        pagination={{
          current: paginationInfo.page,
          pageSize: paginationInfo.limit,
          total: paginationInfo.total,
        }}
        onChange={handleTableChange}
        isLoading={isLoading}
        isFetching={isFetching}
        rowKey="_id"
      />
    </div>
  );
};

export default MerchantTable;
