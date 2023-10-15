import React, { useEffect, useState } from "react";
import "./index.css";
import { Space, Table, Button, Modal, Form, Input, message, Select, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import Image from "./image"
interface DataType {
  id: number;
  name: string;
  token: number;
  zalo_name: string;
  webhook_id: number;
  created_at: Date;
  zalo_number_targets: number;
}
interface Webhooks {
  id: number;
  url_webhook: string;
  webhook_name: string;
}
const { Option } = Select;
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
    render: (text) => <Tag color="magenta">{text}</Tag>,
  },
  {
    title: "Zalo Name",
    dataIndex: "zalo_name",
    key: "zalo_name",
    render: (text) => <Tag color="purple">{text}</Tag>,
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
      <Image name={text} />
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
  const [form] = Form.useForm();
  const [datasource, setdata] = useState<DataType[]>([]);
  const [webhooks, setwebhooks] = useState<Webhooks[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
    const token = localStorage.getItem("access_token");
    axios
      .get("https://z-image-cdn.com/webhooks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setwebhooks(response.data);
      })
      .catch((error) => { });
  };
  const SelectChange=(value:number)=>{
      form.setFieldValue('id', value);
  }
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
      // console.log(values);
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
      .get("https://z-image-cdn.com/agents", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => { });
  }, []);
  return (<div>
    <Button onClick={() => { showModal() }} type="primary" style={{ marginBottom: 16 }}>
      Thêm Agents
    </Button>
    <Table columns={columns} dataSource={datasource} />
    <Modal title="Basic Modal" open={isModalOpen} onCancel={handleCancel}>
      <Form
        {...layout}
        form={form}
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
          <Select
            placeholder="Lựa chọn webhook bắn dữ liệu"
            onChange={SelectChange}
            allowClear
          >
            {webhooks&&webhooks.map((webhook:Webhooks, index:number)=>{
              return (
                <Option value={webhook.id}>{webhook.webhook_name}</Option>
              )
            })
            
          }
          </Select>
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
