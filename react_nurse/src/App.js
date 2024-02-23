import React, {createContext} from "react";
import "./style.css";
import  NurseList from "./core/Nurse/NurseList";

export const UserContext = createContext()
export default function App() {
  return (
    <UserContext.Provider value={{api_url: 'http://localhost:3001/'}}>
      <NurseList />
    </UserContext.Provider>
  );
}
