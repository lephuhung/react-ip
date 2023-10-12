import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Layout, Menu } from "antd";
import { DesktopOutlined, PieChartFilled } from "@ant-design/icons";
import Token from './Token'
import Agents from './Agents'
function Dashboard() {
  return <div>Dashboard</div>;
}
function Meseros() {
  return <div>Meseros</div>;
}

const { Header, Content, Footer, Sider } = Layout;

class App extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed: any) => {
    this.setState({ collapsed });
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
              <Menu.Item key="1">
                <PieChartFilled />
                <span>Deshboard</span>
                <Link to="/" />
              </Menu.Item>
              <Menu.Item key="2">
                <DesktopOutlined />
                <span>Meseros</span>
                <Link to="/meseros" />
              </Menu.Item>
              <Menu.Item key="3">
                <DesktopOutlined />
                <span>Token</span>
                <Link to="/token" />
              </Menu.Item>
            <Menu.Item key="4">
                <DesktopOutlined />
                <span>Agents</span>
                <Link to="/agents" />
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: "#fff", padding: 0, paddingLeft: 16 }}>
              {/* <Icon
                className="trigger"
                type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                style={{ cursor: "pointer" }}
                onClick={this.toggle}
              /> */}
            </Header>
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                background: "#fff",
                minHeight: 280,
              }}
            >
              <Routes>
                <Route path="/" Component={Dashboard} />
                <Route path="/Agent" Component={Meseros} />
                <Route path="/token" Component={Token} />
                <Route path="/agents" Component={Agents} />
              </Routes>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Ant Design ©2016 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
    );
  }
}
export default App;
