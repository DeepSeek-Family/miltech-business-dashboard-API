import React from "react";
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Spin,
  message,
} from "antd";
import { IoArrowBack } from "react-icons/io5";
import dayjs from "dayjs";
import {
  useLazyFindDigitalCardQuery,
  useRequestPromotionApprovalMutation,
} from "../../../redux/apiSlices/selleManagementSlice";

const { Option } = Select;

const NewSell = ({ onBack, onSubmit, editingRow }) => {
  const [form] = Form.useForm();
  const [cardCode, setCardCode] = React.useState("");
  const [selectedPromotions, setSelectedPromotions] = React.useState([]);
  const [digitalCardData, setDigitalCardData] = React.useState(null);
  const [approvalResponse, setApprovalResponse] = React.useState(null);
  const [findDigitalCard, { isLoading }] = useLazyFindDigitalCardQuery();
  const [requestPromotionApproval, { isLoading: isApproving }] =
    useRequestPromotionApprovalMutation();

  const toggleSelectPromotion = (promotionId) => {
    setSelectedPromotions((prev) =>
      prev.includes(promotionId)
        ? prev.filter((id) => id !== promotionId)
        : [...prev, promotionId]
    );
  };

  const handleFindCard = async () => {
    if (!cardCode.trim()) {
      message.error("Please enter a card code");
      return;
    }
    try {
      const result = await findDigitalCard(cardCode).unwrap();
      if (result?.success && result?.data?.digitalCard) {
        setDigitalCardData(result.data.digitalCard);
        form.setFieldsValue({
          pointEarned: result.data.digitalCard.availablePoints || 0,
        });
        message.success("Card found successfully");
      }
    } catch (error) {
      message.error(error?.data?.message || "Failed to find card");
      setDigitalCardData(null);
    }
  };

  const handleApplyGiftCard = async () => {
    if (!cardCode.trim()) {
      message.error("Please enter a card code first");
      return;
    }
    if (selectedPromotions.length === 0) {
      message.error("Please select at least one promotion");
      return;
    }

    const totalBill = form.getFieldValue("totalAmount");
    const pointRedeem = form.getFieldValue("pointRedeem");

    if (!totalBill) {
      message.error("Please enter total bill amount");
      return;
    }

    try {
      const requestBody = {
        digitalCardCode: cardCode,
        promotionId: selectedPromotions[0], // Using the first selected promotion
        totalBill: parseFloat(totalBill),
        pointRedeemed: parseFloat(pointRedeem) || 0,
      };

      const result = await requestPromotionApproval(requestBody).unwrap();
      if (result?.success) {
        setApprovalResponse(result.data);
        message.success("Gift card applied successfully");
      }
    } catch (error) {
      message.error(error?.data?.message || "Failed to apply gift card");
    }
  };

  React.useEffect(() => {
    if (editingRow) {
      form.setFieldsValue(editingRow);
    }
  }, [editingRow, form]);

  const handleSubmit = (values) => {
    const updatedValues = {
      ...values,
      date: values.date ? values.date.format("YYYY-MM-DD") : undefined, // Convert date to string
    };
    onSubmit(updatedValues); // Calls the onSubmit function passed from parent component
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex gap-4 items-center mb-3">
        <Button
          icon={<IoArrowBack />}
          onClick={onBack}
          className="mb-3"
        ></Button>
        <h1 className="text-[24px] font-bold mb-4">New Sell</h1>
      </div>
      <Form layout="vertical" onFinish={handleSubmit} form={form}>
        <div className="flex justify-between gap-10">
          <div className="w-full border rounded-lg">
            <h1 className="text-[24px] font-bold text-primary bg-white px-6 py-2">
              New Transaction
            </h1>
            <div className="bg-[#D7F4DE] px-6 py-2 flex flex-col gap-4">
              <Form.Item
                label="Find Customer by Card ID"
                name="customerId"
                className="mb-3"
              >
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    style={{ width: "70%" }}
                    className="mli-tall-input"
                    value={cardCode}
                    onChange={(e) => setCardCode(e.target.value)}
                    onPressEnter={handleFindCard}
                  />
                  <Button
                    style={{ width: "30%" }}
                    className="h-10 bg-primary text-white font-semibold text-[18px]"
                    onClick={handleFindCard}
                    loading={isLoading}
                  >
                    Find
                  </Button>
                </Space.Compact>
              </Form.Item>

              <Form.Item
                label="Available Point"
                name="pointEarned"
                className="mb-3"
              >
                <Input className="mli-tall-input" />
              </Form.Item>
              <Form.Item
                label="Total Bill Amount ($)"
                name="totalAmount"
                className="mb-3"
              >
                <Input className="mli-tall-input" />
              </Form.Item>
              <Form.Item
                label="Point Redeem"
                name="pointRedeem"
                className="mb-3"
              >
                <Input className="mli-tall-input" />
              </Form.Item>
              <Form.Item label="Expiry Date" name="date" className="mb-6">
                <DatePicker
                  className="mli-tall-picker"
                  defaultValue={editingRow ? dayjs(editingRow.date) : null}
                />
              </Form.Item>

              <div className="flex flex-wrap gap-4">
                {digitalCardData?.promotions &&
                digitalCardData.promotions.length > 0 ? (
                  digitalCardData.promotions.map((promotion) => (
                    <div
                      key={promotion._id}
                      onClick={() => toggleSelectPromotion(promotion._id)}
                      className={`flex flex-col items-center border rounded p-4 cursor-pointer transition-all ${
                        selectedPromotions.includes(promotion._id)
                          ? "border-primary bg-blue-100"
                          : "border-gray-300 bg-white hover:border-primary"
                      }`}
                    >
                      <h1 className="text-[14px] font-bold">
                        {promotion.name}
                      </h1>
                      <p className="text-[14px] font-normal text-secondary">
                        {promotion.discountPercentage}% Discount
                      </p>
                      <p className="text-[12px] text-gray-500 mt-1">
                        {dayjs(promotion.startDate).format("DD/MM/YYYY")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-[14px]">
                    No promotions available or card not found
                  </p>
                )}
              </div>
              <Button className="w-full bg-primary text-white mt-4 text-[16px] font-bold p-5">
                Apply Gift Card
              </Button>
              <div className="flex justify-between mt-4 mb-3">
                <Button className="bg-primary text-white font-bold p-5 text-[16px]">
                  Scan Now
                </Button>
                {/* <Button className="bg-primary text-white font-bold p-5 text-[16px]">
                  Add Rewards
                </Button> */}
              </div>
            </div>
          </div>

          <div className="w-full border py-8 rounded-lg">
            <h1 className="text-[24px] font-bold text-primary bg-white px-6 pb-6">
              Summery
            </h1>
            <div className="px-6 flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="font-bold text-[24px] text-secondary">
                  Total Bill:
                </p>
                <p className="font-bold text-[24px] text-secondary">
                  $
                  {approvalResponse?.totalBill ||
                    form.getFieldValue("totalAmount") ||
                    "0.00"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold text-[24px] text-secondary">
                  Points Redeemed:
                </p>
                <p className="font-bold text-[24px] text-secondary">
                  $
                  {approvalResponse?.pointsRedeemed ||
                    form.getFieldValue("pointRedeem") ||
                    "0.00"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold text-[24px] text-secondary">
                  Points Earned:
                </p>
                <p className="font-bold text-[24px] text-secondary">
                  +{approvalResponse?.pointsEarned || "0"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold text-[24px] text-secondary">
                  Gift Card:
                </p>
                <p className="font-bold text-[24px] text-secondary">
                  +{approvalResponse?.giftCard || "0"}
                </p>
              </div>
              <div className="flex justify-between border-t-2 border-primary">
                <p className="font-bold text-[24px] text-secondary">
                  Final Amount:
                </p>
                <p className="font-bold text-[24px] text-secondary">
                  ${approvalResponse?.finalAmount || "0.00"}
                </p>
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-primary text-white mt-6 text-[16px] font-bold p-5"
                >
                  Complete Transaction
                </Button>
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default NewSell;
