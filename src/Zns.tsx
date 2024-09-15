import React, { useEffect, useState } from "react";
import "./index.css";
import {
  Space,
  Table,
  Button,
  Modal,
  Form,
  Tag,
  Input,
  message,
  Col,
  Row,
  Select,
} from "antd";
import Image from "./image";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";

const { Option } = Select;
interface Params {
  phone: string;
  zns_template: string;
  order_code: string;
  date: string;
  price: string;
  name: string;
  status: string;
}
interface Phone {
  id: number;
  phone: string;
  phone_user: string;
  created_at: Date;
  updated_at: Date;
}
interface Zns {
  id: number;
  zns_name: string;
  zns_value: string;
  zns_id: string;
  discord_url: string;
  created_at: Date;
  updated_at: Date;
}
interface Zns_message {
  id: number;
  phone_id: number;
  zns_id: string;
  message_id: string;
  message: string;
  time_stamp: string;
  time_send: string;
  created_at: Date;
  updated_at: Date;
}

function formatDateTime(datetimeStr: string): string {
  // Parse the ISO 8601 string into a Date object (assuming the datetimeStr is in UTC)
  const dt = new Date(datetimeStr);

  // Adjust the date to UTC+7 timezone
  dt.setHours(dt.getHours() + 7);

  // Extract the date components
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(dt.getDate()).padStart(2, "0");

  // Extract the time components
  const hours = String(dt.getHours()).padStart(2, "0");
  const minutes = String(dt.getMinutes()).padStart(2, "0");
  const seconds = String(dt.getSeconds()).padStart(2, "0");

  // Combine time and date in the desired format
  const formattedStr = `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;

  return formattedStr;
}

function convertTime(timestring: string): string {
  const timestringInt = parseInt(timestring, 10);
  const date = new Date(timestringInt);

  // Adjust the date to UTC+7 timezone
  date.setHours(date.getHours() + 7);

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear().toString();
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
}
const columns: ColumnsType<Phone> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    render: (text) => <Space>{text}</Space>,
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
    render: (text) => <Tag color="processing">{text}</Tag>,
  },
  {
    title: "Thông tin user",
    dataIndex: "phone_user",
    key: "phone_user",
    render: (text) => <Tag color="processing">{text}</Tag>,
  },
  {
    title: "Ngày tạo",
    key: "created_at",
    dataIndex: "created_at",
    render: (text) => <Space>{formatDateTime(text)}</Space>,
  },
];
const columns_zns: ColumnsType<Zns> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    render: (text) => <Space>{text}</Space>,
  },
  {
    title: "ZNS ID",
    dataIndex: "zns_id",
    key: "zns_id",
    render: (text) => <Tag color="processing">{text}</Tag>,
  },
  {
    title: "Tên ZNS",
    dataIndex: "zns_name",
    key: "zns_name",
    render: (text) => <Tag color="processing">{text}</Tag>,
  },
  {
    title: "Ngày tạo",
    key: "created_at",
    dataIndex: "created_at",
    render: (text) => <Space>{formatDateTime(text)}</Space>,
  },
];
async function sendDiscord(
  message_id: string,
  phoneNumber: string,
  phone_user: string,
  time_send: string,
  name: string,
  discord_url: string
) {
  const info = `1. Đã gửi ZNS tới: ${phoneNumber} - Name: ${name} - Lúc: ${time_send}\n2. Message ID: ${message_id} `;

  const embed = {
    username: `ZNS Logger - ${phone_user}`,
    avatar_url: "https://stc-zaloid.zdn.vn/zaloid/client/images/favicon.png",
    content: info,
  };
  await axios.post(discord_url, embed);
}
const Zns_layout = () => {
  const [datasource, setdata] = useState<Phone[]>([]);
  const [dataZns, setZns] = useState<Zns[]>([]);
  const [dataZnsMessage, setZnsMessage] = useState<Zns_message[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenZns, setIsModalOpenZns] = useState(false);
  const [isModalOpenZnsMessage, setIsModalOpenZnsMessage] = useState(false);
  const [phoneNumberZns, setPhoneNumberZns] = useState("");
  const [status, setStatus] = useState("");
  const [ZnsId, setZnsId] = useState(0);
  const [PhoneId, setPhoneId] = useState(0);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [formZns] = Form.useForm();
  const [formZnsMessage] = Form.useForm();
  const [messageId, setMessageId] = useState("");
  const state = ["Chuẩn bị hàng", "Đang giao hàng", "Hoàn thành"];

  const showModal = () => {
    setIsModalOpen(true);
  };
  const SelectChange = (value: number) => {
    let PhoneZnsChoose = getPhoneValueById(datasource, value);
    setPhoneId(value);
    PhoneZnsChoose && setPhoneNumberZns(PhoneZnsChoose);
  };
  const SelectChangeZns = (value: number) => {
    setZnsId(value);
  };
  const SelectChangeStatus = (value: number) => {
    setStatus(state[value]);
  };
  const handlePhone = () => {
    const token = localStorage.getItem("token");
    form
      .validateFields()
      .then((values) => {
        // console.log("Received values of form: ", values);
        axios
          .post(`https://z-image-cdn.com/phone/add`, values, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers":
                "Access-Control-Allow-Headers, Content-Type, Authorization",
              "Access-Control-Allow-Methods": "*",
              "Accept-Encoding": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              if (response.data.message) {
                message.info("IP Exitst");
              } else {
                message.success(`Đã thêm số điện thoại ${response.data.phone}`);
              }
              setIsModalOpen(false);
            } else {
              message.error("Thêm thất bại");
            }
          })
          .catch((error) => {});
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  const handleZns = () => {
    const token = localStorage.getItem("token");
    formZns
      .validateFields()
      .then((values) => {
        console.log("Received values of form: ", values);
        axios
          .post(`https://z-image-cdn.com/zns/add`, values, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers":
                "Access-Control-Allow-Headers, Content-Type, Authorization",
              "Access-Control-Allow-Methods": "*",
              "Accept-Encoding": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              if (response.data.message) {
                message.info("IP Exitst");
              } else {
                message.success(`Đã thêm số ZNS ID ${response.data.zns_id}`);
              }
              setIsModalOpenZns(false);
            } else {
              message.error("Thêm thất bại");
            }
          })
          .catch((error) => {});
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  function getZnsValueById(array: Zns[], id: number): string | null {
    const found = array.find((item) => item.id === id);
    return found ? found.zns_value : null;
  }
  function getDiscordValueById(array: Zns[], id: number): string | null {
    const found = array.find((item) => item.id === id);
    return found ? found.discord_url : null;
  }
  function getPhoneValueById(array: Phone[], id: number): string | null {
    const found = array.find((item) => item.id === id);
    return found ? found.phone : null;
  }
  function getPhoneUserValueById(array: Phone[], id: number): string | null {
    const found = array.find((item) => item.id === id);
    return found ? found.phone_user : null;
  }
  function getZnsIDById(array: Zns[], id: number): string | null {
    const found = array.find((item) => item.id === id);
    return found ? found.zns_id : null;
  }
  function getRandomChar(): string {
    const characters: string = "0123456789";
    const randomIndex: number = Math.floor(Math.random() * characters.length);
    return characters.charAt(randomIndex);
  }

  function getRandomString(length: number): string {
    let result: string = "";
    for (let i = 0; i < length; i++) {
      result += getRandomChar();
    }
    return result;
  }
  function getCurrentDate(): string {
    const date: Date = new Date();
    const day: number = date.getDate();
    const month: number = date.getMonth() + 1; // getMonth() returns 0-11, so we add 1
    const year: number = date.getFullYear() % 100; // getFullYear() returns the full year, we get the last two digits

    // Pad day and month with leading zeros if needed
    const dayString: string = day < 10 ? `0${day}` : `${day}`;
    const monthString: string = month < 10 ? `0${month}` : `${month}`;
    const yearString: string = year < 10 ? `0${year}` : `${year}`;

    return `${dayString}/${monthString}/${yearString}`;
  }
  function replacePlaceholders(template: string, params: Params): string {
    return template.replace(/\${(.*?)}/g, (match, key) => {
      return (params as any)[key] || match;
    });
  }
  async function sendZns(
    jsonString: string,
    accessToken: string,
    zns_id: string,
    phoneNumber: string,
    phone_user: string,
    name: string
  ) {
    const url = "https://business.openapi.zalo.me/message/template";
    const headers = {
      "Content-Type": "application/json",
      access_token: accessToken,
    };
    let data;
    try {
      data = JSON.parse(jsonString);
    } catch (error) {
      console.error("Invalid JSON string:", error);
      return;
    }
    try {
      const response = await axios.post(url, data, { headers });
      try {
        let sent_time = response.data.data.sent_time;
        let msg_id = response.data.data.msg_id;
        message.success("Gửi tin ZNS thành công");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await checkStateMessageId(msg_id, sent_time);
        let urlDiscord = getDiscordValueById(dataZns, ZnsId);
        urlDiscord &&
          (await sendDiscord(
            msg_id,
            phoneNumber,
            phone_user,
            convertTime(sent_time),
            name,
            urlDiscord
          ));
      } catch (error) {
        message.error(`Gửi tin ZNS thất bại: ${response.data.message}`);
        setConfirmLoading(false);
        setIsModalOpenZnsMessage(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.status);
        console.error("Error data:", error.response?.data);
      } else {
        console.error("Error:", error);
      }
    }
  }
  async function handleZnsMessage() {
    const token = localStorage.getItem("token-zl");
    formZnsMessage
      .validateFields()
      .then((values) => {
        let zns_id = values.zns_id;
        let zns_value = getZnsValueById(dataZns, zns_id);
        let ZNS_ID = getZnsIDById(dataZns, zns_id);
        let zns_data = "";
        if (ZNS_ID && zns_value) {
          const params: Params = {
            phone: phoneNumberZns.slice(1, 10),
            zns_template: ZNS_ID,
            order_code: values.order_code,
            date: getCurrentDate(),
            price: "450000",
            name: values.name,
            status: status,
          };

          zns_data = replacePlaceholders(zns_value, params);
        }
        if (token) {
          setConfirmLoading(true);
          let phoneValue = getPhoneUserValueById(datasource, PhoneId);
          phoneValue &&
            ZNS_ID &&
            sendZns(
              zns_data,
              token,
              ZNS_ID,
              phoneNumberZns,
              phoneValue,
              values.name
            );
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }
  async function findznsMessageByPhoneId(phone_id: number) {
    const token = localStorage.getItem("access_token");
    axios
      .post(
        `https://z-image-cdn.com/list-zns-by-phone-id/${phone_id}`,
        {},
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "Access-Control-Allow-Headers, Content-Type, Authorization",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setZnsMessage(response.data);
        } else {
          message.error("Thêm thểt bị");
        }
      });
  }
  async function findznsMessageByMessageId(messageId: string) {
    const token = localStorage.getItem("access_token");
    axios
      .post(
        `https://z-image-cdn.com/find-zns-message-id/${messageId}`,
        {},
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "Access-Control-Allow-Headers, Content-Type, Authorization",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setZnsMessage(response.data);
        } else {
          message.error("Thêm thểt bị");
        }
      });
  }
  async function InsetZnsMessage(
    delivery_time: string,
    messagestring: string,
    messageId: string,
    time_send: string
  ) {
    let token = localStorage.getItem("access_token");
    let zns_id = ZnsId;
    let ZNS_ID = getZnsIDById(dataZns, zns_id);
    const initialZnsMessageState = {
      id: 0,
      phone_id: PhoneId,
      zns_id: ZNS_ID,
      message_id: messageId,
      message: messagestring,
      time_stamp: delivery_time,
      time_send: time_send,
      created_at: new Date(),
      updated_at: new Date(),
    };

    axios
      .post(`https://z-image-cdn.com/zns-message/add`, initialZnsMessageState, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Access-Control-Allow-Headers, Content-Type, Authorization",
          "Access-Control-Allow-Methods": "*",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          message.info(`Đã thêm ZNS Message Thành công - ${phoneNumberZns}`);
          setConfirmLoading(false);
          setIsModalOpenZnsMessage(false);
          formZnsMessage.resetFields();
        } else {
          message.error("Thêm thất bại");
        }
      })
      .catch((error) => {});
  }
  async function checkStateMessageId(messageId: string, time_send: string) {
    let accessToken = localStorage.getItem("token-zl");
    try {
      const url = `https://business.openapi.zalo.me/message/status?message_id=${messageId}`;
      const headers = {
        "Content-Type": "application/json",
        access_token: accessToken,
      };
      axios
        .get(url, { headers })
        .then(async (response) => {
          const data = response.data.data;
          if (data) {
            const deliveryTime = data.delivery_time;
            if (deliveryTime) {
              message.success(
                `Tin nhắn đã đến lúc ${convertTime(deliveryTime)}`
              );
              await InsetZnsMessage(
                deliveryTime,
                data.message,
                messageId,
                time_send
              );
            } else {
              message.error(`${data.message}`);
              await InsetZnsMessage(
                "Not received",
                data.message,
                messageId,
                time_send
              );
            }
          } else {
            console.error("Data not found in the response");
          }
        })
        .catch((error) => {});
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          error.response.data?.data?.message || "An error occurred"
        );
      } else {
        console.error("An error occurred", error);
      }
    }
  }

  const UpdateZnsMessage = (
    id: number,
    messagestring: string,
    timestamp: string
  ) => {
    let token = localStorage.getItem("access_token");
    axios
      .post(
        `https://z-image-cdn.com/zns-message/update/${id}`,
        { message: messagestring, time_stamp: timestamp },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "Access-Control-Allow-Headers, Content-Type, Authorization",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // setConfirmLoading(false);
          message.info(`Đã cập nhật ZNS Message Thành công`);
        } else {
          message.error("Thêm thểt bị");
        }
      });
  };
  async function CheckMessage(messageId: string, id: number) {
    let accessToken = localStorage.getItem("token-zl");
    try {
      const url = `https://business.openapi.zalo.me/message/status?message_id=${messageId}`;
      const headers = {
        "Content-Type": "application/json",
        access_token: accessToken,
      };

      const response = await axios.get(url, { headers });
      const data = response.data.data;

      if (data) {
        const deliveryTime = data.delivery_time;
        if (deliveryTime) {
          // setConfirmLoading(true);
          message.success(`Tin nhắn đã đến lúc ${convertTime(deliveryTime)}`);
          UpdateZnsMessage(id, data.message, deliveryTime);
        } else {
          message.error(`${data.message}`);
        }
      } else {
        console.error("Data not found in the response");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          error.response.data?.data?.message || "An error occurred"
        );
      } else {
        console.error("An error occurred", error);
      }
    }
  }
  const columns_zns_message: ColumnsType<Zns_message> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <Space>{text}</Space>,
    },
    {
      title: "ZNS ID",
      dataIndex: "zns_id",
      key: "zns_id",
      render: (text) => <Tag color="processing">{text}</Tag>,
    },
    {
      title: "Phone user",
      dataIndex: "phone_user",
      key: "phone_user",
      render: (text) => <Tag color="success">{text}</Tag>,
    },
    {
      title: "Số điện thoại nhận ZNS",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <Tag color="processing">{text}</Tag>,
    },
    {
      title: "Message ID",
      dataIndex: "message_id",
      key: "message_id",
      render: (text) => <Image name={text.slice(0, 12)} />,
    },
    {
      title: "Thông tin ZNS",
      dataIndex: "message",
      key: "message",
      render: (text) => {
        if (text.includes("Zalo")) {
          return <Tag color="processing">Tin nhắn đã đến máy chủ Zalo</Tag>;
        } else {
          return <Tag color="success">Tin nhắn đã đến người dùng</Tag>;
        }
      },
    },
    {
      title: "Thời gian nhận ZNS",
      dataIndex: "time_stamp",
      key: "time_stamp",
      render: (text) => {
        if (text === "Not received") {
          return <Tag color="processing">{text}</Tag>;
        } else {
          return <Tag color="processing">{convertTime(text)}</Tag>;
        }
      },
    },
    {
      title: "Thời gian gửi ZNS",
      dataIndex: "time_send",
      key: "time_send",
      render: (text) => <Tag color="processing">{convertTime(text)}</Tag>,
    },
    {
      title: "Ngày tạo",
      key: "created_at",
      dataIndex: "created_at",
      render: (text) => <Space>{formatDateTime(text)}</Space>,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => CheckMessage(record.message_id, record.id)}
        >
          Kiểm tra
        </Button>
      ),
    },
  ];
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const fetchData = async () => {
      try {
        const response3 = axios.get("https://z-image-cdn.com/list-phone", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const response1 = axios.get("https://z-image-cdn.com/list-zns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const response2 = axios.get(
          "https://z-image-cdn.com/list-zns-message",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const token_zl = axios.get("https://z-image-cdn.com/token-zl", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const [result1, result2, result3, token_res] = await Promise.all([
          response1,
          response2,
          response3,
          token_zl,
        ]);
        setdata(result3.data);
        setZns(result1.data);
        setZnsMessage(result2.data);
        localStorage.setItem("token-zl", token_res.data);
        // message.success("Đã cập nhật token mới");
      } catch (error) {
        console.log(error);
      } finally {
        console.log("done");
      }
    };
    fetchData();
  }, [phoneNumberZns, confirmLoading, isModalOpen, isModalOpenZns]);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <Button
          onClick={() => {
            showModal();
          }}
          type="primary"
          style={{ marginBottom: 16, marginRight: 16 }}
        >
          Thêm số điện thoại mới
        </Button>
        <Button
          onClick={() => {
            setIsModalOpenZns(true);
          }}
          type="primary"
          danger
          style={{ marginBottom: 16, marginRight: 16 }}
        >
          Thêm ZNS mới
        </Button>
        <Button
          onClick={() => {
            setIsModalOpenZnsMessage(true);
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Nhắn tin ZNS đến số điện thoại
        </Button>
      </div>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Table columns={columns} bordered dataSource={datasource} />
        </Col>
        <Col className="gutter-row" span={12}>
          <Table columns={columns_zns} bordered dataSource={dataZns} />
        </Col>
      </Row>
      <Row style={{ marginTop: "10px" }}>
        <span>
          <Input
            type="text"
            value={messageId}
            placeholder="Nhập số Message Id"
            onChange={(values) => {
              setMessageId(values.target.value);
            }}
            style={{
              width: 200,
              marginRight: "10px",
            }}
          />
          <Button
            type="primary"
            style={{
              width: 150,
              marginRight: "10px",
            }}
            onClick={() => {
              findznsMessageByMessageId(messageId);
              setMessageId("");
            }}
          >
            Search Message ID
          </Button>
          <span
            style={{
              marginRight: "10px",
            }}
          >
            Tìm kiếm theo Số điện thoại
          </span>
          <Select
            showSearch
            style={{ width: 400 }}
            placeholder="Search to Select"
            optionFilterProp="children"
            onSelect={(values) => findznsMessageByPhoneId(values)}
            filterOption={(input, option) => {
              const optionText = option?.children
                ? `${option.children[0]} + ${option.children[2]}`
                : "";
              return optionText.toLowerCase().includes(input.toLowerCase());
            }}
            filterSort={(optionA, optionB) => {
              const dateA = new Date(optionA.time);
              const dateB = new Date(optionB.time);
              return dateA.getTime() - dateB.getTime();
            }}
          >
            {datasource
              .sort(
                (a, b) =>
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
              )
              .map((dataItem, index) => (
                <Option
                  key={index}
                  value={dataItem.id}
                  time={new Date(dataItem.updated_at).toISOString()}
                >
                  {dataItem.phone} - {dataItem.phone_user}
                </Option>
              ))}
          </Select>
        </span>
        <Table
          style={{ marginTop: 20 }}
          columns={columns_zns_message}
          bordered
          dataSource={dataZnsMessage}
        />
      </Row>
      <Modal
        title="Thêm Số điện thoại"
        open={isModalOpen}
        onOk={handlePhone}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên người đặt hàng"
            name="phone_user"
            rules={[{ required: true, message: "Nhập tên người đặt hàng" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Thêm ZNS"
        open={isModalOpenZns}
        onOk={handleZns}
        destroyOnClose={true}
        onCancel={() => {
          formZnsMessage.resetFields();
          setIsModalOpenZns(false);
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          form={formZns}
        >
          <Form.Item
            label="ZNS id"
            name="zns_id"
            rules={[{ required: true, message: "Nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ZNS name"
            name="zns_name"
            rules={[{ required: true, message: "Nhập tên người đặt hàng" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ZNS Value"
            name="zns_value"
            rules={[{ required: true, message: "Nhập tên người đặt hàng" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập chuỗi ký tự JSON ZNS" />
          </Form.Item>
          <Form.Item
            label="Discord URl"
            name="discord_url"
            rules={[{ required: true, message: "Nhập tên người đặt hàng" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập chuỗi ký tự URL Discord"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thêm ZNS"
        open={isModalOpenZnsMessage}
        onOk={handleZnsMessage}
        confirmLoading={confirmLoading}
        onCancel={() => setIsModalOpenZnsMessage(false)}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{
            phone_id: 0,
            zns_id: 0,
            name: "",
            order_code: getRandomString(6),
          }}
          autoComplete="off"
          form={formZnsMessage}
        >
          <Form.Item name="phone_id" label="Lựa chọn Số điện thoại">
            <Select
              placeholder="Lựa chọn Số điện thoại nhận ZNS"
              onChange={SelectChange}
              allowClear
            >
              {datasource &&
                datasource.map((phoneItem: Phone, index: number) => {
                  return (
                    <Option value={phoneItem.id} key={phoneItem.id}>
                      {phoneItem.phone} - {phoneItem.phone_user}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item name="zns_id" label="Lựa chọn ZNS">
            <Select
              placeholder="Lựa chọn ZNS"
              onChange={SelectChangeZns}
              allowClear
            >
              {dataZns &&
                dataZns.map((ZnsItem: Zns, index: number) => {
                  return (
                    <Option value={ZnsItem.id} key={ZnsItem.zns_id}>
                      {ZnsItem.zns_id} - {ZnsItem.zns_name}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Nhập tên đối tượng"
            name="name"
            rules={[{ required: true, message: "Nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mã đơn hàng" name="order_code">
            <Input />
          </Form.Item>
          <Form.Item name="status_id" label="Lựa chọn ZNS">
            <Select
              placeholder="Lựa chọn trạng thái đơn hàng"
              onChange={SelectChangeStatus}
              allowClear
            >
              {state.map((item: string, index: number) => {
                return (
                  <Option value={index} key={index}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default Zns_layout;
