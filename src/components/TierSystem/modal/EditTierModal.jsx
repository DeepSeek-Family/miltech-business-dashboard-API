import { Modal, Form, Input, Button, Select } from "antd";

const EditTierModal = ({
  visible,
  isAddMode,
  editingTier,
  form,
  isAdding,
  isUpdating,
  onCancel,
  onSave,
}) => {
  // Reset form when modal is opened in add mode
  const handleCancel = () => {
    if (isAddMode) {
      form.resetFields();
    }
    onCancel();
  };

  return (
    <Modal
      title={
        isAddMode ? "Add New Tier" : `Set Rules - ${editingTier?.name || ""}`
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          threshold: "",
          reward: 0,
          lockoutDuration: "",
          pointsSystemLockoutDuration: 0,
          minSpend: "",
        }}
        onFinish={onSave}
        className="flex flex-col gap-4"
      >
        <Form.Item label="Tier Name" name="name" rules={[{ required: true }]}>
          <Select
            placeholder="Select tier name"
            className="mli-tall-select"
            name="name"
            rules={[{ required: true, message: "Please enter tier name" }]}
          >
            <Option value="Gold Basic">Gold Basic</Option>
            <Option value="Gold Plus">Gold Plus</Option>
            <Option value="Platinum">Platinum</Option>
            <Option value="Platinum Plus">Platinum Plus</Option>
            <Option value="Diamond">Diamond</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Points Threshold"
          name="threshold"
          rules={[
            { required: true, message: "Please enter threshold" },
            {
              validator: (_, value) => {
                if (!value && value !== 0) return Promise.resolve();
                const numValue = parseFloat(value);
                if (isNaN(numValue)) {
                  return Promise.reject(
                    new Error("Please enter a valid number"),
                  );
                }
                if (numValue < 0) {
                  return Promise.reject(new Error("Value cannot be negative"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            type="number"
            placeholder="Enter points threshold"
            className="mli-tall-input"
            min="0"
          />
        </Form.Item>
        {/* <Form.Item
          label="Reward"
          name="reward"
          rules={[{ required: true, message: "Please enter reward" }]}
        >
          <Input
            type="number"
            placeholder="Enter reward"
            className="mli-tall-input"
          />
        </Form.Item> */}
        <Form.Item
          label="Point accumulation rule (%)"
          name="lockoutDuration"
          rules={[
            { required: true, message: "Please enter rule" },
            {
              validator: (_, value) => {
                if (!value && value !== 0) return Promise.resolve();
                const numValue = parseFloat(value);
                if (isNaN(numValue)) {
                  return Promise.reject(
                    new Error("Please enter a valid number"),
                  );
                }
                if (numValue < 0 || numValue > 100) {
                  return Promise.reject(
                    new Error("Value must be between 0 and 100"),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            type="number"
            placeholder="Enter point accumulation rule in %"
            className="mli-tall-input"
            min="0"
            max="100"
          />
        </Form.Item>
        {/* <Form.Item
          label="Point redemption rule"
          name="pointsSystemLockoutDuration"
          rules={[
            { required: true, message: "Please enter redemption rule" },
            {
              validator: (_, value) => {
                if (!value && value !== 0) return Promise.resolve();
                const numValue = parseFloat(value);
                if (isNaN(numValue)) {
                  return Promise.reject(
                    new Error("Please enter a valid number")
                  );
                }
                if (numValue < 0) {
                  return Promise.reject(new Error("Value cannot be negative"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input type="number" className="mli-tall-input" min="0" />
        </Form.Item> */}
        {/* <Form.Item
          label="Min Total Spend"
          name="minSpend"
          rules={[
            { required: true, message: "Please enter min spend" },
            {
              validator: (_, value) => {
                if (!value && value !== 0) return Promise.resolve();
                const numValue = parseFloat(value);
                if (isNaN(numValue)) {
                  return Promise.reject(
                    new Error("Please enter a valid number")
                  );
                }
                if (numValue < 0) {
                  return Promise.reject(new Error("Value cannot be negative"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input type="number" className="mli-tall-input" min="0" step="0.01" />
        </Form.Item> */}
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleCancel}
            className="border border-primary"
            disabled={isAdding || isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-primary text-white hover:text-secondary font-bold"
            loading={isAdding || isUpdating}
            disabled={isAdding || isUpdating}
          >
            {isAdding || isUpdating
              ? "Saving..."
              : isAddMode
                ? "Add Tier"
                : "Save Changes"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditTierModal;
