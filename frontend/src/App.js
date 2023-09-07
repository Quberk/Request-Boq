import {BrowserRouter, Routes, Route} from "react-router-dom";
import UserList from "./components/User/UserList";
import AddUser from "./components/User/AddUser";
import EditUser from "./components/User/EditUser";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import Navbar from "./components/Navbar";
import BoqList from "./components/Request BOQ/BoqList";
import EditBoq from "./components/Request BOQ/EditBoq";
import EditMaterial from "./components/Material/EditMaterial";
import Home from "./components/Home/Home";

function App() {
  return ( 
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard/home" element={  
          <>
            <Navbar />
            <Home />
          </>

        }/>

        <Route path="/dashboard/user" element={  
          <>
            <Navbar />
            <UserList />
          </>

        }/>

        <Route path="/dashboard/user/edit/:id" element={  
          <>
            <Navbar />
            <EditUser />
          </>

        }/>

        <Route path="/dashboard/user/add" element={  
          <>
            <Navbar />
            <AddUser />
          </>

        }/>

        <Route path="/dashboard/boq" element={  
          <>
            <Navbar />
            <BoqList />
          </>
        }/>

        <Route path="/dashboard/boq/edit/:id" element={  
          <>
            <Navbar />
            <EditBoq />
          </>
        }/>

        <Route path="/dashboard/material/edit/:id" element={  
          <>
            <Navbar />
            <EditMaterial />
          </>
        }/>

      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
