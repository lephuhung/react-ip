import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Layout, Menu } from "antd";
import { DesktopOutlined, PieChartFilled, UserOutlined, TeamOutlined, ImportOutlined, LogoutOutlined, LoginOutlined, FileImageOutlined, FilterOutlined } from "@ant-design/icons";
import Token from './Token'
import Agents from './Agents'
import Webhooks from './Webhooks'
import IP from './IP'
import Logger from "./Loggger";
import LoggerError from "./Loggger_Error"
import Filter from "./Find_Logger"
import Images from "./Imageview"
function Dashboard() {
  return <div>Dashboard</div>;
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
              <TeamOutlined />
                <span>Webhooks</span>
                <Link to="/webhooks" />
              </Menu.Item>
              <Menu.Item key="3">
                <UserOutlined />
                <span>Token</span>
                <Link to="/token" />
              </Menu.Item>
            <Menu.Item key="4">
                <DesktopOutlined />
                <span>Agents</span>
                <Link to="/agents" />
              </Menu.Item>
              <Menu.Item key="5">
                <ImportOutlined />
                <span>IP</span>
                <Link to="/IP" />
              </Menu.Item>
              <Menu.Item key="6">
                <LogoutOutlined/>
                <span>Logger</span>
                <Link to="/logger" />
              </Menu.Item>
              <Menu.Item key="7">
                <LoginOutlined/>
                <span>Logger Error</span>
                <Link to="/logger-error" />
              </Menu.Item>
              <Menu.Item key="8">
                <FilterOutlined/>
                <span>Filter Logger</span>
                <Link to="/filter" />
              </Menu.Item>
              <Menu.Item key="9">
                <FileImageOutlined/>
                <span>Image</span>
                <Link to="/images" />
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
                <Route path="/webhooks" Component={Webhooks} />
                <Route path="/token" Component={Token} />
                <Route path="/agents" Component={Agents} />
                <Route path="/IP" Component={IP} />
                <Route path="/logger" Component={Logger} />
                <Route path="/logger-error" Component={LoggerError} />
                <Route path="/filter" Component={Filter} />
                <Route path="/images" Component={Images} />
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
