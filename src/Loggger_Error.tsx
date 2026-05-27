import React, { useEffect, useState } from "react";
import "./index.css";
import { Space, Table, Button , Tag, message, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "./axiosInstance";
import Image from "./image"
interface DataType {
  id: number;
  ip: string;
  ip_info: string;
  user_agents: number;
  token: string;
  device: number;
  filename: string;
  time_stamp: string;
  created_at: Date;
}

const columns: ColumnsType<DataType> = [
  {
    title: "STT",
    dataIndex: "id",
    key: "id",
    render: (text) => <Space>{text}</Space>,
  },
  {
    title: "Tên",
    dataIndex: "ip",
    key: "ip",
    render: (text) => <Tag color="processing">{text}</Tag>,
  },
  {
    title: "IP INFO",
    dataIndex: "ip_info",
    key: "ip_info",
  },
  {
    title: "Trình duyệt",
    dataIndex: "user_agents",
    key: "user_agents",
  },
  {
    title: "Token",
    key: "token",
    dataIndex: "token",
    render: (text) => (
      <Image name={text ? text.replace('token', '') : ''} />
    ),
  },
  {
    title: "Thiết bị",
    dataIndex: "device",
    key: "device",
    render: (text) => <Space>{text}</Space>,
    
  },{
    title: "File name",
    key: "filename",
    dataIndex: "filename",
    render: (text) => <Space>{text}</Space>,
  },
  {
    title: "Ngày tạo",
    key: "created_at",
    dataIndex: "created_at",
    render: (text) => <Space>{text}</Space>,
  },
  {
    title: "Hành động",
    dataIndex: "action",
    render: (text: any, Item: DataType) => <Button onClick={() => {
      try {
        let ip_info: any = {};
        try {
          ip_info = JSON.parse(Item.ip_info.replace(/'/g, '"').replace(/False/g, 'false').replace(/True/g, 'true'));
        } catch (e) {
          console.error("Failed to parse ip_info", e);
        }
        let info = `1. IP: ${Item.ip} - Time: ${convertTime(Item.time_stamp)} \n2. Khu vực: ${ip_info['city'] || ''} - ${ip_info['regionName'] || ''} - ${ip_info['country'] || ''}\n3. Thông tin thiết bị: user_agent:${Item.user_agents} - device: ${Item.device}\n4. Nhà cung cấp dịch vụ: ${ip_info['isp'] || ''}\n5. Di động: ${ip_info['mobile'] !== undefined ? ip_info['mobile'] : ''}, Proxy: ${ip_info['proxy'] !== undefined ? ip_info['proxy'] : ''}, Hosting: ${ip_info['hosting'] !== undefined ? ip_info['hosting'] : ''}\n`;
        
        navigator.clipboard.writeText(info);
        message.success('Đã copy kết quả');
      } catch (error) {
        console.warn('Copy failed', error);
        message.error('Không thể copy kết quả');
      }
    }}>Copy</Button>,
  }
];
const convertTime = (value: string) => {
  const inputDate = value;
  const date = new Date(inputDate);
  date.setHours(date.getHours() + 7);
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  const outputDate = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  return outputDate;
}
export const LoggerError = () => {
  const [datasource, setdata] = useState<DataType[]>([]);
  /* eslint-disable no-template-curly-in-string */
  
  useEffect(() => {
    axios
      .get("https://z-image-cdn.com/logger_error?limit=50")
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => { });
  },[]);
  return (
    <div>
      {/* PC View */}
      <div className="desktop-only">
        <Table columns={columns} dataSource={datasource} />
      </div>

      {/* Mobile View */}
      <div className="mobile-only">
        {datasource && datasource.length > 0 ? (
          datasource.map((item) => {
            let ip_info: any = {};
            try {
              ip_info = JSON.parse(item.ip_info.replace(/'/g, '"').replace(/False/g, 'false').replace(/True/g, 'true'));
            } catch (e) {
              console.error("Failed to parse ip_info", e);
            }
            return (
              <Card
                key={item.id}
                style={{ marginBottom: '12px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <span style={{ color: '#8c8c8c', marginRight: '6px', fontSize: '12px' }}>#{item.id}</span>
                    <Tag color="processing">{item.ip}</Tag>
                  </div>
                  <Image name={item.token ? item.token.replace('token', '') : ''} />
                </div>
                <div style={{ fontSize: '13px', color: '#555', marginBottom: '12px', lineHeight: '1.6' }}>
                  <div><strong>Khu vực:</strong> {ip_info['city'] || ''} - {ip_info['regionName'] || ''} - {ip_info['country'] || ''}</div>
                  <div><strong>ISP:</strong> {ip_info['isp'] || ''}</div>
                  <div><strong>Thiết bị:</strong> {item.device} (UA: {item.user_agents})</div>
                  <div><strong>File Name:</strong> {item.filename}</div>
                  <div><strong>Ngày tạo:</strong> {item.created_at as any}</div>
                </div>
                <Button 
                  type="primary"
                  style={{ width: '100%', borderRadius: '4px' }}
                  onClick={() => {
                    let info = `1. IP: ${item.ip} - Time: ${convertTime(item.time_stamp)} \n2. Khu vực: ${ip_info['city'] || ''} - ${ip_info['regionName'] || ''} - ${ip_info['country'] || ''}\n3. Thông tin thiết bị: user_agent:${item.user_agents} - device: ${item.device}\n4. Nhà cung cấp dịch vụ: ${ip_info['isp'] || ''}\n5. Di động: ${ip_info['mobile'] !== undefined ? ip_info['mobile'] : ''}, Proxy: ${ip_info['proxy'] !== undefined ? ip_info['proxy'] : ''}, Hosting: ${ip_info['hosting'] !== undefined ? ip_info['hosting'] : ''}\n`;
                    try {
                      navigator.clipboard.writeText(info);
                      message.success('Đã copy kết quả');
                    } catch (error) {
                      console.warn('Copy failed', error);
                      message.error('Không thể copy kết quả');
                    }
                  }}
                >
                  Copy thông tin log
                </Button>
              </Card>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Không có dữ liệu Logger Error</div>
        )}
      </div>
    </div>
  );
};
export default LoggerError;
