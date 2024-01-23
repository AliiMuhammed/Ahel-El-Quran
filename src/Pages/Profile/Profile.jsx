import React from "react";
import "./style/profile.css";
import { getAuthUser } from "./../../Helpers/Storage";
import { FaEdit } from "react-icons/fa";

const Profile = () => {
  const user = getAuthUser();
  return (
    <section className="profile-section">
      <div className="cover-profile">
        <div className="container">
          <div className="profile-detials">
            <button>
              <FaEdit />
            </button>
            <div
              className="user-img"
              style={{ backgroundImage: `url(${user.profileImage})` }}
            ></div>
            <h1>{`${user.firstName} ${user.lastName}`}</h1>
          </div>
        </div>
      </div>
      <div className="container">
        <iframe
          title="prayers"
          id="iframe2"
          style={{
            background: "rgb(255, 255, 255)",
            border: "0px solid rgb(238, 238, 238)",
            width: "100%",
            overflow: "hidden",
            height: "445px",
          }}
          src="https://timesprayer.today/widget_frame.php?frame=2&amp;id=95&amp;sound=true&amp;prayerMethod=5&amp;theme=w3-green"
          bis_size={JSON.stringify({
            x: 493,
            y: 782,
            w: 305,
            h: 150,
            abs_x: 493,
            abs_y: 782,
          })}
        ></iframe>
      </div>
    </section>
  );
};

export default Profile;
