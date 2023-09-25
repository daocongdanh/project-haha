import { Card, Col, Row, Tag } from "antd";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {  getJobs } from "../../services/jobService";
import { getCompany } from "../../services/companyService";

function Search(){
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city");
  const keyword = searchParams.get("keyword");
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const fectchApi = async () => {
      const result = await getJobs();
      const company = await getCompany();
      const data = [];
      result.forEach(item => {
        data.push({
          ...company.find(itemCp => itemCp.id === item.idCompany),
          ...item
        })
      });
      if(city === "All"){
        if(keyword){
          setJobs(data.filter(item => item.tags.includes(keyword)));
        }
        else setJobs(data);
      }
      else{
        if(city && keyword){
          setJobs(data.filter(item => item.tags.includes(keyword) && item.city.includes(city)));
        }
        else if(city){
          setJobs(data.filter(item => item.city.includes(city)));
        }
        else if(keyword){
          setJobs(data.filter(item => item.tags.includes(keyword)));
        }
        else setJobs([]);
      } 
    }
    fectchApi();
  },[city,keyword])
  return(
    <>
      <div className="container">
        <h2>Kết quả tìm kiếm:
          {city && (<Tag style={{marginLeft: "10px"}}>{city}</Tag>)}
          {keyword && (<Tag style={{marginLeft: "10px"}}>{keyword}</Tag>)}
        </h2>
        <Row gutter={[20,20]}>
          {jobs.length > 0  ? (jobs.map(item => (
            <Col span={8} key={item.id}>
              <Card>
                <Link to={`/job/${item.id}`}>{item.name}</Link>
                <p>Ngôn ngữ: {item.tags.map((itemTag,index) => (
                  <Tag color="blue" key={index+item.id}>{itemTag}</Tag>
                ))}</p> 
                <p>Thành phố: {item.city.map((itemCity,index) => (
                  <Tag color="orange" key={index+item.id}>{itemCity}</Tag>
                ))}</p>
                <p>Lương: <strong>{item.salary} $</strong></p>
                <p>Công ty: <strong>{item.companyName}</strong></p>
                <p>Ngày tạo: <strong>{item.createAt}</strong></p>
              </Card>
            </Col>
          ))) : (<h3>Không tìm thấy</h3>)}
        </Row>
      </div>
    </>
  )
}

export default Search;