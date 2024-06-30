import React, { useEffect, useState } from "react";
import "./index.css";
import { Space, Table, Button, Modal, Form, Tag, Input, InputNumber, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import Image from "./image"
interface DataType {
  id: number;
  ip: string;
  ip_info: string;
  user_agents: number;
  token: string;
  device: number;
  filename: string;
  time_stamp: string;
  created_at: Date;
}
const convertTime = (value: string) => {
  const inputDate = value;
  const date = new Date(inputDate);
  date.setHours(date.getHours() + 7);
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  const outputDate = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  return outputDate;
}
function formatDateTime(datetimeStr: string): string {
  // Parse the ISO 8601 string into a Date object (assuming the datetimeStr is in UTC)
  const dt = new Date(datetimeStr);

  // Adjust the date to UTC+7 timezone
  dt.setHours(dt.getHours() + 7);

  // Extract the date components
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(dt.getDate()).padStart(2, "0");

  // Extract the time components
  const hours = String(dt.getHours()).padStart(2, "0");
  const minutes = String(dt.getMinutes()).padStart(2, "0");
  const seconds = String(dt.getSeconds()).padStart(2, "0");

  // Combine time and date in the desired format
  const formattedStr = `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;

  return formattedStr;
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
    dataIndex: "ip",
    key: "ip",
    render: (text) => <Tag color="processing">{text}</Tag>,
  },
  {
    title: "IP INFO",
    dataIndex: "ip_info",
    key: "ip_info",
  },
  {
    title: "Trình duyệt",
    dataIndex: "user_agents",
    key: "user_agents",
  },
  {
    title: "Token",
    key: "token",
    dataIndex: "token",
    render: (text) => (
      <Image name={text} />
    ),
  },
  {
    title: "Thiết bị",
    dataIndex: "device",
    key: "device",
    render: (text) => <Space>{text}</Space>,

  }, {
    title: "File name",
    key: "filename",
    dataIndex: "filename",
    render: (text) => <Space>{text}</Space>,
  },
  {
    title: "Timestamp",
    key: "time_stamp",
    dataIndex: "time_stamp",
    render: (text) => <Space>{formatDateTime(text)}</Space>,
  },
  {
    title: "Hành động",
    dataIndex: "action",
    render: (text: any, Item: DataType) => <Button onClick={() => {
      let ip_info= JSON.parse(Item.ip_info.replace(/'/g, '"').replace(/False/g, 'false').replace(/True/g, 'true'));
      let info=  `1. IP: ${Item.ip} - Time: ${convertTime(Item.time_stamp)} \n2. Khu vực: ${ip_info['city']} - ${ip_info['regionName']} - ${ip_info['country']}\n3. Thông tin thiết bị: user_agent:${Item.user_agents} - device: ${Item.device}\n4. Nhà cung cấp dịch vụ: ${ip_info['isp']}\n5. Di động: ${ip_info['mobile']}, Proxy: ${ip_info['proxy']}, Hosting: ${ip_info['hosting']}\n`
      try {
        navigator.clipboard.writeText(info)
        message.success('Đã copy kết quả')
      } catch (error) {
        console.warn('Copy failed', error)
        message.success('Không thể copy kết quả')
      }
    }}>Copy</Button>,
  }
];
export const Agents = () => {
  const [datasource, setdata] = useState<DataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = (values: any) => {
    const token = localStorage.getItem("access_token");
    axios
      .post("https://z-image-cdn.com/agents/add", values, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Access-Control-Allow-Headers, Content-Type, Authorization",
          "Access-Control-Allow-Methods": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      })
      .then((response) => {
        if (response.status === 200) {
          message.success('Thêm thành công')
          setIsModalOpen(false);
        } else {
          message.error('Thêm thất bại')
        }
      })
      .catch((error) => {


      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios
      .get("https://z-image-cdn.com/logger", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => { });
  }, []);
  return (<div>
    <Table columns={columns} dataSource={datasource} pagination={{ pageSize: 50 }} />
    <Modal title="Basic Modal" open={isModalOpen} onCancel={handleCancel}>
      <Form
        {...layout}
        name="nest-messages"
        onFinish={handleOk}
        style={{ maxWidth: 600 }}
        validateMessages={validateMessages}
      >
        <Form.Item name='name' label="Webhooks Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name='zalo_name' label="Zalo name" >
          <Input />
        </Form.Item>
        <Form.Item name='webhook_id' label="ID Webhooks" rules={[{ type: 'number', min: 0, max: 99 }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item name='zalo_number_target' label="Zalo number target">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  </div>
  );
};
export default Agents;
