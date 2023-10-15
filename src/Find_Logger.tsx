import React, {  useState } from "react";
import "./index.css";
import { Space, Table, Button, Form, Input, Tag,message } from "antd";
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
    render: (text) =>  <Tag color="processing">{text}</Tag>,
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
    
  },{
    title: "File name",
    key: "filename",
    dataIndex: "filename",
    render: (text) => <Space>{text}</Space>,
  },
  {
    title: "Ngày tạo",
    key: "created_at",
    dataIndex: "created_at",
    render: (text) => <Space>{text}</Space>,
  },
  {
    title: "Timestamp",
    key: "time_stamp",
    dataIndex: "time_stamp",
    render: (text) => <Space>{text}</Space>,
  },{
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
const Filter = () => {
  const [datasource, setdata] = useState<DataType[]>([]);
 
  const [form] = Form.useForm();

  const onFinish = (value: any) => {
    const token = localStorage.getItem("access_token");
    axios
          .get(`https://z-image-cdn.com/logger/token/${value.key}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setdata(response.data);
          })
          .catch((error) => { });
  };

  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  const onFill = () => {
    let id=form.getFieldValue("id")
    const token = localStorage.getItem("token");
    axios
          .get(`https://z-image-cdn.com/logger/${id}?token=${token}`)
          .then((response) => {
            console.log(response.data);
            setdata(response.data);
          })
          .catch((error) => { });

  };
  return (<div>
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        name="key"
        label="Token String"
        rules={[{ required: true }, { type: 'string', warningOnly: true }, { type: 'string', min: 6 }]}
      >
        <Input placeholder="input placeholder" style={{width:'300px'}}/>
      </Form.Item>
      <Form.Item
        name="id"
        label="ID"
        rules={[{ type: 'string', warningOnly: true }, { type: 'string', max:4 }]}
      >
        <Input placeholder="input placeholder" style={{width:'300px'}}/>
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Tìm theo Token
          </Button>
          <Button htmlType="button" onClick={onFill}>
            Tìm theo ID
          </Button>
        </Space>
      </Form.Item>
    </Form>
    <Table  columns={columns} dataSource={datasource} pagination={{ pageSize: 30 }}/>
  </div>
  );
};
export default Filter
