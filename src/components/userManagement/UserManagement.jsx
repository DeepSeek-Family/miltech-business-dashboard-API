import { useState, useMemo } from "react";
import { Button, Modal, Form, Input, Select } from "antd";
import Swal from "sweetalert2";
import AddNewUserModal from "./components/AddNewUserModal";
import UserTableColumn from "./components/UserTableColumn";
import {
  useDeleteUserMutation,
  useGetUserListQuery,
  useUpdateUserApprovalStatusMutation,
  useUpdateUserStatusMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../redux/apiSlices/userManagaementSlice";
import { useUser } from "../../provider/User";

const { Option } = Select;

const UserManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { user } = useUser();

  const queryParams = [
    { name: "page", value: page },
    { name: "limit", value: limit },
  ];
  if (searchText.trim()) {
    queryParams.push({ name: "searchTerm", value: searchText.trim() });
  }

  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useGetUserListQuery(queryParams);

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUserStatus, { isLoading: isUpdatingStatus }] =
    useUpdateUserStatusMutation();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  console.log(response);

  const tableData = useMemo(() => {
    const items = response?.data?.users || [];
    return items.map((item, index) => ({
      key: item._id,
      recordId: item._id,
      si: index + 1 + (page - 1) * limit,
      id: item.userId,
      firstName: item.firstName || "-",
      email: item.email || "-",
      password: "******",
      phone: item.phone || "-",
      role:
        item.role === "ADMIN_MERCENT"
          ? "Admin"
          : item.role === "VIEW_MERCENT"
          ? "User"
          : item.role || "-",
      createdAt: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "-",
      status: item.status === "active" ? "Active" : "Inactive",
      raw: item,
    }));
  }, [response, page, limit]);

  const paginationData = {
    pageSize: limit,
    total: response?.pagination?.total || 0,
    current: page,
  };

  const [roles] = useState(["ADMIN_MERCENT", "VIEW_MERCENT"]);

  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [roleForm] = Form.useForm();

  // Open modal for editing
  const handleEditUser = (record) => {
    setEditingUser(record);
    setIsUserModalVisible(true);
  };

  // Close modal and reset
  const handleCloseUserModal = () => {
    setIsUserModalVisible(false);
    setEditingUser(null);
  };

  // Add Role
  const handleAddRole = () => {
    roleForm.validateFields().then((values) => {
      setRoles((prev) => [...prev, values.roleName]);
      Swal.fire({
        title: "Role Added!",
        text: `Role "${values.roleName}" has been successfully added.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      roleForm.resetFields();
      setIsRoleModalVisible(false);
    });
  };

  // Handle Add/Edit User submission
  const handleSubmitUser = async (values) => {
    try {
      if (editingUser) {
        // Update existing user
        await updateUser({ id: editingUser.recordId, ...values }).unwrap();
        Swal.fire({
          title: "Updated!",
          text: "User details have been updated successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // Add new user
        await createUser(values).unwrap();
        Swal.fire({
          title: "User Added!",
          text: `${values.name} has been added successfully.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      handleCloseUserModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed to save user.",
      });
    }
  };

  // Handle delete user
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id).unwrap();
      Swal.fire({
        title: "Deleted!",
        text: "User has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed to delete user.",
      });
    }
  };

  // Handle status change
  const handleStatusChange = async (id, status) => {
    try {
      await updateUserStatus({
        id,
        status: status.toLowerCase(),
      }).unwrap();
      Swal.fire({
        title: "Updated!",
        text: `Status has been changed to ${status}.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed to update status.",
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 sm:gap-0 mb-4">
        <div>
          <h1 className="text-[24px] font-bold">User Management</h1>
          <p className="text-[16px] font-normal mt-2">
            Access your account securely with your login credentials.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => setIsUserModalVisible(true)}
            className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
            disabled={user?.role === "VIEW_MERCENT"}
          >
            Add New User
          </Button>
        </div>
      </div>

      <UserTableColumn
        data={tableData}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={paginationData}
        onPaginationChange={(nextPage, nextPageSize) => {
          setPage(nextPage);
          if (nextPageSize !== limit) {
            setLimit(nextPageSize);
          }
        }}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onStatusChange={handleStatusChange}
      />

      {/* Add New Role Modal */}
      <Modal
        title="Add New Role"
        open={isRoleModalVisible}
        onCancel={() => setIsRoleModalVisible(false)}
        onOk={handleAddRole}
        okText="Add Role"
      >
        <Form
          form={roleForm}
          layout="vertical"
          className="flex flex-col gap-4 mb-6"
        >
          <Form.Item
            name="roleName"
            label="Role Name"
            rules={[{ required: true, message: "Please enter role name" }]}
          >
            <Input placeholder="Enter role name" className="mli-tall-input" />
          </Form.Item>
          <Form.Item name="status" label="Select Page Access Control">
            <Select className="mli-tall-select">
              <Option value="Active">Full</Option>
              <Option value="Inactive">Dashboard</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add/Edit User Modal */}
      <AddNewUserModal
        visible={isUserModalVisible}
        onCancel={handleCloseUserModal}
        onSubmit={handleSubmitUser}
        editingUser={editingUser}
        roles={roles}
      />
    </div>
  );
};

export default UserManagement;
