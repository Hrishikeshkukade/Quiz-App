
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(() => {
    // Retrieve the profileImage URL from localStorage or sessionStorage
    return localStorage.getItem("profileImage") || "/blank.jpg";
  });
  const updateProfileImage = (imageURL) => {
  setProfileImage(imageURL);

  localStorage.setItem("profileImage", imageURL);
};
  return (
    <UserContext.Provider value={{ profileImage, updateProfileImage }}>
      {children}
    </UserContext.Provider>
  );
};
