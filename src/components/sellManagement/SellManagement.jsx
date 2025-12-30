import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  Input,
  Button,
  Tooltip,
  message,
  Form,
  Modal,
  Tag,
} from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";
import NewSell from "./components/NewSell";
import CustomTable from "../common/CustomTable";
import dayjs from "dayjs";
import { useGetTodaysSellsQuery } from "../../redux/apiSlices/selleManagementSlice";

const { Option } = Select;

const SellManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCards, setSelectedCards] = useState([]);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchText, setSearchText] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isNewSellPage, setIsNewSellPage] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [form] = Form.useForm();

  // Initialize state from URL parameters
  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const term = searchParams.get("searchTerm") || "";
    const view = searchParams.get("view") || "";

    setPagination({ current: page, pageSize: limit });
    setSearchText(term);
    setIsNewSellPage(view === "newsell");
  }, []);

  // Fetch today's sales from API
  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetTodaysSellsQuery({
    page: pagination.current,
    limit: pagination.pageSize,
  });

  // Update local data when API data changes
  useEffect(() => {
    if (apiData?.data && Array.isArray(apiData.data)) {
      const formattedData = apiData.data.map((item, index) => ({
        id: item._id || index + 1,
        customerName: item.name || "-",
        email: item.email || "-",
        phone: item.phone || "-",
        totalTransactions: item.totalTransactions || 0,
        totalAmount: item.totalBilled ? `${item.totalBilled}` : "0.00",
        pointEarned: item.totalPointsEarned || 0,
        pointRedeem: item.totalPointsRedeemed || 0,
        finalAmount: item.finalBilled ? `${item.finalBilled}` : "0.00",
        cardIds: item.cardIds || "-",
        transactionStatus: item.status || "Pending",
        date: item.date || new Date().toISOString().split("T")[0],
      }));
      setData(formattedData);

      // Update pagination info if available
      if (apiData.pagination) {
        setPagination((prev) => ({
          ...prev,
          total: apiData.pagination.total,
        }));
      }
    }
  }, [apiData]);

  const handleMonthChange = (month) => setSelectedMonth(month);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    updateURL({ searchTerm: value, page: 1 });
  };

  const updateURL = (params) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const filteredData = data.filter((item) => {
    const matchesMonth = selectedMonth
      ? new Date(item.date).getMonth() + 1 === parseInt(selectedMonth)
      : true;
    const matchesSearch = searchText
      ? item.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return matchesMonth && matchesSearch;
  });

  const handleNewSellSubmit = (values) => {
    message.success("Transaction completed successfully!");
    setIsNewSellPage(false);
    setEditingRow(null);
    updateURL({ view: "" });
    // Data will be refreshed automatically when component re-fetches from API
  };

  const handleEdit = (record) => {
    setEditingRow({ ...record, date: dayjs(record.date) }); // Ensure date is a valid dayjs object
    setIsNewSellPage(true);
    updateURL({ view: "newsell" });
  };

  const handleBackFromNewSell = () => {
    setIsNewSellPage(false);
    setEditingRow(null);
    updateURL({ view: "" });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this entry?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        message.success("Entry deleted successfully");
        // API call to delete would go here
      },
    });
  };

  const handleTableChange = (newPagination) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
    updateURL({ page: newPagination.current, limit: newPagination.pageSize });
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Card IDs",
      dataIndex: "cardIds",
      key: "cardIds",
      align: "center",
    },
    {
      title: "Total Transactions",
      dataIndex: "totalTransactions",
      key: "totalTransactions",
      align: "center",
    },
    {
      title: "Total Billed",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "center",
    },
    {
      title: "Final Billed",
      dataIndex: "finalAmount",
      key: "finalAmount",
      align: "center",
    },
    {
      title: "Points Earned",
      dataIndex: "pointEarned",
      key: "pointEarned",
      align: "center",
    },
    {
      title: "Points Redeemed",
      dataIndex: "pointRedeem",
      key: "pointRedeem",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "transactionStatus",
      key: "transactionStatus",
      align: "center",
      render: (status) => {
        const statusColors = {
          completed: "green",
          pending: "orange",
          failed: "red",
        };
        return (
          <Tag color={statusColors[status?.toLowerCase()] || "default"}>
            {status}
          </Tag>
        );
      },
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   align: "center",
    //   width: 80,
    //   render: (_, record) => (
    //     <div
    //       className="flex gap-2 justify-between align-middle py-[7px] px-[15px] border border-primary rounded-md"
    //       style={{ alignItems: "center" }}
    //     >
    //       <Tooltip title="Edit">
    //         <button
    //           onClick={() => handleEdit(record)}
    //           className="text-primary hover:text-green-700 text-[17px]"
    //         >
    //           <FaEdit />
    //         </button>
    //       </Tooltip>
    //       <Tooltip title="Delete">
    //         <Button
    //           type="danger"
    //           size="small"
    //           onClick={() => handleDelete(record.id)}
    //         >
    //           <FaTrash className="text-red-600" />
    //         </Button>
    //       </Tooltip>
    //     </div>
    //   ),
    // },
  ];

  if (isNewSellPage) {
    return (
      <NewSell
        onBack={handleBackFromNewSell}
        onSubmit={handleNewSellSubmit} // Pass the function as a prop
        editingRow={editingRow} // Pass the editing row data
      />
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[24px] font-bold">Today’s Sell</h1>
      </div>
      <div className="flex flex-row items-start justify-between gap-4 mb-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search by Customer Name or Card ID"
            style={{ width: 300 }}
            value={searchText}
            onChange={handleSearchChange}
            allowClear
          />
          <Select
            placeholder="Filter by Month"
            style={{ width: 200 }}
            onChange={handleMonthChange}
            allowClear
            className="text-[14px] h-10"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <Option key={i + 1} value={String(i + 1)}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </Option>
            ))}
          </Select>
        </div>
        <Button
          onClick={() => {
            setIsNewSellPage(true);
            updateURL({ view: "newsell" });
          }}
          className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
        >
          Create New Sell
        </Button>
      </div>

      <div className="overflow-x-auto">
        <CustomTable
          data={filteredData}
          columns={columns}
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          onPaginationChange={handleTableChange}
          rowKey="id"
        />
      </div>
    </div>
  );
};

export default SellManagement;
