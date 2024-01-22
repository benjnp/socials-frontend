import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/socials_white_trans.png'
import { jwtDecode } from "jwt-decode";
import { client } from '../client'

const Login = () => {
  const navigate = useNavigate();
  const handleSuccess = (credentialResponse) => {
    localStorage.setItem('user', JSON.stringify(credentialResponse.credential))
    const decoded = jwtDecode(credentialResponse.credential);
    const doc = {
      _id: decoded.sub,
      _type: 'user',
      userName: decoded.name,
      image: decoded.picture
    }
    client.createIfNotExists(doc)
    .then(() => {
      navigate('/', { replace: true })
    })
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative h-full w-full">
        <video 
          src={shareVideo}
          type="video/mp4"
          Loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 bottom-0 left-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="200px" alt="logo" />
          </div>
          <div className="shadow-2xl">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            cookiePolicy="single_host_origin"
          />
            {/* <GoogleOAuthProvider 
              clientId=''
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor"
                >
                  <FcGoogle className="mr-4"/> Sign In with Google
                </button>
              )}
            /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login