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
  <Row gutter={[16, 16]} style={{ margin: '20px' }}>
    <Col 
      xs={24} 
      md={12}
      style={{
        marginBottom: '20px'
      }}
    >
      <Form
        name="basic"
        labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
        style={{ 
          maxWidth: '100%', 
          padding: '16px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
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
          <Input size="large" />
        </Form.Item>
        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item 
          wrapperCol={{ 
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 }
          }}
          style={{ 
            marginBottom: 0,
            textAlign: 'center'
          }}
        >
          <Button 
            type="primary" 
            htmlType="submit"
            size="large"
            style={{
              width: '100%',
              maxWidth: '200px'
            }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Col>
    <Col xs={24} md={12}>
      <div style={{
        background: '#fff',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <App />
      </div>
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
        <Input placeholder="input placeholder" style={{ width: '100%', maxWidth: '300px' }}/>
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
