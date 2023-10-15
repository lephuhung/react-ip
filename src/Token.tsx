import React from "react";
import { Button, Form, Input, Space, message, Row, Col } from "antd";
import axios from "axios";

const onFinish = (values: any) => {
  axios
    .post(
      "https://z-image-cdn.com/login",
      values,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Access-Control-Allow-Headers, Content-Type, Authorization",
          "Access-Control-Allow-Methods": "*",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((res) => {
      localStorage.setItem("access_token", res.data.access_token);
    })
    .catch(() => { });
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

type FieldType = {
  username?: string;
  password?: string;
};

const Token: React.FC = () => (

    <Row>
      <Col span={12} order={4}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={12} order={3}>
        <App />
      </Col>
    </Row>
);
const App: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (value: any) => {
    localStorage.setItem("token", value.token)
    message.success('Submit success!');
  };

  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  const onFill = () => {
    form.setFieldsValue({
      url: 'https://taobao.com/',
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        name="token"
        label="Token String"
        rules={[{ required: true }, { type: 'string', warningOnly: true }, { type: 'string', min: 6 }]}
      >
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onFill}>
            Fill
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
export default Token;
