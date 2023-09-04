import React from 'react';
import { Card, message } from 'antd';
import { useCopyToClipboard } from './usehooks';
const { Meta } = Card;
type Props = { name: string, url: string }
const Image = ({ url, name, }: Props) => {
  const [value, copy] = useCopyToClipboard()
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <>
    {contextHolder}
    <Card
      style={{ width: 128, height: 128 }}
      cover={<img alt="example" src={url} />}
      onClick={() => { messageApi.success(`Đã copy ${name}`); copy(name) }}
    >
    </Card>
    </>
  );
}
export default Image;