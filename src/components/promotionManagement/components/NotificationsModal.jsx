import { useState } from "react";
import {
  Modal,
  Form,
  Button,
  Select,
  Input,
  Upload,
  message,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { useSendNotificationMutation } from "../../../redux/apiSlices/promoSlice";

const { Option } = Select;

// Customer Segment Select Component
const CustomerSegmentSelect = () => {
  return (
    <Form.Item
      name="segment"
      label="All customers (that have transacted with this merchant)"
      rules={[{ required: true, message: "Please select a segment" }]}
    >
      <Select placeholder="Choose segment" className="mli-tall-select">
        <Option value="new_customer">New Customers</Option>
        <Option value="returning_customer">Returning Customers</Option>
        <Option value="loyal_customer">Loyal Customers</Option>
        <Option value="vip_customer">VIP Customers</Option>
        <Option value="all_customer">All Customers</Option>
      </Select>
    </Form.Item>
  );
};

// Points Input Component
const PointsInput = () => {
  return (
    <Form.Item
      name="points"
      label="All customers that have at least x number of points"
      rules={[
        { required: true, message: "Please enter a number" },
        {
          pattern: /^[0-9]+$/,
          message: "Please enter a valid number",
        },
      ]}
    >
      <Input placeholder="" className="mli-tall-input" type="number" />
    </Form.Item>
  );
};

// Radius Input Component
const RadiusInput = () => {
  return (
    <Form.Item
      name="radius"
      label="Customers located within x km of radius from the merchant location"
      rules={[
        { required: true, message: "Please enter distance/KM" },
        {
          pattern: /^[0-9]+$/,
          message: "Please enter a valid number",
        },
      ]}
    >
      <Input placeholder="" className="mli-tall-input" type="number" />
    </Form.Item>
  );
};

// Promotion Message Component
const PromotionMessage = () => {
  return (
    <Form.Item
      name="additionalInfo"
      label="Promotion/discount message"
      rules={[{ required: false }]}
    >
      <Input.TextArea
        placeholder="Enter additional information here"
        autoSize={{ minRows: 3, maxRows: 6 }}
        className="mli-tall-input"
      />
    </Form.Item>
  );
};

// Image Upload Component
const ImageUpload = ({ uploadedImage, onUploadChange, onRemove }) => {
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <Form.Item name="image" label="Upload Image (JPG/PNG only)">
      <Upload
        listType="picture"
        fileList={uploadedImage}
        beforeUpload={beforeUpload}
        onChange={onUploadChange}
        onRemove={onRemove}
        maxCount={1}
        accept=".jpg,.jpeg,.png"
      >
        <Button
          icon={<UploadOutlined />}
          style={{ borderColor: "#d8d8d8", color: "#1e1e1e" }}
        >
          Click to Upload
        </Button>
      </Upload>
      <p className="text-sm text-gray-500 mt-1">
        Allowed file types: JPG, PNG. Maximum file size: 2MB.
      </p>
    </Form.Item>
  );
};

// Main Notifications Modal Component
const NotificationsModal = ({ visible, onCancel }) => {
  const [uploadedImage, setUploadedImage] = useState([]);
  const [form] = Form.useForm();
  const [sendNotification, { isLoading }] = useSendNotificationMutation();

  const handleSendNotification = async (values) => {
    try {
      // Validate required fields
      if (!values.segment) {
        message.error("Please select a customer segment");
        return;
      }
      if (!values.additionalInfo) {
        message.error("Please enter a message");
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();

      // Map segment values to API format
      const segmentMap = {
        vip_customer: "vip_customer",
        new_customer: "new_customer",
        returning_customer: "returning_customer",
        loyal_customer: "loyal_customer",
        all_customer: "all_customer",
      };

      // Create data object with notification data
      const notificationData = {
        message: values.additionalInfo,
        minPoints: parseInt(values.points || 0, 10),
        segment: segmentMap[values.segment] || values.segment,
        radius: parseInt(values.radius || 50000, 10),
      };

      // Append data as JSON string
      formData.append("data", JSON.stringify(notificationData));

      // Add image as binary if uploaded
      if (uploadedImage.length > 0) {
        const file = uploadedImage[0];
        if (file.originFileObj) {
          formData.append("image", file.originFileObj);
        }
      }

      // Send notification with proper headers
      const response = await sendNotification(formData).unwrap();

      onCancel();
      Swal.fire({
        icon: "success",
        title: "Notification Sent!",
        text: `Message has been sent successfully.`,
        timer: 1500,
        showConfirmButton: false,
      });
      setUploadedImage([]);
      form.resetFields();
    } catch (err) {
      console.error("Notification error:", err);
      const errorMsg = err?.data?.message || "Failed to send notification";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
      });
    }
  };

  const handleCancel = () => {
    setUploadedImage([]);
    form.resetFields();
    onCancel();
  };

  const handleUploadChange = ({ fileList }) => {
    setUploadedImage(fileList);
  };

  return (
    <Modal
      title="Send Notification"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      closable={true}
    >
      <Spin spinning={isLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSendNotification}
          className="flex flex-col gap-4"
        >
          <CustomerSegmentSelect />

          <PointsInput />

          <RadiusInput />

          <PromotionMessage />

          <ImageUpload
            uploadedImage={uploadedImage}
            onUploadChange={handleUploadChange}
            onRemove={(file) =>
              setUploadedImage((prev) => prev.filter((f) => f.uid !== file.uid))
            }
          />

          <div className="flex gap-2 mt-4">
            <Button
              type="default"
              className="flex-1"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="flex-1"
              loading={isLoading}
            >
              Send
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default NotificationsModal;
