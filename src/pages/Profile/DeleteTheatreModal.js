import { Modal, message } from "antd";
import { useDispatch } from "react-redux";
import axios from 'axios';
import { config } from "../../App";
import { hideLoading, showLoading } from "../../features/Loader/loaderSlice";

const DeleteTheatreModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  getData,
}) => {
  const dispatch = useDispatch();
  const handleOk = async () => {
    try {
      dispatch(showLoading());
      const theatreId = selectedTheatre._id;
      const response = await axios.put(`${config.endpoint}/theatres/delete-theatre`, {
        theatreId
      })
      console.log(theatreId, response);
      if (response.data.success) {
        message.success(response.data.message);
        getData();
      } else {
        message.error(response.data.message);
        setSelectedTheatre(null);
      }
      setIsDeleteModalOpen(false);
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading);
      setIsDeleteModalOpen(false);
      message.error(err.messagae);
    }
  };
  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedTheatre(null);
  };
  return (
    <>
      <Modal
        title="Delete Theatre?"
        open={isDeleteModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p className="pt-3 fs-18">
          Are you sure you want to delete this theatre?
        </p>
        <p className="pb-3 fs-18">
          This action can't be undone and you'll lose this theatre data.
        </p>
      </Modal>
    </>
  )
}

export default DeleteTheatreModal