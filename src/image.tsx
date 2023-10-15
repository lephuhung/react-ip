import React from 'react';
import {message, Button } from 'antd';
import { useCopyToClipboard } from './usehooks';

type Props = { name: string}
const Image = ({ name, }: Props) => {
  const [value, copy] = useCopyToClipboard()
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <>
    {contextHolder}
    <Button 
      type='primary' 
      style={{width:'150px'}}
      onClick={() => { messageApi.success(`Đã copy ${name}`); copy(name) }}
    >
      {name}
    </Button>
    </>
  );
}
export default Image;