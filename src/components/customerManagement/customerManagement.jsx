import { useState, useEffect } from "react";
import { Button, Modal, Input, Tooltip, Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import MarchantIcon from "../../assets/marchant.png";
import { Rate } from "antd";
import CustomTable from "../common/CustomTable";
import DetailsModal from "./components/DetailsModal";
import {
  useGetCustomersQuery,
  useLazyExportCustomersQuery,
} from "../../redux/apiSlices/selleManagementSlice";

const CustomerManagement = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchText, setSearchText] = useState("");
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const navigate = useNavigate();

  // Fetch customers from API
  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetCustomersQuery({
    page: pagination.current,
    limit: pagination.pageSize,
  });

  // Export customers
  const [triggerExport, { isLoading: isExportLoading }] =
    useLazyExportCustomersQuery();

  const handleExportCustomers = async () => {
    try {
      const result = await triggerExport([]);

      if (result.data) {
        // Create a blob URL and trigger download
        const blob = result.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Generate filename with current date
        const dateStr = new Date().toISOString().split("T")[0];
        link.download = `customers-export-${dateStr}.xlsx`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
      message.error("Failed to export customers");
    }
  };

  // Update local data when API data changes
  useEffect(() => {
    if (apiData?.data && Array.isArray(apiData.data)) {
      const formattedData = apiData.data.map((item, index) => ({
        id: index + 1,
        customerID: item._id || "-",
        name: item.name || "-",
        image: item.profile || MarchantIcon,
        customUserId: item.customUserId || "-",
        email: item.email || "-",
        phone: item.phone || "-",
        location: item.country || "-",
        sales: item.totalBilled || 0,
        salesRep: item.salesRep || "-",
        status: item.status || "Pending",
        feedback: item.rating || 0,
        ratingComment: item.ratingComment || "",
        pointsRedeemed: item.totalPointsRedeemed || 0,
        remainingRedemptionPoints: item.availablePoints || 0,
        totalTransactions: item.totalTransactions || 0,
        totalPointsEarned: item.totalPointsEarned || 0,
        cardIds: item.cardIds || "-",
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

  // Show view details modal
  const showViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  // Show feedback modal
  const showFeedbackModal = (record) => {
    setSelectedRecord(record);
    setIsFeedbackModalVisible(true);
  };

  // Close view modal
  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  // Close feedback modal
  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalVisible(false);
    setSelectedRecord(null);
  };

  // Handle pagination change
  const handleTableChange = (newPagination) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // Columns for loyalty points / orders
  const columns2 = [
    {
      title: "SL",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Reward",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Points Used",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  // Columns for feedback table
  const columnsFeedback = [
    { title: "Product Name", dataIndex: "product", key: "product" },
    { title: "Rating", dataIndex: "rating", key: "rating" },
    { title: "Feedback", dataIndex: "feedback", key: "feedback" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  // Main table columns
  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Customer ID",
      dataIndex: "customUserId",
      key: "customUserId",
      align: "center",
    },
    { title: "Customer Name", dataIndex: "name", key: "name", align: "center" },
    // {
    //   title: "Business Name",
    //   dataIndex: "businessName",
    //   key: "businessName",
    //   align: "center",
    // },
    {
      title: "Points Redeemed",
      dataIndex: "pointsRedeemed",
      key: "pointsRedeemed",
      align: "center",
    },
    {
      title: "Rem. Redemption Points",
      dataIndex: "remainingRedemptionPoints",
      key: "remainingRedemptionPoints",
      align: "center",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "center",
    },
    {
      title: "Sales Rep",
      dataIndex: "salesRep",
      key: "salesRep",
      align: "center",
    },
    {
      title: "Total Sales",
      dataIndex: "sales",
      key: "sales",
      align: "center",
      render: (sales) => {
        if (typeof sales === "number") {
          return `${sales.toFixed(2)}`;
        }
        return `${sales || 0}`;
      },
    },
    { title: "Status", dataIndex: "status", key: "status", align: "center" },
    {
      title: "Ratings",
      dataIndex: "feedback",
      key: "feedback",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Customer Ratings">
          <Rate
            disabled
            value={record.feedback} // assuming rating is a number from 1 to 5
            style={{ fontSize: 16, color: "#FFD700" }} // optional styling
          />
        </Tooltip>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        // <div className=" py-[12px] border border-primary rounded-md">
        <div className="flex- gap-2 ">
          <Tooltip title="View Details">
            <button
              onClick={() => showViewModal(record)}
              className="border border-primary px-4 py-1 rounded bg-[#D7F4DE] mr-5"
            >
              View Details
            </button>
          </Tooltip>
          {/* <Tooltip title="Customer Ratings">
              <Rate
                disabled
                value={record.rating} // assuming rating is a number from 1 to 5
                style={{ fontSize: 16, color: "#FFD700" }} // optional styling
              />
            </Tooltip> */}
        </div>
        // </div>
      ),
    },
  ];

  // Filtered data based on search input
  const filteredData = data.filter((item) => {
    const query = searchText.trim().toLowerCase();

    // convert id to string, compare against the raw search (no lowercasing numbers)
    const idMatch = item.customerID.toString().includes(searchText.trim());

    const nameMatch = item.name.toLowerCase().includes(query);
    const phoneMatch = item.phone.toLowerCase().includes(query);
    const emailMatch = item.email.toLowerCase().includes(query);

    return idMatch || nameMatch || phoneMatch || emailMatch;
  });

  return (
    <div className="">
      <div className="flex justify-between flex-col md:flex-row md:items-end">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 ">
          <div>
            <h1 className="text-[24px] font-bold">Customer Management</h1>
            <p className="text-[16px] font-normal mt-2">
              Seamlessly manage customer profiles and interactions.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex gap-4">
          <Input
            placeholder="Search by Customer ID, Name, Location or Sales Rep"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-96"
          />
          <Button
            className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
            onClick={handleExportCustomers}
            loading={isExportLoading}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Customer Table */}
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

      {/* View Details Modal */}
      <DetailsModal
        isVisible={isViewModalVisible}
        selectedRecord={selectedRecord}
        onClose={handleCloseViewModal}
        columns2={columns2}
        data={data}
      />

      {/* Feedback Modal */}
      <Modal
        visible={isFeedbackModalVisible}
        onCancel={handleCloseFeedbackModal}
        width={700}
        footer={[]}
      >
        {selectedRecord && (
          <div>
            <h2 className="text-[22px] font-bold text-primary mb-2">
              Feedback Details
            </h2>
            <p className="text-[16px] font-medium mb-4">
              Customer:{" "}
              <span className="font-semibold">{selectedRecord.name}</span>
            </p>

            <Table
              columns={columnsFeedback}
              dataSource={selectedRecord.feedback}
              rowKey="date"
              pagination={false}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerManagement;
