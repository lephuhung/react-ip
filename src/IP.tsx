import React, { useEffect, useState } from "react";
import "./index.css";
import { Space, Table, Button, Modal, Form, Tag, Input, message, Card, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "./axiosInstance";
interface DataType {
    id: number;
    ip: string;
    IP?: string;
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
function expandIPv6(ip: string): string {
  if (!ip.includes("::")) {
    return ip;
  }
  const parts = ip.split("::");
  const left = parts[0] ? parts[0].split(":") : [];
  const right = parts[1] ? parts[1].split(":") : [];
  const missingCount = 8 - (left.length + right.length);
  const middle = Array(missingCount).fill("0");
  return [...left, ...middle, ...right].join(":");
}

function get4subv6(ipv6Address: string): string {
  const expanded = expandIPv6(ipv6Address.trim());
  const segments = expanded.split(":");
  return segments.slice(0, 4).join(":");
}

const formatIpForDisplay = (ip: string): string => {
  if (ip && ip.includes(":")) {
    const prefix = get4subv6(ip);
    return prefix ? `${prefix}::/64` : ip;
  }
  return ip;
};

export const IP = () => {
    const [form] = Form.useForm();
    const [datasource, setdata] = useState<DataType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const refreshIPList = () => {
        axios
          .get("https://z-image-cdn.com/iplist")
          .then((response) => {
            setdata(response.data);
          })
          .catch((error) => { });
    };

    const AutoIPv6 = () => {
        const token = localStorage.getItem("token");
        axios.get(`https://z-image-cdn.com/local_ip?token=${token}`).then((response) => { 
            if(response.status===200){
                if (response.data.message){
                    message.info("IP Exists")
                }else{
                    message.success(`Đã thêm IP ${response.data.ip}`)
                    refreshIPList();
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
                    message.info("IP Exists")
                }else{
                    message.success(`Đã thêm IP ${response.data.ip}`)
                    refreshIPList();
                }
            }else{
                message.error("Có lỗi xảy ra");
            }
        }).catch((error) => { 

        });

    }
    const handleOk = () => {
        const token = localStorage.getItem("token");
        form.validateFields().then((values) => {
            axios
                .get(`https://z-image-cdn.com/client_ip?token=${token}&ip=${values.IP}`)
                .then((response) => {
                    if (response.status === 200) {
                        if (response.data.message){
                            message.info("IP Exists")
                        }else{
                            message.success(`Đã thêm IP ${response.data.ip}`)
                            refreshIPList();
                        }
                        setIsModalOpen(false);
                        form.resetFields();
                    } else {
                        message.error('Thêm thất bại')
                    }
                })
                .catch((error) => {
                    message.error('Thêm thất bại')
                });
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        refreshIPList();
    }, []);
    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: 16, width: '100%' }}>
                <Button onClick={() => { showModal() }} type="primary" style={{ flex: '1 1 auto', minWidth: '120px' }}>
                    Thêm IP bằng tay
                </Button>
                <Button onClick={() => { AutoIPv6() }} type="primary" danger style={{ flex: '1 1 auto', minWidth: '120px' }}>
                    Thêm IP tự động v6
                </Button>
                <Button onClick={() => { AutoIPv4() }} type="primary" style={{ flex: '1 1 auto', minWidth: '120px' }}>
                    Thêm IP tự động v4
                </Button>
            </div>

            {/* PC View: Table */}
            <div className="desktop-only">
                <Table columns={columns} dataSource={datasource} />
            </div>

            {/* Mobile View: Card List */}
            <div className="mobile-only">
                {datasource && datasource.length > 0 ? (
                    datasource.map((item) => (
                        <Card 
                            key={item.id} 
                            style={{ marginBottom: '10px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                            bodyStyle={{ padding: '12px 16px' }}
                        >
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <div>
                                     <span style={{ color: '#8c8c8c', marginRight: '8px', fontSize: '13px' }}>#{item.id}</span>
                                     {
                                         (() => {
                                             const ipVal = item.ip || item.IP || '';
                                             const displayIp = formatIpForDisplay(ipVal);
                                             if (ipVal !== displayIp) {
                                                 return (
                                                     <Tooltip title={ipVal}>
                                                         <Tag color="processing" style={{ cursor: "pointer", wordBreak: 'break-all', whiteSpace: 'normal' }}>
                                                             {displayIp}
                                                         </Tag>
                                                     </Tooltip>
                                                 );
                                             }
                                             return (
                                                 <Tag color="processing" style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>
                                                     {ipVal}
                                                 </Tag>
                                             );
                                         })()
                                     }
                                 </div>
                                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                    {item.created_at ? new Date(item.created_at).toLocaleString('vi-VN') : ''}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Không có dữ liệu IP</div>
                )}
            </div>
            <Modal title="Thêm Webhooks" open={isModalOpen} onCancel={handleCancel} onOk={handleOk}>
                <Form
                    form={form}
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
