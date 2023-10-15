import React, { useEffect, useState } from "react";
import "./index.css";
import { Space, Button, Row, Col, message, Card, Modal, Form, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useCopyToClipboard } from './usehooks';

type Props = { name: string, url: string }

export const IP = () => {
    const [datasource, setdata] = useState<Props[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const AutoIP = () => {
        const token = localStorage.getItem("token");
        axios.get(`https://z-image-cdn.com/local_ip?token=${token}`).then((response) => {
            if (response.status === 200) {
                if (response.data.message) {
                    message.info("IP Exitst")
                } else {
                    message.success(`Đã thêm IP ${response.data.ip}`)
                }
            } else {
                message.error("Có lỗi xảy ra");
            }
        }).catch((error) => {

        });

    }
    const handleOk = (values: any) => {
        const token = localStorage.getItem("token");
        axios
            .post(`https://z-image-cdn.com/download_image?token=${token}`,values
            )
            .then((response) => {
                if (response.status === 200) {
                    message.success("Thêm thành công");
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
        const token = localStorage.getItem("token");
        axios
            .get(`https://z-image-cdn.com/list_images?token=${token}`)
            .then((response) => {
                setdata(response.data);
            })
            .catch((error) => { });
    }, []);
    return (
        <div>
            <Button onClick={() => { showModal() }} type="primary" style={{ marginBottom: 16 }}>
                Tải Image
            </Button>
            <Row gutter={[16, 16]}>
                {
                    datasource.map((item, index) => {
                        if (!item.url.includes(".DS_Store")){
                        return (<Col span={4} >
                            <Image key={index} url={item.url} name={item.name} />
                        </Col>)
                        }
                    })
                }
            </Row>
            <Modal title="Tải Image" open={isModalOpen} onCancel={handleCancel}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={handleOk}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Image Name"
                        name="name"
                        rules={[{ required: true, message: "Tên Image không cần đuôi!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Image URL"
                        name="url"
                        rules={[{ required: true, type: "url", message: "URL Image có đuôi" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default IP;

const Image = ({ url, name, }: Props) => {
    const [value, copy] = useCopyToClipboard()
    const [messageApi, contextHolder] = message.useMessage();
    return (
        <>
            {contextHolder}
            <Card
                style={{ width: 128, height: 128 }}
                cover={<img alt="example" src={url} />}
                onClick={() => { messageApi.success(`Đã copy ${name}`); copy(name) }}
            >
            </Card>
        </>
    );
}