import React, { useEffect, useState } from "react";
import "./index.css";
import { Space, Table, Button, Modal, Form, Input, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import Image from "./image";
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
export const Agents = () => {
  const [datasource, setdata] = useState<DataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const token = localStorage.getItem("access_token");
    form.validateFields().then((values) => {
      axios
        .post("https://z-image-cdn.com/webhooks/add", values, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "Access-Control-Allow-Headers, Content-Type, Authorization",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
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
    const token = localStorage.getItem("access_token");
    axios
      .get("https://z-image-cdn.com/webhooks", {
        headers: { Authorization: `Bearer ${token}` },
      })
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
      <Table columns={columns} dataSource={datasource} />
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
export default Agents;
