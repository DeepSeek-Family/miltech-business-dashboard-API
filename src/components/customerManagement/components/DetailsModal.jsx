import { Modal, Table, Spin } from "antd";
import { useEffect, useState } from "react";
import MarchantIcon from "../../../assets/marchant.png";
import {
  useGetUserTransactionsQuery,
  useGetCustomerTierQuery,
} from "../../../redux/apiSlices/selleManagementSlice";
import dayjs from "dayjs";

const DetailsModal = ({
  isVisible,
  selectedRecord,
  onClose,
  columns2,
  data,
}) => {
  const [transactionData, setTransactionData] = useState([]);
  const [tierData, setTierData] = useState(null);

  // Fetch transactions only when modal is visible and record selected
  const { data: transactionsResponse, isLoading: isLoadingTransactions } =
    useGetUserTransactionsQuery(selectedRecord?.customerID, {
      skip: !isVisible || !selectedRecord?.customerID,
    });

  // Fetch customer tier information
  const { data: tierResponse, isLoading: isLoadingTier } =
    useGetCustomerTierQuery(selectedRecord?.customerID, {
      skip: !isVisible || !selectedRecord?.customerID,
    });

  // Format transaction data when it arrives
  useEffect(() => {
    if (
      transactionsResponse?.data &&
      Array.isArray(transactionsResponse.data)
    ) {
      const formattedTransactions = transactionsResponse.data.map(
        (transaction, index) => ({
          key: transaction._id || index,
          orderId: index + 1,
          date: transaction.createdAt
            ? dayjs(transaction.createdAt).format("DD/MM/YYYY")
            : "N/A",
          quantity: transaction.pointsEarned || 0,
          amount: transaction.pointRedeemed || 0,
        })
      );
      setTransactionData(formattedTransactions);
    }
  }, [transactionsResponse]);

  // Update tier data when it arrives
  useEffect(() => {
    if (tierResponse?.data) {
      setTierData(tierResponse.data);
    }
  }, [tierResponse]);

  return (
    <Modal visible={isVisible} onCancel={onClose} width={900} footer={[]}>
      <Spin spinning={isLoadingTransactions || isLoadingTier}>
        {selectedRecord && (
          <div>
            <div className="flex flex-row justify-between items-start gap-3 mt-8">
              <img
                src={MarchantIcon}
                alt={selectedRecord.name}
                className="w-214 h-214 rounded-full"
              />
              <div className="flex flex-col gap-2 border border-primary rounded-md p-4 w-full">
                <p className="text-[22px] font-bold text-primary">
                  Customer Profile
                </p>
                <p>
                  <strong>Name:</strong> {selectedRecord.name}
                </p>
                <p>
                  <strong>Location:</strong> {selectedRecord.location}
                </p>
                <p>
                  <strong>Total Sales:</strong>{" "}
                  {selectedRecord.sales.toFixed
                    ? selectedRecord.sales.toFixed(2)
                    : selectedRecord.sales}
                </p>
                <p>
                  <strong>Status:</strong> {selectedRecord.status}
                </p>
                <p className="text-[22px] font-bold text-primary mt-4">
                  Loyalty Points
                </p>
                <p>
                  <strong>Points Balance:</strong>{" "}
                  {tierData?.availablePoints ||
                    selectedRecord.availablePoints ||
                    "N/A"}
                </p>
                <p>
                  <strong>Tier:</strong>{" "}
                  {tierData?.tierName || selectedRecord.tierName || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-[20px] font-bold text-primary mb-4">
                Transaction History
              </h3>
              <Table
                columns={columns2}
                dataSource={transactionData}
                rowKey="key"
                pagination={{ pageSize: 10 }}
                className="mt-4"
                loading={isLoadingTransactions}
              />
            </div>
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default DetailsModal;
