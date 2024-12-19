import React, { useEffect, useState } from "react";
import "./index.css";
import { Space, Table, Button, Modal, Form, Tag,Input, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
interface DataType {
    id: number;
    IP: string;
    created_at: Date;
}

const columns: ColumnsType<DataType> = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
        render: (text) => <Space>{text}</Space>,
    },
    {
        title: "IP",
        dataIndex: "ip",
        key: "ip",
        render: (text) => <Tag color="processing">{text}</Tag>,
    },
    {
        title: "Ngày tạo",
        key: "created_at",
        dataIndex: "created_at",
        render: (text) => <Space>{text}</Space>,
    },
];
export const IP = () => {
    const [datasource, setdata] = useState<DataType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const AutoIPv6 = () => {
        const token = localStorage.getItem("token");
        axios.get(`https://z-image-cdn.com/local_ip?token=${token}`).then((response) => { 
            if(response.status===200){
                if (response.data.message){
                    message.info("IP Exitst")
                }else{
                    message.success(`Đã thêm IP ${response.data.ip}`)
                }
            }else{
                message.error("Có lỗi xảy ra");
            }
        }).catch((error) => { 

        });

    }
    const AutoIPv4 = () => {
        const token = localStorage.getItem("token");
        axios.get(`https://c.z-image-cdn.com/local_ip?token=${token}`).then((response) => { 
            if(response.status===200){
                if (response.data.message){
                    message.info("IP Exitst")
                }else{
                    message.success(`Đã thêm IP ${response.data.ip}`)
                }
            }else{
                message.error("Có lỗi xảy ra");
            }
        }).catch((error) => { 

        });

    }
    const handleOk = (values: any) => {
        const token = localStorage.getItem("token");
        axios
            .get(`https://z-image-cdn.com/client_ip?token=${token}&ip=${values.IP}`, {
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
                    if (response.data.message){
                        message.info("IP Exitst")
                    }else{
                        message.success(`Đã thêm IP ${response.data.ip}`)
                    }
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
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        axios
          .get("https://z-image-cdn.com/iplist", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setdata(response.data);
          })
          .catch((error) => { });
    }, []);
    return (
        <div>
            <div style={{ display:'flex'}}>
            <Button onClick={() => { showModal() }} type="primary" style={{ marginBottom: 16, marginRight:16 }}>
                Thêm IP bằng tay
            </Button>
            <Button onClick={() => { AutoIPv6() }} type="primary" danger style={{ marginBottom: 16, marginRight:16 }}>
                Thêm IP tự động v6
            </Button>
            <Button onClick={() => { AutoIPv4() }} type="primary" style={{ marginBottom: 16 }}>
                Thêm IP tự động v4
            </Button>
            </div>
            <Table columns={columns} dataSource={datasource} />
            <Modal title="Thêm Webhooks" open={isModalOpen} onCancel={handleCancel} onOk={handleOk}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Địa chỉ IP khách"
                        name="IP"
                        rules={[{ required: true, message: "Please input your webhook name!" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default IP;
