import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Select,
  Upload,
  message,
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { getImageUrl } from "../../common/imageUrl";

const { RangePicker } = DatePicker;
const { Option } = Select;

const daysOptions = [
  { label: "Mon", value: "mon" },
  { label: "Tue", value: "tue" },
  { label: "Wed", value: "wed" },
  { label: "Thu", value: "thu" },
  { label: "Fri", value: "fri" },
  { label: "Sat", value: "sat" },
  { label: "Sun", value: "sun" },
];

const NewCampaign = ({ onSave, onCancel, editData = null, isEdit = false }) => {
  const [form] = Form.useForm();
  const [thumbnail, setThumbnail] = useState("");
  const [uploadedImage, setUploadedImage] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  // Initialize form with editData if in edit mode
  useEffect(() => {
    if (isEdit && editData) {
      // Handle availableDays or promotionDays
      const rawDays =
        editData.raw?.availableDays ||
        editData.selectedDays ||
        editData.promotionDays ||
        [];

      // Check if "all" is in the array or if all 7 days are present
      const isAllDays =
        (Array.isArray(rawDays) && rawDays.includes("all")) ||
        (Array.isArray(rawDays) && rawDays.length === 7);

      const initialDays = isAllDays
        ? daysOptions.map((day) => day.value)
        : rawDays;

      setCheckAll(isAllDays || initialDays.length === daysOptions.length);

      const dateRange =
        editData.startDate && editData.endDate
          ? [dayjs(editData.startDate), dayjs(editData.endDate)]
          : null;

      // Set existing image if available
      if (editData.raw?.image) {
        setUploadedImage([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: getImageUrl(editData.raw.image),
          },
        ]);
      }

      form.setFieldsValue({
        promotionName: editData.promotionName,
        promotionType:
          editData.raw?.promotionType || editData.promotionType?.toLowerCase(),
        customerReach: editData.customerReach,
        customerSegment:
          editData.raw?.customerSegment ||
          editData.customerSegment?.toLowerCase(),
        discountPercentage: editData.discountPercentage,
        dateRange: dateRange,
        promotionDays: initialDays,
        grossValue: editData.grossValue,
      });
    } else if (!isEdit) {
      // Reset form for new promotion
      resetForm();
    }
  }, [isEdit, editData]);

  const resetForm = () => {
    form.resetFields();
    setThumbnail("");
    setUploadedImage([]);
    setCheckAll(false);
  };

  const handleThumbnailChange = ({ file }) => {
    if (file.status === "done" || file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => setThumbnail(e.target.result);
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const handleSubmit = (values) => {
    console.log("Form values:", values);
    console.log("Promotion Days:", values.promotionDays);
    const [startDate, endDate] = values.dateRange || [];
    const campaignData = {
      promotionName: values.promotionName,
      promotionType: values.promotionType,
      customerReach: values.customerReach,
      customerSegment: values.customerSegment,
      discountPercentage: values.discountPercentage,
      startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
      endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
      thumbnail,
      promotionDays: values.promotionDays || [],
      imageFile: uploadedImage[0]?.originFileObj || null,
      grossValue: values.grossValue,
    };

    console.log("Campaign Data:", campaignData);

    // If editing, include the id
    if (isEdit && editData) {
      campaignData.id = editData.id;
    }

    onSave(campaignData);
    resetForm();
    onCancel();
  };

  // Image upload validation
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
    }
    return isJpgOrPng || Upload.LIST_IGNORE;
  };

  const handleUploadChange = ({ fileList }) => {
    // Only keep the latest file (for replacement)
    const newFileList = fileList.slice(-1);
    setUploadedImage(newFileList);
    // Update form field value
    form.setFieldsValue({ image: newFileList });
  };

  const handleCheckAllChange = (e) => {
    const allDays = daysOptions.map((day) => day.value);
    const newCheckedDays = e.target.checked ? allDays : [];
    setCheckAll(e.target.checked);
    form.setFieldsValue({ promotionDays: newCheckedDays });
  };

  const handleDaysChange = (checkedValues) => {
    form.setFieldsValue({ promotionDays: checkedValues });
    // Uncheck "All days" if not all days are selected
    const allDays = daysOptions.map((day) => day.value);
    const isAllSelected = checkedValues.length === allDays.length;
    setCheckAll(isAllSelected);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">
        {isEdit ? "Edit Promotion" : "Add New Promotion"}
      </h2>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <div className="flex flex-row justify-between gap-4">
          <div className="w-full flex flex-col gap-4">
            <Form.Item
              label="Promotion Name"
              name="promotionName"
              rules={[{ required: true }]}
            >
              <Input
                className="px-3 mli-tall-input"
                placeholder="Enter Promotion Name"
              />
            </Form.Item>

            <Form.Item
              label="Promotion Type"
              name="promotionType"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Promotion Type"
                className="mli-tall-select"
              >
                <Option value="seasonal">Seasonal</Option>
                <Option value="referral">Referral</Option>
                <Option value="flash_sale">Flash Sale</Option>
                <Option value="loyalty">Loyalty</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="w-full flex flex-col gap-4">
            {/* <Form.Item
              label="Customer Reach"
              name="customerReach"
              rules={[{ required: true }]}
            >
              <Input
                className="px-3 mli-tall-input"
                placeholder="Enter Customer Reach"
              />
            </Form.Item> */}

            <Form.Item
              name="customerSegment"
              label="Customer Segment"
              rules={[{ required: true, message: "Please select a segment" }]}
            >
              <Select
                placeholder="Select Customer Segment"
                className="mli-tall-select"
              >
                <Select.Option value="new_customer">New Customer</Select.Option>
                <Select.Option value="returning_customer">
                  Returning Customer
                </Select.Option>
                <Select.Option value="loyal_customer">
                  Loyal Customer
                </Select.Option>
                <Select.Option value="vip_customer">VIP Customer</Select.Option>
                <Select.Option value="all_customer">All Customer</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Date Range"
              name="dateRange"
              rules={[{ required: true }]}
            >
              <RangePicker
                style={{ width: "100%" }}
                className="px-3 mli-tall-picker"
              />
            </Form.Item>
          </div>

          <div className="w-full flex flex-col gap-4">
            <Form.Item
              label="Gross Value of Promotion"
              name="grossValue"
              rules={[
                { required: true },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const numValue = parseFloat(value);
                    if (isNaN(numValue)) {
                      return Promise.reject(
                        new Error("Please enter a valid number"),
                      );
                    }
                    if (numValue <= 0) {
                      return Promise.reject(
                        new Error("Gross value cannot be negative"),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                className="px-3 mli-tall-input"
                placeholder="Enter Gross Value"
                type="number"
              />
            </Form.Item>
            <Form.Item
              label="Discount Percentage"
              name="discountPercentage"
              rules={[
                { required: true, message: "Discount percentage is required" },
                {
                  validator: (_, value) => {
                    if (value === undefined || value === null || value === "") {
                      return Promise.resolve();
                    }
                    const numValue = Number(value);
                    if (isNaN(numValue)) {
                      return Promise.reject(
                        new Error("Please enter a valid number"),
                      );
                    }
                    if (numValue < 0) {
                      return Promise.reject(
                        new Error("Discount percentage cannot be negative"),
                      );
                    }
                    if (numValue > 100) {
                      return Promise.reject(
                        new Error("Discount percentage cannot exceed 100%"),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                className="px-3 mli-tall-input"
                placeholder="Enter Discount Percentage (0-100)"
                type="number"
                min="0"
                max="100"
              />
            </Form.Item>
          </div>
        </div>

        <div className="w-full mb-4 mt-4">
          <div className="mb-2">
            <label className="text-sm font-medium">Select Promotion Days</label>
            <span className="text-red-500 ml-1">*</span>
          </div>
          <div className="mb-2">
            <Checkbox
              onChange={handleCheckAllChange}
              checked={checkAll}
              className="font-semibold"
            >
              All days
            </Checkbox>
          </div>
          <Form.Item
            name="promotionDays"
            rules={[
              { required: true, message: "Please select at least one day" },
            ]}
          >
            <Checkbox.Group
              options={daysOptions}
              onChange={handleDaysChange}
              className="flex gap-2"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="image"
          label="Upload Image (JPG/PNG only)"
          className="mt-6"
          rules={[
            {
              validator: (_, value) => {
                // If editing and there's already an image, it's not required
                if (isEdit && uploadedImage.length > 0) {
                  return Promise.resolve();
                }
                // For new promotions or if image was removed, require upload
                if (!uploadedImage || uploadedImage.length === 0) {
                  return Promise.reject(new Error("Please upload an image"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Upload
            listType="picture"
            fileList={uploadedImage}
            beforeUpload={(file) => {
              // Allow only JPG or PNG
              const isJpgOrPng =
                file.type === "image/jpeg" || file.type === "image/png";
              if (!isJpgOrPng) {
                message.error("You can only upload JPG/PNG files!");
              }

              // Limit file size to 2MB
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                message.error("Image must be smaller than 2MB!");
              }

              // Only accept file if both conditions are true
              return isJpgOrPng && isLt2M;
            }}
            onChange={handleUploadChange}
            onRemove={() => {
              setUploadedImage([]);
              form.setFieldsValue({ image: [] });
            }}
            maxCount={1}
            accept=".jpg,.jpeg,.png" // Restrict file picker to JPG/PNG
          >
            <Button icon={<UploadOutlined />}>
              {uploadedImage.length > 0 ? "Replace Image" : "Click to Upload"}
            </Button>
          </Upload>
          <p className="text-sm text-gray-500 mt-1">
            Allowed file types: JPG, PNG. Maximum file size: 2MB.
          </p>
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" className="bg-primary">
            {isEdit ? "Update" : "Save"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewCampaign;
