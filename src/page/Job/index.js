import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobsById } from "../../services/jobService";
import { Button, Col, Form, Input, Row, Select, Tag, message } from "antd";
import { useForm } from "antd/es/form/Form";
import Goback from "../../components/Goback";
import { createCV } from "../../services/cvService";

function Job(){
  const param = useParams();
  const { TextArea } = Input;
  const {id} = param;
  const [job, setJob] = useState("");
  const [city, setCity] = useState("");
  useEffect(() => {
    const fetchApi = async () => {
      const result = await getJobsById(id);
      setJob(result);
      const data = [];
      result.city.forEach(item => {
        data.push({
          value: item,
          label: item
        })
      });
      setCity(data);
    }
    fetchApi();
  },[])
  const rules=[
    {
      required: true,
      message: 'Bắt buộc',
    },
  ];
  const [form] = useForm();
  const handleClick = () => {
    form.scrollToField("form");
  }
  const [messageApi, contextHolder] = message.useMessage();
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
    const response = await createCV({
      ...e,
      idCompany: job.idCompany,
      idJob: parseInt(id),
      createAt: formattedDate
    })
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
      <div className="container" style={{fontSize: "18px"}}>
          <Goback/>
          {job && (
            <>
              <h1>{job.name}</h1>
              <Button type="primary" onClick={handleClick}>Ứng tuyển ngay</Button>
              <p>Tags: {job.tags.map((item, index) => (
                <Tag color="blue" key={index}>{item}</Tag>
              ))}</p>
              <p>Thành phố: {job.city.map((item, index) => (
                <Tag color="orange" key={index}>{item}</Tag>
              ))}</p>
              <p>Mức lương: <strong>{job.salary} $</strong></p>
              <p>Địa chỉ công ty: <strong>{job.adress}</strong></p>
              <p>Thời gian đăng bài: <strong>{job.createAt}</strong></p>
              <p>Mô tả công việc:</p>
              <p>{job.description}</p>
            </>
          )}
          <Form id="form" form={form} onFinish={handleSubmit} layout = "vertical" style={{border: "1px solid #ddd", borderRadius: "10px", padding: "20px"}}>
            <h2>Ứng tuyển ngay</h2>
            <Row gutter={[20,20]}>
                <Col span={6}>
                  <Form.Item
                     label="Họ tên"
                     name="name"
                     rules={rules}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                     label="Số điện thoại"
                     name="phone"
                     rules={rules}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                     label="Email"
                     name="email"
                     rules={rules}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                     label="Thành phố"
                     name="city"
                     rules={rules}
                  >
                    <Select
                      showSearch
                      options={city}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                     label="Giới thiệu bản thân"
                     name="description"
                     rules={rules}
                  >
                    <TextArea rows={6}/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                     label="Danh sách link project đã làm"
                     name="linkProject"
                     rules={rules}
                  >
                    <TextArea  rows={6}/>
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item>
                      <Button htmlType="submit" type="primary">Gửi yêu cầu</Button>
                  </Form.Item>
                </Col>
            </Row>
          </Form>
      </div>
    </>
  )
}

export default Job;