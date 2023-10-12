import React, { useEffect, useState } from "react";
import "./index.css";
import { Space, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "./axiosInstance";
import axios from "axios";
import { useCopyToClipboard } from "./usehooks";
interface DataType {
  id: number;
  name: string;
  token: number;
  zalo_name: string;
  webhook_id: number;
  created_at: Date;
  zalo_number_targets: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: "STT",
    dataIndex: "id",
    key: "id",
    render: (text) => <Space>{text}</Space>,
  },
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
    render: (text) => <Space>{text}</Space>,
  },
  {
    title: "Zalo Name",
    dataIndex: "zalo_name",
    key: "zalo_name",
  },
  {
    title: "Zalo Number Target",
    dataIndex: "zalo_number_target",
    key: "zalo_number_target",
  },
  {
    title: "Token",
    key: "toekn",
    dataIndex: "token",
    render: (text) => (
      <Tag color="geekblue" onClick={() => {}}>
        {text}
      </Tag>
    ),
  },
  {
    title: "Webhook ID",
    dataIndex: "webhook_id",
    key: "webhook_id",
    render: (text) => <Space>{text}</Space>,
  },
  {
    title: "Ngày tạo",
    key: "created_at",
    dataIndex: "created_at",
    render: (text) => <Space>{text}</Space>,
  },
];
export const Agents = () => {
  const [datasource, setdata] = useState<DataType[]>([]);
  const [value, copy] = useCopyToClipboard();
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios
      .get("https://z-image-cdn.com/agents", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => {});
  });
  return <Table columns={columns} dataSource={datasource} />;
};
export default Agents;
