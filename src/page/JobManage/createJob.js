import { Button, Col, Form, Input, Row, Select, Switch, message } from "antd";
import Goback from "../../components/Goback";
import { useEffect, useState } from "react";
import { getTags } from "../../services/tagsService";
import { createJob } from "../../services/jobService";
import { getCookie } from "../../helpers/cookie";
import { useForm } from "antd/es/form/Form";
const { TextArea } = Input;

function CreateJob(){
  const [tags, setTags] = useState([]);
  useEffect(() => {
    const fetchApi = async () => {
      const result = await getTags();
      const data = [];
      result.forEach(item => {
        data.push({
          label: item.value,
          value: item.value
        })
      });
      setTags(data);
    }
    fetchApi();
  },[])
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = useForm();
  const rules = [
    {
      required: true,
      message: "Bắt buộc"
    }
  ]
  const handleSubmit = async (e) => {
    const currentDate = new Date();

    // // Lấy thông tin ngày, tháng, năm, giờ, phút, và giây từ đối tượng Date
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0 nên cộng thêm 1
    const year = currentDate.getFullYear().toString();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    // // Tạo chuỗi định dạng
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    const response = await createJob({
      ...e,
      createAt: formattedDate,
      idCompany: parseInt(getCookie("id"))
    });
    if(response){
      form.resetFields();
      messageApi.open({
        type: 'success',
        content: 'Tạo job mới thành công',
      });
    }
    else{
      messageApi.open({
        type: 'error',
        content: 'Tạo job mới thất bại',
      });
    }
  }
  return(
    <>
      {contextHolder}
      <Goback />
      <h2>Tạo job mới</h2>
      <Form layout="vertical" onFinish={handleSubmit} form={form}>
        <Row gutter={[10,0]}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Tên job"
              rules={rules}               
            >
              <Input/>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="tags"
              label="Tags"
              rules={rules}
            >
              <Select
                mode="multiple"
                options={tags}
                showSearch
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="salary"
              label="Mức lương"
              rules={rules}
              
            >
              <Input addonAfter={"$"} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="city"
              label="Thành phố"
              rules={rules}
            >
              <Select
                mode="multiple"
                showSearch
                allowClear
                options={[
                  {
                    label: "Hồ Chí Minh",
                    value: "Hồ Chí Minh"
                  },
                  {
                    label: "Hà Nội",
                    value: "Hà Nội"
                  },
                  {
                    label: "Đà Nẵng",
                    value: "Đà Nẵng"
                  }
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Mô tả"
            >
              <TextArea rows={6} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="status"
              label="Trạng thái"
              valuePropName="checked"
            >
              <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
            </Form.Item>
          </Col>
          <Button htmlType="submit" type="primary">Tạo mới</Button>
        </Row>
      </Form>
    </>
  )
}
export default CreateJob;