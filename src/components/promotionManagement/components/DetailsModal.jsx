import { Modal, Button, Descriptions, Image, Tag, Space } from "antd";
import { getImageUrl } from "../../common/imageUrl";

const CUSTOMER_SEGMENT_MAP = {
  vip_customer: "VIP Customers",
  new_customer: "New Customers",
  returning_customer: "Returning Customers",
  loyal_customer: "Loyal Customers",
  all_customer: "All Customers",
};

const PROMOTION_TYPE_MAP = {
  seasonal: "Seasonal",
  referral: "Referral",
  flash_sale: "Flash Sale",
  loyalty: "Loyalty",
};

const getCustomerSegmentLabel = (value) => {
  return CUSTOMER_SEGMENT_MAP[value] || value;
};

const getPromotionTypeLabel = (value) => {
  return PROMOTION_TYPE_MAP[value] || value;
};

const formatPromotionDate = (value) => {
  if (!value) return "-";

  let date = new Date(value);

  // Fallback for date-only strings or mixed backend formats.
  if (Number.isNaN(date.getTime()) && typeof value === "string") {
    date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  }

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-GB", {
    timeZone: "UTC",
  });
};

const DetailsModal = ({ visible, onCancel, record }) => {
  if (!record) {
    return null;
  }

  const { raw } = record;

  return (
    <Modal
      title="Promotion Details"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" type="primary" onClick={onCancel}>
          Close
        </Button>,
      ]}
      width={800}
      closable={true}
    >
      <div className="space-y-6">
        {/* Details */}
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Promotion Name" span={2}>
            <span className="font-semibold">{raw?.name}</span>
          </Descriptions.Item>

          <Descriptions.Item label="Promotion Type">
            <Tag color="blue">{getPromotionTypeLabel(raw?.promotionType)}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag color={raw?.status === "active" ? "green" : "red"}>
              {raw?.status === "active" ? "Active" : "Inactive"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Customer Segment" span={2}>
            <Tag color="purple">
              {getCustomerSegmentLabel(raw?.customerSegment)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Discount Percentage">
            <span className="font-bold text-lg">
              {raw?.discountPercentage}%
            </span>
          </Descriptions.Item>

          <Descriptions.Item label="Start Date">
            {formatPromotionDate(raw?.startDate)}
          </Descriptions.Item>

          <Descriptions.Item label="End Date">
            {formatPromotionDate(raw?.endDate)}
          </Descriptions.Item>

          <Descriptions.Item label="Available Days" span={2}>
            <Space wrap>
              {raw?.availableDays && raw.availableDays.length > 0 ? (
                raw.availableDays[0] === "all" ? (
                  <Tag color="cyan">All Days</Tag>
                ) : (
                  raw.availableDays.map((day, index) => (
                    <Tag key={index} color="default">
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Tag>
                  ))
                )
              ) : (
                <span>-</span>
              )}
            </Space>
          </Descriptions.Item>

          {raw?.createdAt && (
            <Descriptions.Item label="Created At" span={2}>
              {new Date(raw.createdAt).toLocaleString()}
            </Descriptions.Item>
          )}

          {raw?.updatedAt && (
            <Descriptions.Item label="Last Updated" span={2}>
              {new Date(raw.updatedAt).toLocaleString()}
            </Descriptions.Item>
          )}
        </Descriptions>
        {/* Image */}
        {raw?.image && (
          <div className="flex justify-center mb-6">
            <Image
              src={getImageUrl(raw.image)}
              alt={raw.name}
              style={{ maxWidth: "300px", height: "auto" }}
              preview={true}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DetailsModal;
