import React, { useEffect, useState } from "react";
import "./index.css";
import { Space, Table, Button, Modal, Form, Input, Tag, message, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "./axiosInstance";
import Image from "./image";
interface DataType {
  id: number;
  webhook_name: string;
  url_webhook: string;
  created_at: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    render: (text) => <Space>{text}</Space>,
  },
  {
    title: "Tên",
    dataIndex: "webhook_name",
    key: "webhook_name",
    render: (text) => <Tag color="magenta">{text}</Tag>,
  },
  {
    title: "Discord URL",
    dataIndex: "url_webhook",
    key: "url_webhook",
  },
  {
    title: "Ngày tạo",
    key: "created_at",
    dataIndex: "created_at",
    render: (text) => <Space>{text}</Space>,
  },
];
export const Webhooks = () => {
  const [datasource, setdata] = useState<DataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      axios
        .post("https://z-image-cdn.com/webhooks/add", values)
        .then((response) => {
          if (response.status === 200) {
            message.success("Thêm thành công");
            setIsModalOpen(false);
          } else {
            message.error("Thêm thất bại");
          }
        })
        .catch((error) => {});
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    axios
      .get("https://z-image-cdn.com/webhooks")
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
        Thêm Webhooks
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{item.webhook_name}</span>
                <span style={{ color: '#8c8c8c', fontSize: '12px' }}>#{item.id}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#555', marginBottom: '8px', wordBreak: 'break-all' }}>
                <strong>Discord URL:</strong> <a href={item.url_webhook} target="_blank" rel="noreferrer">{item.url_webhook}</a>
              </div>
              <div style={{ fontSize: '11px', color: '#bfbfbf', textAlign: 'right' }}>
                {item.created_at}
              </div>
            </Card>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Không có dữ liệu Webhooks</div>
        )}
      </div>
      <Modal title="Thêm Webhooks" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          form={form}
          autoComplete="off"
        >
          <Form.Item
            label="Webhook Name"
            name="webhook_name"
            rules={[
              { required: true, message: "Please input your webhook name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Webhook URL"
            name="url_webhook"
            rules={[
              {
                required: true,
                type: "url",
                message: "Please input url Discord",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default Webhooks;
