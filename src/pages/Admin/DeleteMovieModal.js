import { Modal, message } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../features/Loader/loaderSlice";
import axios from "axios";
import { config } from "../../App";

const DeleteMovieModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedMovie,
  setSelectedMovie,
  getData,
}) => {
  const dispatch = useDispatch();
  const handleOk = async () => {
    try {
      dispatch(showLoading());
      const movieId = selectedMovie._id;
      const response = await axios.put(
        `${config.endpoint}/movies/delete-movie`,
        { movieId }
      );

      if (response.data.success) {
        console.log("id and respone ->  ", movieId, response.data);
        message.success(response.data.message);
        getData();
      } else {
        message.error(response.data.message);
        setSelectedMovie(null);
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
    setSelectedMovie(null);
  };
  return (
    <>
      <Modal
        title="Delete Movie?"
        open={isDeleteModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p className="pt-3 fs-18">
          Are you sure you want to delete this movie?
        </p>
        <p className="pb-3 fs-18">
          This action can't be undone and you'll lose this movie data.
        </p>
      </Modal>
    </>
  );
};

export default DeleteMovieModal;
