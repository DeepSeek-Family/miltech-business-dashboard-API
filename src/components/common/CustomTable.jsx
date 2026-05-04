import { Table } from "antd";

const tableComponents = {
  header: {
    row: (props) => (
      <tr
        {...props}
        style={{
          backgroundColor: "#f0f5f9",
          height: "50px",
          color: "secondary",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
    cell: (props) => (
      <th
        {...props}
        style={{
          color: "secondary",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
  },
};

const ReusableTable = ({
  data,
  columns,
  isLoading = false,
  isFetching = false,
  pagination = null,
  onPaginationChange = null,
  rowKey = "id",
}) => {
  return (
    <div className="overflow-x-auto">
      <Table
        dataSource={data}
        columns={columns}
        pagination={
          pagination
            ? {
                pageSize: pagination?.pageSize || 10,
                total: pagination?.total || 0,
                current: pagination?.current || 1,
                onChange: onPaginationChange,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} items`,
                style: { marginRight: "8px" },
              }
            : false
        }
        bordered={false}
        size="small"
        rowClassName="custom-row"
        components={tableComponents}
        className="custom-table [&_.ant-pagination]:flex [&_.ant-pagination]:justify-end [&_.ant-pagination]:mr-4"
        scroll={{ x: "max-content" }}
        loading={isLoading || isFetching}
        rowKey={rowKey}
      />
    </div>
  );
};

export default ReusableTable;
