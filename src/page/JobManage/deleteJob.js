import { Button, Popconfirm, Tooltip, message } from "antd";
import {DeleteOutlined} from "@ant-design/icons"
import { deleteJob } from "../../services/jobService";

function DeleteJob(props){
  const {record, onReLoad} = props;
  const [messageApi, contextHolder] = message.useMessage();
  const handleDelete = async () => {
    const response = await deleteJob(record.id);
    if(response){
      messageApi.open({
        type: 'success',
        content: 'Đã xóa thành công',
      });
      setTimeout(() => {
        onReLoad();
      },1000)
    }
    else{
      messageApi.open({
        type: 'error',
        content: 'Xóa thất bại',
      });
    }
  }
  return(
    <>
      {contextHolder}
      <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete()}>
        <Tooltip title="Xóa bản ghi">
          <Button danger icon={<DeleteOutlined />}></Button>
        </Tooltip>
      </Popconfirm>
    </>
  )
}
export default DeleteJob;