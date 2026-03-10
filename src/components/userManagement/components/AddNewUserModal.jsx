import React, { useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const { Option } = Select;

const AddNewUserModal = ({
  visible,
  onCancel,
  onSubmit,
  editingUser = null,
  roles = [],
}) => {
  const [form] = Form.useForm();

  const [phoneValue, setPhoneValue] = useState("");

  // Update form when editingUser changes
  React.useEffect(() => {
    if (editingUser) {
      form.setFieldsValue(editingUser);
    } else {
      form.resetFields();
    }
  }, [editingUser, form, visible]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={editingUser ? "Edit User" : "Add New User"}
      open={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={editingUser ? "Update User" : "Add User"}
      width={600}
    >
      <Form form={form} layout="vertical" className="flex flex-col gap-4 mb-6">
        <Form.Item
          name="firstName"
          label="User Name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input className="mli-tall-input" placeholder="Enter user name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                  return Promise.reject(
                    new Error("Please enter a valid email address"),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input className="mli-tall-input" placeholder="Enter email" />
        </Form.Item>
        {/* <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter phone number" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                // Allow phone numbers with digits, spaces, hyphens, parentheses, and + sign
                const phoneRegex =
                  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ""))) {
                  return Promise.reject(
                    new Error("Please enter a valid phone number"),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            className="mli-tall-input"
            placeholder="e.g., +1 (555) 123-4567"
          />
        </Form.Item> */}

        <Form.Item
          name="phone"
          label={<p>Phone Number</p>}
          rules={[
            { required: true, message: "Please enter your phone number" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                // Validate that it's a valid phone number format
                if (!/^\+?[1-9]\d{1,14}$/.test(value.replace(/\D/g, ""))) {
                  return Promise.reject(
                    new Error("Please enter a valid phone number"),
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
            countries={["PK", "AE", "OM", "QA", "KW", "BH", "SA", "BD", "GB"]}
            defaultCountry="PK"
            value={phoneValue}
            onChange={setPhoneValue}
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
        {!editingUser && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your new Password!",
              },
              {
                validator(_, value) {
                  if (!value) return Promise.resolve();

                  const hasUpperCase = /[A-Z]/.test(value);
                  const hasLowerCase = /[a-z]/.test(value);
                  const hasNumber = /\d/.test(value);
                  const hasSpecialChar =
                    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

                  if (
                    hasUpperCase &&
                    hasLowerCase &&
                    hasNumber &&
                    hasSpecialChar
                  ) {
                    return Promise.resolve();
                  }

                  const missing = [];
                  if (!hasUpperCase) missing.push("uppercase letter");
                  if (!hasLowerCase) missing.push("lowercase letter");
                  if (!hasNumber) missing.push("number");
                  if (!hasSpecialChar) missing.push("special character");

                  return Promise.reject(
                    new Error(
                      `Password must contain at least one ${missing.join(
                        ", one ",
                      )}`,
                    ),
                  );
                },
              },
            ]}
          >
            <Input.Password className="mli-tall-input" placeholder="********" />
          </Form.Item>
        )}
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select placeholder="Select role" className="mli-tall-select">
            <Option value="ADMIN_MERCENT">Admin</Option>
            <Option value="VIEW_MERCENT">User</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNewUserModal;
