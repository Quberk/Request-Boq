import React, {useState} from 'react'
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const Auth = async(e) =>{
      e.preventDefault();
      try{
          await axios.post('http://localhost:5000/login',{
              username: username,
              password: password
          });
          navigate("/dashboard/user");
      }catch(error){
          if (error.response){
              setMsg(error.response.data.msg);
          }
      }
    }

    return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4-desktop">

                <form onSubmit={ Auth } className='box'>
                    <p className='has-text-centered'>{msg}</p>
                    <div className="field mt-5">
                        <label className='label'>Username (Nomor telepon)</label>
                        <div className="controls">
                            <input 
                            type="text" 
                            className="input" 
                            placeholder='Username'
                            value={username}
                            onChange={(e)=> setUsername(e.target.value)} />
                        </div>
                    </div>
                    <div className="field mt-5">
                        <label className='label'>Password</label>
                        <div className="controls">
                            <input 
                            type="password" 
                            className="input" 
                            placeholder='********'
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)} 
                            />
                        </div>
                    </div>
                    <div className="field mt-5">
                        <Link to={`Register`} className='button is-success'>
                        Register
                        </Link>
                        <button className='button is-success ml-5'>Login</button>
                    </div>
                    <div className='field mt-5'>
                    
                    </div>
                </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login