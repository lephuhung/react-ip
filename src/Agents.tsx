import React, { useEffect, useState } from "react";
import "./index.css";
import {
  Space,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  Tag,
  Card,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "./axiosInstance";
import Image from "./image";
interface DataType {
  id: number;
  name: string;
  token: number;
  zalo_name: string;
  webhook_id: number;
  created_at: Date;
  zalo_number_target: number;
}
interface Webhooks {
  id: number;
  url_webhook: string;
  webhook_name: string;
}
const { Option } = Select;
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
    key: "token",
    dataIndex: "token",
    render: (text) => <Image name={text} />,
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
    render: (text) => <Space>{formatDateTime(text)}</Space>,
  },
];
export const Agents = () => {
  const [form] = Form.useForm();
  const [datasource, setdata] = useState<DataType[]>([]);
  const [webhooks, setwebhooks] = useState<Webhooks[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
    axios
      .get("https://z-image-cdn.com/webhooks")
      .then((response) => {
        setwebhooks(response.data);
      })
      .catch((error) => {});
  };
  const SelectChange = (value: number) => {
    form.setFieldValue("id", value);
  };
  const handleOk = () => {
    form.validateFields().then((values) => {
      axios
        .post("https://z-image-cdn.com/agents/add", values)
        .then((response) => {
          if (response.status === 200) {
            message.success("Thêm thành công");
            setIsModalOpen(false);
          } else {
            message.error("Thêm thất bại");
          }
        })
        .catch((error) => {
          console.error("Add agent failed", error);
        });
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
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  useEffect(() => {
    axios
      .get("https://z-image-cdn.com/agents")
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => {});
  }, [isModalOpen]);
  return (
    <div>
      <Button
        onClick={() => {
          showModal();
        }}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Thêm Agents
      </Button>

      {/* PC View */}
      <div className="desktop-only">
        <Table columns={columns} dataSource={datasource} />
      </div>

      {/* Mobile View */}
      <div className="mobile-only">
        {datasource && datasource.length > 0 ? (
          datasource.map((item) => (
            <Card 
              key={item.id}
              style={{ marginBottom: '12px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
              bodyStyle={{ padding: '16px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{item.name}</span>
                  <span style={{ marginLeft: '8px', color: '#8c8c8c', fontSize: '12px' }}>#{item.id}</span>
                </div>
                <Tag color="purple">{item.zalo_name}</Tag>
              </div>
              <div style={{ fontSize: '13px', color: '#555', marginBottom: '10px', lineHeight: '1.6' }}>
                <div><strong>Zalo Target:</strong> {item.zalo_number_target}</div>
                <div><strong>Webhook ID:</strong> {item.webhook_id}</div>
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong>Token:</strong> <Image name={item.token as any} />
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#bfbfbf', textAlign: 'right' }}>
                {formatDateTime(item.created_at as any)}
              </div>
            </Card>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Không có dữ liệu Agents</div>
        )}
      </div>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
          {...layout}
          form={form}
          name="nest-messages"
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
        >
          <Form.Item
            name="name"
            label="Webhooks Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="zalo_name" label="Zalo name">
            <Input />
          </Form.Item>
          <Form.Item
            name="webhook_id"
            label="ID Webhooks"
            rules={[{ type: "number", min: 0, max: 2000 }]}
          >
            <Select
              placeholder="Lựa chọn webhook bắn dữ liệu"
              onChange={SelectChange}
              allowClear
            >
              {webhooks &&
                webhooks.map((webhook: Webhooks) => {
                  return (
                    <Option key={webhook.id} value={webhook.id}>{webhook.webhook_name}</Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item name="zalo_number_target" label="Zalo number target">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default Agents;
