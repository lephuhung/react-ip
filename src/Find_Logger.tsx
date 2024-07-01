import React, { useState, useEffect } from "react";
import "./index.css";
import { Space, Table, Button, Form, Input, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import Image from "./image";
import { parse as parseIPv6, toLong, fromLong } from "ip6";
// import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Scatter, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartData
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
  created_at: Date;
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
        >
          <Input placeholder="input placeholder" style={{ width: "300px" }} />
        </Form.Item>
        <Form.Item
          name="id"
          label="ID"
          rules={[
            { type: "string", warningOnly: true },
            { type: "string", max: 4 },
          ]}
        >
          <Input placeholder="input placeholder" style={{ width: "300px" }} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Tìm theo Token
            </Button>
            <Button htmlType="button" onClick={onFill}>
              Tìm theo ID
            </Button>
          </Space>
        </Form.Item>
      </Form>
      {/* <Table
        columns={columns}
        dataSource={datasource}
        pagination={{ pageSize: 30 }}
      /> */}
      {datasource && <IPBarChart data={datasource} />}
      {datasource && <BarChart data={datasource} />}
    </div>
  );
};
export default Filter;

interface IPData {
  ip: string;
  time: string;
}

interface Props {
  data: DataType[];
}

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
const IPBarChart: React.FC<Props> = ({ data }) => {
  const [chartData, setChartData] = useState<ChartData<'bar', { label: string; data: number[]; }[], unknown>>({
      labels: [],
      datasets: [
          {
              label: 'IP Frequency',
              data: [],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
          },
      ],
  });

  useEffect(() => {
      // Count frequency of each IP
      const ipFrequency = new Map<string, number>();
      data.forEach(entry => {
          const { ip, created_at } = entry;
          const key = `${ip}_${created_at.toString().slice(0, 13)}`; // Using IP and hour as a key
          ipFrequency.set(key, (ipFrequency.get(key) || 0) + 1);
      });

      // Prepare chart data
      const labels: string[] = [];
      const counts: number[] = [];
      ipFrequency.forEach((count, key) => {
          const [ip, time] = key.split('_');
          labels.push(`${ip} - ${time}`);
          counts.push(count);
      });

      setChartData({
          labels: labels,
          datasets: [
              {
                  label: 'IP Frequency',
                  data: [{ label: 'label1', data: counts }],
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
              },
          ],
      });
  }, [data]);

  return (
      <div style={{ height: '400px', width: '600px', margin: 'auto' }}>
          <h2>IP Frequency over Time</h2>
          <Bar
              data={{
                  labels: chartData.labels,
                  datasets: chartData.datasets.map(dataset => ({
                      label: dataset.label,
                      data: dataset.data,
                      backgroundColor: dataset.backgroundColor,
                      borderColor: dataset.borderColor,
                      borderWidth: dataset.borderWidth,
                  })),
              }}
              options={{
                  scales: {
                      x: {
                          title: {
                              display: true,
                              text: 'IP - Time',
                          },
                      },
                      y: {
                          beginAtZero: true,
                          title: {
                              display: true,
                              text: 'Frequency',
                          },
                      },
                  },
              }}
          />
      </div>
  );
};
