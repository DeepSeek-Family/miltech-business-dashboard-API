import { Button, Form, Input, message } from "antd";
import { useChangePasswordMutation } from "../../../redux/apiSlices/authSlice";

const ChangePassword = () => {
  const [form] = Form.useForm();

  const [changePassword, { isLoading: isChanging }] =
    useChangePasswordMutation();

  const handleChangePassword = async (values) => {
    // Map form fields (snake_case) to backend expected camelCase keys
    const payload = {
      currentPassword: values.current_password,
      newPassword: values.new_password,
      confirmPassword: values.confirm_password,
    };

    try {
      await changePassword(payload).unwrap();
      message.success("Password updated successfully");
      form.resetFields();
    } catch (err) {
      const errMsg =
        err?.data?.message || err?.message || "Failed to change password";
      message.error(errMsg);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col justify-start px-[100px] pt-5 pb-10 shadow-xl">
        <h2 className="text-2xl font-bold mb-5">Update Password</h2>
        <div>
          <Form
            form={form}
            layout="vertical"
            // className="lg:ms-[50px] pe-[30px] mt-[30px]"
            initialValues={{
              remember: true,
            }}
            style={
              {
                // width: "80%",
              }
            }
            onFinish={handleChangePassword}
          >
            <div className="mb-[20px] w-[100%]">
              <Form.Item
                style={{ marginBottom: 0 }}
                name="current_password"
                label={<p style={{ display: "block" }}>Current Password</p>}
                rules={[
                  {
                    required: true,
                    message: "Please input your current password!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter Password"
                  type="password"
                  style={{
                    border: "1px solid #d8d8d8",
                    height: "45px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>

            <div className="mb-[20px] w-[100%]">
              <Form.Item
                name="new_password"
                label={<p style={{ display: "block" }}>New Password</p>}
                dependencies={["current_password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please enter your new password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject(
                          new Error("Please enter your new password!")
                        );
                      }
                      if (getFieldValue("current_password") === value) {
                        return Promise.reject(
                          new Error(
                            "New password must be different from current password"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input.Password
                  type="password"
                  placeholder="Enter password"
                  style={{
                    border: "1px solid #d8d8d8",
                    height: "45px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>

            <div className="mb-[40px] w-[100%]">
              <Form.Item
                name="confirm_password"
                label={<p style={{ display: "block" }}>Confirm Password</p>}
                style={{ marginBottom: 0 }}
                dependencies={["new_password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The new password that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  type="password"
                  placeholder="Enter password"
                  style={{
                    border: "1px solid #d8d8d8",
                    height: "45px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>

            {/* Center the Button using Flexbox */}
            <div className="flex justify-center mb-[20px] w-full">
              <Form.Item className="w-full">
                <Button
                  htmlType="submit"
                  block
                  className="bg-primary px-8 py-5 rounded-lg text-white hover:text-secondary text-[17px] font-bold"
                >
                  Update Your Password
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
