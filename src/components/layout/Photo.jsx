// Photo.jsx
import React from "react";
import "./Photo.css";

// Import your logos — adjust paths to match your project structure
import NoraLogo from "../../assets/logo/Nora-AI-logo.png";
import ProfilePhoto from "../../assets/logo/Photo-Profile-log.png";

/**
 * Photo component
 *
 * Displays the Nora AI logo inside a large blue-pink gradient circle,
 * with a smaller circular user avatar overlapping at the bottom-right.
 *
 * Props:
 *  - userPhoto  {string}  URL or imported image for the user's avatar.
 *                         Falls back to Photo-Profile-log.png if not provided.
 *  - alt        {string}  Alt text for the user avatar image.
 */
const Photo = ({ userPhoto, alt = "User profile" }) => {
  const avatarSrc = userPhoto || ProfilePhoto;

  return (
    <div className="photo-wrapper">
      <div className="photo-card">
        {/* Large gradient circle with Nora logo */}
        <div className="photo-logo-circle">
          <img
            src={NoraLogo}
            alt="Nora AI logo"
            className="nora-logo"
          />

          {/* Small user avatar overlapping bottom-right of the big circle */}
          <div className="photo-user-avatar">
            <img src={avatarSrc} alt={alt} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photo;
