import React, { useState } from "react";
import "./index.css";
import { Space, Table, Button, Form, Input, Tag, message, Tooltip as AntdTooltip, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "./axiosInstance";
import Image from "./image";
import { Scatter, Bar } from "react-chartjs-2";
import bigInt from "big-integer";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { CategoryScale, BarElement, ChartOptions } from "chart.js";
ChartJS.register(
  CategoryScale,
  BarElement,
  TimeScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);
interface ScatterPlotProps {
  data: DataType[];
}
interface BarChartProps {
  data: DataType[];
}
interface DataType {
  id: number;
  ip: string;
  ip_info: string;
  user_agents: number;
  token: string;
  device: number;
  filename: string;
  time_stamp: string;
  created_at: string;
}
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
    render: (text) => {
      const displayIp = formatIpForDisplay(text);
      if (text !== displayIp) {
        return (
          <AntdTooltip title={text}>
            <Tag color="processing" style={{ cursor: "pointer" }}>{displayIp}</Tag>
          </AntdTooltip>
        );
      }
      return <Tag color="processing">{text}</Tag>;
    },
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
    render: (text) => <Image name={text} />,
  },
  {
    title: "Thiết bị",
    dataIndex: "device",
    key: "device",
    render: (text) => <Space>{text}</Space>,
  },
  {
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
    title: "Timestamp",
    key: "time_stamp",
    dataIndex: "time_stamp",
    render: (text) => <Space>{text}</Space>,
  },
  {
    title: "Hành động",
    dataIndex: "action",
    render: (text: any, Item: DataType) => (
      <Button
        onClick={() => {
          let ip_info = JSON.parse(
            Item.ip_info
              .replace(/'/g, '"')
              .replace(/False/g, "false")
              .replace(/True/g, "true")
          );
          let info = `1. IP: ${Item.ip} - Time: ${convertTime(
            Item.time_stamp
          )} \n2. Khu vực: ${ip_info["city"]} - ${ip_info["regionName"]} - ${
            ip_info["country"]
          }\n3. Thông tin thiết bị: user_agent:${Item.user_agents} - device: ${
            Item.device
          }\n4. Nhà cung cấp dịch vụ: ${ip_info["isp"]}\n5. Di động: ${
            ip_info["mobile"]
          }, Proxy: ${ip_info["proxy"]}, Hosting: ${ip_info["hosting"]}\n`;
          try {
            navigator.clipboard.writeText(info);
            message.success("Đã copy kết quả");
          } catch (error) {
            console.warn("Copy failed", error);
            message.success("Không thể copy kết quả");
          }
        }}
      >
        Copy
      </Button>
    ),
  },
];
const convertTime = (value: string) => {
  const inputDate = value;
  const date = new Date(inputDate);
  date.setHours(date.getHours() + 7);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  const outputDate = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  return outputDate;
};
const Filter = () => {
  const [datasource, setdata] = useState<DataType[]>([]);

  const [form] = Form.useForm();

  const onFinish = (value: any) => {
    axios
      .get(`https://z-image-cdn.com/logger/token/${value.key}?limit=300`)
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => {});
  };

  const onFinishFailed = () => {
    message.error("Submit failed!");
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="key"
          label="Token String"
          rules={[
            { required: true },
            { type: "string", warningOnly: true },
            { type: "string", min: 6 },
          ]}
          style={{
            display: "inline-block",
            width: "300px",
            marginRight: "8px",
          }}
        >
          <Input placeholder="input placeholder" style={{ width: "300px" }} />
        </Form.Item>
        <Form.Item
          style={{ display: "inline-block", width: "calc(50% - 8px)" }}
        >
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: "30px" }}
          >
            Tìm theo Token
          </Button>
        </Form.Item>
      </Form>
      {datasource && <ScatterPlot data={datasource} />}
      {datasource && <BarChart data={datasource} />}
      {/* PC View */}
      <div className="desktop-only">
        <Table
          columns={columns}
          dataSource={datasource}
          pagination={{ pageSize: 30 }}
          style={{ marginTop: "20px" }}
        />
      </div>

      {/* Mobile View */}
      <div className="mobile-only" style={{ marginTop: "20px" }}>
        {datasource && datasource.length > 0 ? (
          datasource.map((item) => {
            let ip_info: any = {};
            try {
              ip_info = JSON.parse(
                item.ip_info
                  .replace(/'/g, '"')
                  .replace(/False/g, "false")
                  .replace(/True/g, "true")
              );
            } catch (e) {
              console.error("Failed to parse ip_info", e);
            }
            const displayIp = formatIpForDisplay(item.ip);
            return (
              <Card
                key={item.id}
                style={{ marginBottom: "12px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                bodyStyle={{ padding: "16px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <span style={{ color: "#8c8c8c", marginRight: "6px", fontSize: "12px" }}>#{item.id}</span>
                    {item.ip !== displayIp ? (
                      <AntdTooltip title={item.ip}>
                        <Tag color="processing" style={{ cursor: "pointer" }}>{displayIp}</Tag>
                      </AntdTooltip>
                    ) : (
                      <Tag color="processing">{item.ip}</Tag>
                    )}
                  </div>
                  <Image name={item.token} />
                </div>
                <div style={{ fontSize: "13px", color: "#555", marginBottom: "12px", lineHeight: "1.6" }}>
                  <div><strong>Khu vực:</strong> {ip_info["city"] || ""} - {ip_info["regionName"] || ""} - {ip_info["country"] || ""}</div>
                  <div><strong>ISP:</strong> {ip_info["isp"] || ""}</div>
                  <div><strong>Thiết bị:</strong> {item.device} (UA: {item.user_agents})</div>
                  <div><strong>File Name:</strong> {item.filename}</div>
                  <div><strong>Lúc:</strong> {item.time_stamp}</div>
                </div>
                <Button
                  type="primary"
                  style={{ width: "100%", borderRadius: "4px" }}
                  onClick={() => {
                    let info = `1. IP: ${item.ip} - Time: ${convertTime(
                      item.time_stamp
                    )} \n2. Khu vực: ${ip_info["city"]} - ${ip_info["regionName"]} - ${
                      ip_info["country"]
                    }\n3. Thông tin thiết bị: user_agent:${item.user_agents} - device: ${
                      item.device
                    }\n4. Nhà cung cấp dịch vụ: ${ip_info["isp"]}\n5. Di động: ${
                      ip_info["mobile"]
                    }, Proxy: ${ip_info["proxy"]}, Hosting: ${ip_info["hosting"]}\n`;
                    try {
                      navigator.clipboard.writeText(info);
                      message.success("Đã copy kết quả");
                    } catch (error) {
                      console.warn("Copy failed", error);
                      message.error("Không thể copy kết quả");
                    }
                  }}
                >
                  Copy thông tin log
                </Button>
              </Card>
            );
          })
        ) : (
          <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>Không có dữ liệu Logger</div>
        )}
      </div>
    </div>
  );
};
export default Filter;

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
  // Format and extract unique IP addresses (grouped IPv6) as Y-axis labels.
  const uniqueIPs = Array.from(new Set(data.map((entry) => formatIpForDisplay(entry.ip)))).sort();

  const scatterData = {
    datasets: [
      {
        label: "IP Request Timeline",
        data: data.map((entry) => ({
          x: new Date(entry.time_stamp || entry.created_at).getTime(),
          y: formatIpForDisplay(entry.ip), // Direct string mapping to the category labels
        })),
        backgroundColor: "rgba(99, 102, 241, 0.6)", // Modern Indigo
        borderColor: "rgba(99, 102, 241, 1)",
        pointBackgroundColor: "rgba(99, 102, 241, 0.8)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "minute" as const,
          tooltipFormat: "dd/MM/yyyy HH:mm:ss",
          displayFormats: {
            minute: "HH:mm",
            hour: "HH:mm",
            day: "dd/MM",
          },
        },
        title: {
          display: true,
          text: "Thời gian (UTC+7)",
          font: {
            size: 13,
            weight: "bold" as const,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      y: {
        type: "category" as const,
        labels: uniqueIPs,
        title: {
          display: true,
          text: "Địa chỉ IP",
          font: {
            size: 13,
            weight: "bold" as const,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          autoSkip: false, // Ensure all IPs are labeled
          font: {
            family: "monospace",
            size: 11,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const ip = context.raw.y;
            const time = new Date(context.raw.x).toLocaleString("vi-VN", {
              timeZone: "Asia/Bangkok",
            });
            return `IP: ${ip} | Lúc: ${time}`;
          },
        },
      },
    },
  };

  return (
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      marginBottom: "24px"
    }}>
      <h3 style={{ marginBottom: "16px", color: "#1f2937", fontWeight: 600 }}>
        Phân bố truy cập IP theo Thời gian (Timeline)
      </h3>
      <Scatter data={scatterData} options={options} />
    </div>
  );
};

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const subnetCounts = data.reduce<{ [key: string]: number }>((acc, item) => {
    let subnet: string;

    if (item.ip.includes(":")) {
      // IPv6: Group by /64 prefix
      const prefix = get4subv6(item.ip);
      subnet = prefix ? `${prefix}::/64` : "IPv6 Unknown";
    } else {
      // IPv4: Group by /24 prefix (e.g. 192.168.1.0/24)
      const parts = item.ip.split(".");
      if (parts.length === 4) {
        subnet = `${parts.slice(0, 3).join(".")}.0/24`;
      } else {
        subnet = item.ip;
      }
    }

    acc[subnet] = (acc[subnet] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(subnetCounts);
  const chartData = Object.values(subnetCounts);

  const chartConfig = {
    labels: labels,
    datasets: [
      {
        label: "Số lượng truy cập",
        data: chartData,
        backgroundColor: "rgba(139, 92, 246, 0.6)", // Modern Violet
        borderColor: "rgba(139, 92, 246, 1)",
        borderWidth: 1.5,
        borderRadius: 6, // Modern rounded bars
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Dải Mạng (Subnet /24 hoặc /64)",
          font: {
            size: 13,
            weight: "bold" as const,
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "monospace",
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số lượng kết nối (Counts)",
          font: {
            size: 13,
            weight: "bold" as const,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      marginBottom: "24px"
    }}>
      <h3 style={{ marginBottom: "16px", color: "#1f2937", fontWeight: 600 }}>
        Phân bố truy cập theo Dải mạng (Subnet Distribution)
      </h3>
      <Bar data={chartConfig} options={options} />
    </div>
  );
};
