import React, { useEffect, useState } from 'react';
import './index.css';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

import { Breadcrumb, Layout, Menu, theme, Col, Row, message } from 'antd';
import Image from './image';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Image', '2', <DesktopOutlined />),
  getItem('Agents', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Webhooks', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Config', '9', <FileOutlined />),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  type image = { name: string, url: string }
  const [imagelist, setimagelist] = useState<image[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const info = () => {
    messageApi.success('Hello, Ant Design!');
  };
  useEffect(() => {
    axios.get('https://z-image-cdn.com/list_images?token=lephuhung77').then((res) => {
      setimagelist(res.data)
    }).catch((e) => {

    })
  }, []);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Row gutter={[16,16]}>
            {
              imagelist.map((item, index) => {
                return (<Col span={4} >
                  <Image key={index} url={item.url} name={item.name} />
                </Col>)
              })
            }
          </Row>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default App;