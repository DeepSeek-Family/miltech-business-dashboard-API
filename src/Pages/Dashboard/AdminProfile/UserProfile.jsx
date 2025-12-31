import { UploadOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  notification,
  Select,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { useUser } from "../../../provider/User";
import { useUpdateProfileMutation } from "../../../redux/apiSlices/authSlice";
import { getImageUrl } from "../../../components/common/imageUrl";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const { Option } = Select;
const { TextArea } = Input;

const countryCityData = {
  Bahrain: ["Manama"],
  Bangladesh: ["Dhaka"],
  Kuwait: ["Kuwait City"],
  Oman: ["Muscat"],
  Pakistan: [
    "Islamabad",
    "Karachi",
    "Lahore",
    "Peshawar",
    "Quetta",
    "Rawalpindi",
  ],
  Qatar: ["Doha"],
  "Saudi Arabia": ["Jeddah", "Riyadh"],
  "United Arab Emirates": [
    "Abu Dhabi",
    "Ajman",
    "Dubai",
    "Fujairah",
    "Ras Al Khaimah",
    "Sharjah",
    "Umm Al Quwain",
  ],
  "United Kingdom": [
    "Birmingham",
    "Glasgow",
    "Liverpool",
    "London",
    "Manchester",
  ],
};

const UserProfile = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [coverFileList, setCoverFileList] = useState([]);
  const [logoFileList, setLogoFileList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const { user } = useUser();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  console.log(user);

  // Use actual user data from context
  useEffect(() => {
    if (user) {
      const userCountry = user.country || "";
      form.setFieldsValue({
        username: user.firstName || "",
        businessName: user.businessName || "",
        email: user.email || "",
        contact: user.phone || "",
        url: user.website || "",
        address: user.address || "",
        service: user.service || "",
        location: user.location || "",
        country: userCountry,
        city: user.city || "",
        about: user.about || "",
        coverPhoto: user.coverPhoto || "",
        profile: user.profile || "",
      });
      if (userCountry) {
        setSelectedCountry(userCountry);
      }

      // Set profile image if available
      if (user.profile) {
        const imageSource = getImageUrl(user.profile);
        setImageUrl(imageSource);
        setFileList([
          {
            uid: "-1",
            name: "profile.jpg",
            status: "done",
            url: imageSource,
          },
        ]);
      }
    }
  }, [user, form]);

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const onFinish = async (values) => {
    try {
      const profileFile =
        fileList.length > 0 ? fileList[0].originFileObj : null;
      const coverFile =
        coverFileList.length > 0 ? coverFileList[0].originFileObj : null;
      const logoFile =
        logoFileList.length > 0 ? logoFileList[0].originFileObj : null;

      // Create FormData for files
      const formData = new FormData();

      // Append text data
      formData.append("firstName", values.username);
      formData.append("businessName", values.businessName);
      formData.append("email", values.email);
      formData.append("phone", values.contact);
      formData.append("website", values.url);
      formData.append("address", values.address);
      formData.append("service", values.service);
      formData.append("country", values.country);
      formData.append("city", values.city);
      formData.append("about", values.about);

      // Append files
      if (profileFile) {
        formData.append("profile", profileFile);
      }

      if (coverFile) {
        formData.append("coverPhoto", coverFile);
      }

      if (logoFile) {
        formData.append("profile", logoFile);
      }

      console.log("Form Data to send:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      await updateProfile(formData).unwrap();

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Profile updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error?.data?.message || "Failed to update profile",
        timer: 2000,
        showConfirmButton: false,
      });
      console.error("Error updating profile:", error);
    }
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    const limitedFileList = newFileList.slice(-1);
    setFileList(limitedFileList);

    if (limitedFileList.length > 0 && limitedFileList[0].originFileObj) {
      const newImageUrl = URL.createObjectURL(limitedFileList[0].originFileObj);

      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }

      setImageUrl(newImageUrl);
    } else {
      setImageUrl(null);
    }
  };

  const handleCoverImageChange = ({ fileList: newFileList }) => {
    const limitedFileList = newFileList.slice(-1);
    setCoverFileList(limitedFileList);
  };

  const handleLogoImageChange = ({ fileList: newFileList }) => {
    const limitedFileList = newFileList.slice(-1);
    setLogoFileList(limitedFileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      notification.error({
        message: "Invalid File Type",
        description: "Please upload an image file.",
      });
    }

    const isLessThan2MB = file.size / 1024 / 1024 < 2;
    if (!isLessThan2MB) {
      notification.error({
        message: "File too large",
        description: "Image must be smaller than 2MB.",
      });
    }

    return isImage && isLessThan2MB;
  };

  return (
    <div className="flex justify-center items-center shadow-xl rounded-lg pt-5 pb-4">
      <Form
        form={form}
        layout="vertical"
        style={{ width: "80%" }}
        onFinish={onFinish}
        encType="multipart/form-data"
      >
        <div className="flex flex-col">
          {/* Profile Image */}
          <div className="col-span-2 flex justify-start items-center gap-5 mb-5">
            <Form.Item style={{ marginBottom: 0 }}>
              <Upload
                name="avatar"
                showUploadList={false}
                action="/upload"
                onChange={handleImageChange}
                beforeUpload={beforeUpload}
                fileList={fileList}
                listType="picture-card"
                maxCount={1}
              >
                {imageUrl ? (
                  <Avatar size={100} src={imageUrl} />
                ) : (
                  <Avatar size={100} icon={<UploadOutlined />} />
                )}
              </Upload>
            </Form.Item>
            <h2 className="text-[24px] font-bold">{user?.businessName}</h2>
          </div>
          <div className="flex justify-between gap-5">
            <div className="w-full flex flex-col gap-4">
              {/* Username */}
              <Form.Item
                name="username"
                label="Full Name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input
                  placeholder="Enter your full name"
                  className="mli-tall-input"
                />
              </Form.Item>

              {/* Comapany */}
              <Form.Item
                name="businessName"
                label="Business Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter your business name",
                  },
                ]}
              >
                <Input
                  placeholder="Enter your business name"
                  className="mli-tall-input"
                />
              </Form.Item>

              {/* Email */}
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  placeholder="Enter your email"
                  className="mli-tall-input"
                  disabled
                />
              </Form.Item>
              {/* Phone Number */}
              <Form.Item
                name="contact"
                label="Phone Number"
                style={{ marginBottom: 0 }}
                rules={[
                  { required: true, message: "Please enter your phone number" },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      // Validate that it's a valid phone number format
                      if (
                        !/^\+?[1-9]\d{1,14}$/.test(value.replace(/\D/g, ""))
                      ) {
                        return Promise.reject(
                          new Error("Please enter a valid phone number")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  countries={[
                    "PK",
                    "AE",
                    "OM",
                    "QA",
                    "KW",
                    "BH",
                    "SA",
                    "BD",
                    "GB",
                  ]}
                  value={phoneValue}
                  onChange={(value) => {
                    setPhoneValue(value);
                    form.setFieldValue("contact", value);
                  }}
                  placeholder="Enter your phone number"
                  className="phone-input-no-focus"
                  style={{
                    height: 40,
                    border: "1px solid #d8d8d8",
                    borderRadius: "8px",
                    paddingLeft: "12px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                  }}
                />
              </Form.Item>
            </div>
            <div className="w-full flex flex-col gap-4">
              {/* Website URL */}
              <Form.Item
                name="url"
                label="Website URL"
                rules={[
                  { required: true, message: "Please enter your website URL" },
                ]}
              >
                <Input
                  placeholder="Enter your website URL"
                  className="mli-tall-input"
                />
              </Form.Item>

              {/* Service Dropdown */}
              <Form.Item
                name="service"
                label="Services"
                rules={[
                  { required: true, message: "Please select your service" },
                ]}
              >
                <Select
                  placeholder="Select your service"
                  className="mli-tall-select"
                >
                  <Option value="Food & beverages">Food & beverages</Option>
                  <Option value="Apparel and Footwear">
                    Apparel and Footwear
                  </Option>
                  <Option value="Accessories">Accessories</Option>
                  <Option value="Health & Beauty">Health & Beauty</Option>
                  <Option value="Salons & Spas">Salons & Spas</Option>
                  <Option value="Leisure & Entertainment">
                    Leisure & Entertainment
                  </Option>
                  <Option value="Home & Living">Home & Living</Option>
                  <Option value="Education">Education</Option>
                  <Option value="Electronics">Electronics</Option>
                  <Option value="Toys & Gifts">Toys & Gifts</Option>
                  <Option value="Travel & Tour">Travel & Tour</Option>
                  <Option value="Other Services">Other Services</Option>
                </Select>
              </Form.Item>

              {/* Country */}
              <Form.Item
                name="country"
                label="Country"
                rules={[
                  { required: true, message: "Please select your country" },
                ]}
              >
                <Select
                  placeholder="Select your country"
                  showSearch
                  optionFilterProp="children"
                  className="mli-tall-select"
                  onChange={(value) => {
                    setSelectedCountry(value);
                    form.setFieldValue("city", undefined);
                  }}
                >
                  {Object.keys(countryCityData).map((country) => (
                    <Option key={country} value={country}>
                      {country}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* State */}
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: "Please select your City" }]}
              >
                <Select
                  placeholder="Select your city"
                  showSearch
                  optionFilterProp="children"
                  className="mli-tall-select"
                  disabled={!selectedCountry}
                >
                  {selectedCountry &&
                    countryCityData[selectedCountry].map((city) => (
                      <Option key={city} value={city}>
                        {city}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* Address */}
          <Form.Item
            name="address"
            label="Address"
            className="mt-4"
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input
              placeholder="Enter your address"
              className="mli-tall-input"
            />
          </Form.Item>

          {/* Upload Section - Logo and Cover Photo */}
          <div className="mt-4 flex gap-5 justify-between">
            {/* Upload Merchant Cover Photo */}
            <div className="flex-1">
              <Form.Item
                name="coverImage"
                label="Upload Merchant Cover Photo"
                rules={[
                  {
                    required: false,
                    message: "Please upload an image (JPG/PNG only)",
                  },
                ]}
              >
                <Upload
                  beforeUpload={(file) => {
                    const isJpgOrPng =
                      file.type === "image/jpeg" || file.type === "image/png";
                    if (!isJpgOrPng) {
                      message.error("You can only upload JPG/PNG files!");
                      return Upload.LIST_IGNORE;
                    }

                    const isLessThan2MB = file.size / 1024 / 1024 < 2;
                    if (!isLessThan2MB) {
                      message.error("Image must be smaller than 2MB!");
                      return Upload.LIST_IGNORE;
                    }

                    return false;
                  }}
                  onChange={handleCoverImageChange}
                  maxCount={1}
                  accept=".jpg,.jpeg,.png"
                  className="w-full"
                  fileList={coverFileList}
                >
                  <div
                    style={{
                      width: "100%",
                      padding: "16px",
                      border: "2px dashed #3FAE6A",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      background: "#f9f9f9",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f0f9f6";
                      e.currentTarget.style.borderColor = "#2d8659";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#f9f9f9";
                      e.currentTarget.style.borderColor = "#3FAE6A";
                    }}
                  >
                    <UploadOutlined
                      style={{ color: "#3FAE6A", fontSize: "18px" }}
                    />
                    <div style={{ textAlign: "left" }}>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: "600",
                          color: "#1E1E1E",
                        }}
                      >
                        Click to upload or drag and drop
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0 0",
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        JPG/PNG, max 2MB
                      </p>
                    </div>
                  </div>
                </Upload>
              </Form.Item>
            </div>
            {/* Upload Merchant Logo */}
            {/* <div className="flex-1">
              <Form.Item
                name="image"
                label="Upload Merchant Logo"
                rules={[
                  {
                    required: false,
                    message: "Please upload an image (JPG/PNG only)",
                  },
                ]}
              >
                <Upload
                  beforeUpload={(file) => {
                    const isJpgOrPng =
                      file.type === "image/jpeg" || file.type === "image/png";
                    if (!isJpgOrPng) {
                      message.error("You can only upload JPG/PNG files!");
                      return Upload.LIST_IGNORE;
                    }

                    const isLessThan2MB = file.size / 1024 / 1024 < 2;
                    if (!isLessThan2MB) {
                      message.error("Image must be smaller than 2MB!");
                      return Upload.LIST_IGNORE;
                    }

                    return false;
                  }}
                  onChange={handleLogoImageChange}
                  maxCount={1}
                  accept=".jpg,.jpeg,.png"
                  className="w-full"
                  fileList={logoFileList}
                >
                  <div
                    style={{
                      width: "100%",
                      padding: "16px",
                      border: "2px dashed #3FAE6A",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      background: "#f9f9f9",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f0f9f6";
                      e.currentTarget.style.borderColor = "#2d8659";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#f9f9f9";
                      e.currentTarget.style.borderColor = "#3FAE6A";
                    }}
                  >
                    <UploadOutlined
                      style={{ color: "#3FAE6A", fontSize: "18px" }}
                    />
                    <div style={{ textAlign: "left" }}>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: "600",
                          color: "#1E1E1E",
                        }}
                      >
                        Click to upload or drag and drop
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0 0",
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        JPG/PNG, max 2MB
                      </p>
                    </div>
                  </div>
                </Upload>
              </Form.Item>
            </div> */}
          </div>

          {/* Company About Us */}
          <Form.Item
            name="about"
            label="Company About Us"
            rules={[
              { required: true, message: "Please describe your company" },
            ]}
            className="mt-4"
          >
            <TextArea
              placeholder="Write about your company"
              className="mli-tall-input"
              style={{
                minHeight: "120px",
                resize: "vertical",
              }}
            />
          </Form.Item>

          {/* Update Profile Button */}
          <div className="col-span-2 text-end mt-6 mb-8">
            <Form.Item>
              <Button
                htmlType="submit"
                block
                style={{ height: 40 }}
                className="bg-primary px-8 py-5 rounded-lg text-white hover:text-secondary text-[17px] font-bold"
                loading={isUpdating}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UserProfile;
