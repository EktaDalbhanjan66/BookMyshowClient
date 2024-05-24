import { Tabs } from "antd";
import TheatreList from "./TheatreList";
import Bookings from "./Bookings";

const Profile = () => {
  const items = [
    {
      key: "1",
      label: "Theatres",
      children: <TheatreList />,
    },
    {
      key: "2",
      label: "Bookings",
      children: <Bookings />,
    },
  ];

  return (
    <>
      <h1>Profile Page</h1>
      <Tabs defaultActiveKey="2" items={items} />
    </>
  );
};

export default Profile;
