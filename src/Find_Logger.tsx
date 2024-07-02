import React, { useState } from "react";
import "./index.css";
import { Space, Table, Button, Form, Input, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import Image from "./image";
import { parse as parseIPv6, toLong, fromLong } from "ip6";
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
function get4subv6(ipv6Address: string): string {
  const segments = ipv6Address.split(":");
  const subnetPrefix = segments.slice(0, 4).join(":");
  return subnetPrefix;
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
    const token = localStorage.getItem("access_token");
    axios
      .get(`https://z-image-cdn.com/logger/token/${value.key}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => {});
  };

  const onFinishFailed = () => {
    message.error("Submit failed!");
  };

  const onFill = () => {
    let id = form.getFieldValue("id");
    const token = localStorage.getItem("token");
    axios
      .get(`https://z-image-cdn.com/logger/${id}?token=${token}`)
      .then((response) => {
        console.log(response.data);
        setdata(response.data);
      })
      .catch((error) => {});
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
      <Table
        columns={columns}
        dataSource={datasource}
        pagination={{ pageSize: 30 }}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};
export default Filter;

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
  const IPV4_DIVISOR = 10000;
  const IPV6_DIVISOR = bigInt("10000000000000"); // Large divisor for IPv6

  const ipToNumber = (ip: string) => {
    if (ip.includes(":")) {
      // IPv6
      return ipv6ToNumber(ip).divide(IPV6_DIVISOR);
    } else {
      // IPv4
      return ipv4ToNumber(ip) / IPV4_DIVISOR;
    }
  };

  const ipv4ToNumber = (ip: string) => {
    return ip
      .split(".")
      .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
  };

  const ipv6ToNumber = (ip: string) => {
    const parts = ip.split(":").slice(0, 4); // Take the first 4 subnets
    let number = bigInt(0);
    for (let i = 0; i < parts.length; i++) {
      const part = parseInt(parts[i] || "0", 16);
      number = number.shiftLeft(16).add(part);
    }
    return number;
  };

  const numberToIpv4 = (num: number) => {
    num *= IPV4_DIVISOR; // Re-multiply to get the original number
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255,
    ].join(".");
  };

  const numberToIpv6 = (num: any) => {
    num = num.multiply(IPV6_DIVISOR); // Re-multiply to get the original number
    const hexString = num.toString(16).padStart(16, "0");
    return hexString.match(/.{1,4}/g)?.join(":") || "";
  };

  const numberToIp = (num: any) => {
    if (typeof num === "bigint" || num instanceof bigInt) {
      return numberToIpv6(num);
    } else {
      return numberToIpv4(num);
    }
  };

  const convertToUTC7 = (timestamp: string) => {
    const date = new Date(timestamp);
    const offset = 7 * 60; // UTC+7 in minutes
    const utc7Date = new Date(date.getTime() + offset * 60000);
    return utc7Date;
  };

  const scatterData = {
    datasets: [
      {
        label: "IP Address vs Time Stamp",
        data: data.map((entry) => ({
          x: convertToUTC7(entry.created_at).getTime(),
          y: ipToNumber(entry.ip),
        })),
        backgroundColor: "rgba(0, 123, 255, 0.5)", // Background color of the dataset
        borderColor: "rgba(0, 123, 255, 1)", // Border color of the dataset
        pointBackgroundColor: "rgba(255, 0, 0, 0.5)", // Background color of the points
        pointBorderColor: "rgba(255, 0, 0, 1)",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "hour" as const,
          displayFormats: {
            hour: "HH:mm", // 24-hour format
          },
        },
        title: {
          display: true,
          text: "Time Stamp (UTC+7)",
        },
      },
      y: {
        title: {
          display: true,
          text: "IP Address",
        },
        ticks: {
          callback: function (value: any) {
            return numberToIp(value);
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const ip = numberToIp(context.raw.y);
            const time = new Date(context.raw.x).toLocaleString("en-US", {
              timeZone: "Asia/Bangkok",
            });
            return `IP: ${ip}, Time: ${time}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h2>Scatter Plot of IP Address vs Time Stamp</h2>
      <Scatter data={scatterData} options={options} />
    </div>
  );
};

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const subnetCounts = data.reduce<{ [key: string]: number }>((acc, item) => {
    let subnet: string;

    if (item.ip.includes(":")) {
      const subnets = get4subv6(item.ip);
      subnet = subnets; // Use the first subnet for simplicity
    } else {
      subnet = item.ip; // For IPv4, keep the IP as it is
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
        label: "Địa chỉ IP",
        data: chartData,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Bar
        data={chartConfig}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: "Địa chỉ IP",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Count",
              },
            },
          },
        }}
      />
    </div>
  );
};
