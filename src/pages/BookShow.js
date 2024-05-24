import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { message, Card, Row, Col, Button } from "antd";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import { showLoading, hideLoading } from "../features/Loader/loaderSlice";
import axios from "axios";
import { config } from "../App";

const BookShow = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [show, setShow] = useState();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const { data } = await axios.post(
        `${config.endpoint}/shows/get-show-by-id`,
        {
          showId: params.id,
        }
      );
      if (data.success) {
        setShow(data.data);
        // message.success(response.message);
      } else {
        message.error(data.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      message.error(err.message);
      dispatch(hideLoading());
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const getSeats = () => {
    let columns = 12;
    let totalSeats = 120;
    let rows = totalSeats / columns; // 10

    return (
      <div className="d-flex flex-column align-items-center">
        <div className="w-100 max-width-600 mx-auto mb-25px">
          <p className="text-center mb-10px">
            Screen this side, you will be watching in this direction
          </p>
          <div className="screen-div"></div>
        </div>
        <ul className="seat-ul justify-content-center">
          {Array.from(Array(rows).keys()).map((row) => {
            return Array.from(Array(columns).keys()).map((column) => {
              let seatNumber = row * columns + column + 1;

              // Calculation for the first iteration
              // 0*12 + 0+1 = 1
              // 0*12 + 1+1 = 2
              // 0*12 + 2+1 = 3
              // So on up till 12th seat

              // Calculation for the second iteration
              // 1*12 + 0+1 = 13
              // 1*12 + 1+1 = 14
              // 1*12 + 2+1 = 15
              // So on up till 24th seat

              // Calculation for the third iteration
              // 2*12 + 0+1 = 25
              // 2*12 + 1+1 = 26
              // 2*12 + 2+1 = 27
              // So on up till 36th seat

              // So on...

              // this part

              let seatClass = "seat-btn";

              if (selectedSeats.includes(seatNumber)) {
                seatClass += " selected";
              }
              if (show.bookedSeats.includes(seatNumber)) {
                seatClass += " booked";
              }

              if (seatNumber <= totalSeats)
                return (
                  <li>
                    <button
                      className={seatClass}
                      onClick={() => {
                        if (selectedSeats.includes(seatNumber)) {
                          setSelectedSeats(
                            selectedSeats.filter(
                              (curSeatNumber) => curSeatNumber !== seatNumber
                            )
                          );
                        } else {
                          setSelectedSeats([...selectedSeats, seatNumber]);
                        }
                      }}
                    >
                      {seatNumber}
                    </button>
                  </li>
                );
            });
          })}
        </ul>

        <div className="d-flex bottom-card justify-content-between w-100 max-width-600 mx-auto mb-25px mt-3">
          <div className="flex-1">
            Selected Seats: <span>{selectedSeats.join(", ")}</span>
          </div>
          <div className="flex-shrink-0 ms-3">
            Total Price:{" "}
            <span>Rs. {selectedSeats.length * show.ticketPrice}</span>
          </div>
        </div>
      </div>
    );
  };

  const book = async (transactionId) => {
    try {
      dispatch(showLoading());
      
      const { data } = await axios.post(
        `${config.endpoint}/bookings/book-show`,
        {
          show: params.id,
          transactionId,
          seats: selectedSeats,
          user: user._id,
        }
      );
      if (data.success) {
        message.success("Show Booking done!");
        navigate("/profile");
      } else {
        message.error(data.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      message.error(err.message);
      dispatch(hideLoading());
    }
  };

  const onToken = async (token) => {
    try {
      dispatch(showLoading());
      
      const { data } = await axios.post(
        `${config.endpoint}/bookings/make-payment`,
        {
          token,
          amount: selectedSeats.length * show.ticketPrice * 100,
        }
      );
      if (data.success) {
        message.success(data.message);
        book(data.data);
        // console.log(response);
      } else {
        message.error(data.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      message.error(err.message);
      dispatch(hideLoading());
    }
  };

  return (
    <>
      {show && (
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title={
                <div className="movie-title-details">
                  <h1>{show.movie.title}</h1>
                  <p>
                    Theatre: {show.theatre.name}, {show.theatre.address}
                  </p>
                </div>
              }
              extra={
                <div className="show-name py-3">
                  <h3>
                    <span>Show Name:</span> {show.name}
                  </h3>
                  <h3>
                    <span>Date & Time: </span>
                    {moment(show.date).format("MMM Do YYYY")} at{" "}
                    {moment(show.time, "HH:mm").format("hh:mm A")}
                  </h3>
                  <h3>
                    <span>Ticket Price:</span> Rs. {show.ticketPrice}/-
                  </h3>
                  <h3>
                    <span>Total Seats:</span> {show.totalSeats}
                    <span> &nbsp;|&nbsp; Available Seats:</span>{" "}
                    {show.totalSeats - show.bookedSeats.length}{" "}
                  </h3>
                </div>
              }
              style={{ width: "100%" }}
            >
              {getSeats()}

              {selectedSeats.length > 0 && (
                <StripeCheckout
                  token={onToken}
                  billingAddress
                  amount={selectedSeats.length * show.ticketPrice * 100}
                  stripeKey="pk_test_51P5S7NSBymNZsASnoQR6LSr9bME2pyWAXMKbU7yt8YZ1cb3edIwDwwhgYF6X0LrB3uam2glTFSNoJzkQ7hpmdfnm00apdepngN"
                >
                  {/* Use this one in some situation=> pk_test_eTH82XLklCU1LJBkr2cSDiGL001Bew71X8  */}
                  <div className="max-width-600 mx-auto">
                    <Button type="primary" shape="round" size="large" block>
                      Pay Now
                    </Button>
                  </div>
                </StripeCheckout>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default BookShow;
