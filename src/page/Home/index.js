import { Button, Col, Form, Input, Row, Select, Tag } from "antd"
import { useEffect, useState } from "react";
import { getTags } from "../../services/tagsService";
import { Link, Outlet, useNavigate } from "react-router-dom";
function Home(){
  const [tags, setTags] = useState([]);
  useEffect(() => {
    const fetchApi = async () => {
      const result = await getTags();
      setTags(result);
    }
    fetchApi();
  },[])
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    navigate(`/search?city=${e.city ? (e.city) : ("")}&keyword=${e.keyword ? (e.keyword) : ("")}`);
  }
  const handleClick = (e) => {
    navigate(`/search?keyword=${e.target.id}`);
  }
  const options = [
    {
      value: "All",
      label: "All"
    },
    {
      value: "Hà Nội",
      label: "Hà Nội"
    },
    {
      value: "Hồ Chí Minh",
      label: "Hồ Chí Minh"
    },
    {
      value: "Đà Nẵng",
      label: "Đà Nẵng"
    },
  ]
  return(
    <>
      <div className="main">
        <div className="container">
          <h2 className="main-title" style={{fontSize: "30px"}}>1000+ IT Jobs For Developers</h2>
          <Form onFinish={handleSubmit}>
            <Row gutter={[20,20]}>
              <Col span={8}>
                <Form.Item
                  name="city"
                >
                  <Select
                    showSearch
                    placeholder="Chọn thành phố"
                    options={options}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="keyword"
                >
                  <Input
                    placeholder="Nhập từ khóa"
                  />
                </Form.Item>
              </Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">Tìm kiếm</Button>
              </Form.Item>
            </Row>
          </Form>
          <div className="tags">
            {tags && tags.map(item => (
              <Tag id={item.value} key={item.key} style={{cursor: "pointer"}} color="blue" onClick={handleClick}>{item.value}</Tag>
            ))}
          </div>
        </div>
        <Outlet/>
        <div className="container">
          <Link to="/company"><Button style={{marginTop: "20px"}}>Xem thêm</Button></Link>
        </div>
      </div>
    </>
  )
}

export default Home
