import { createContext, useContext, useState } from "react";
import io from "socket.io-client";
const UserDetailsContext = createContext(null);

export const useUserDetails = () => {
  return useContext(UserDetailsContext);
};

export const UserDetailsProvider = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  return (
    <UserDetailsContext.Provider
      value={{
        name,
        setName,
        email,
        setEmail,
        userId,
        setUserId,
      }}
    >
      {props.children}
    </UserDetailsContext.Provider>
  );
};
