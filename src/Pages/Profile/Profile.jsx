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
    </section>
  );
};

export default Profile;
