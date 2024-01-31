import React, { ChangeEvent, useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, useNavigation } from 'react-router-dom';
import { User } from '../types/User.type';

// SPA = Single Page Apllication -> React + Next.js(페이지는 하나지만, 화면은 바뀜)
// SSR = Server Side Render(jsp, thymeleaf) -> 반대
// 톰캣 = j2EE 기반
export const Login = ()=> {
  const [chatUser, setChatUser] = useState<User>({});
  const [rememberId, setRememberId] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(()=>{
    let uiId:any = localStorage.getItem('uiId')
    console.log(uiId);
  if(uiId){
    setChatUser({
      ...chatUser,
      uiId : uiId
    })
    setRememberId(true);
  }
  },[])
  
  const checkRememberId = (evt:any)=>{
    setRememberId(evt.target.checked);
  }
  const changeUser = (evt:ChangeEvent<HTMLInputElement>)=>{
    setChatUser({
      ...chatUser,
      [evt.target.id] : evt.target.value,
    })
    console.log(chatUser);
  }
  // rtk의 create 기능으로 반응형 사용하기(편리함)

  const login = () => {
    //const res = axios.post('http://localhost/api/join', chatUser,{
    axios.post(`http://localhost/api/login`, chatUser,{
      headers : {
        'Content-Type' : 'application/json;charset=UTF-8'
      }
    })
    // console.log(res); // promise의 객체가 담김(비동기)
    .then(res=>{
      console.log(res);
      alert('로그인이 완료 되었습니다.')
      localStorage.setItem('user', JSON.stringify(res.data));
      if(rememberId){
        localStorage.setItem('uiId', res.data.uiId);
      }else{
        localStorage.removeItem('uiId')
      }
      navigate('/main');
    })
    .catch(err=>{
      // 맨 마지막에 선언할 경우 .then과 .post 에러를 다 catch
      setError(true);
      console.log(err);
    })
    // alert(1); // 이 alert은 먼저 실행된다.
    
  }
    return (
      <div className="auth-wrapper">
            <div className="auth-inner">
      <form>
        <h3>Sign In</h3>

        <div className="mb-3">
        {error
        ?
        <div className='text-danger'>
          아이디와 비밀번호를 확인해주세요.
        </div>:''
        }
          <label>ID</label>
          <input
            type="text"
            id="uiId"
            className="form-control"
            placeholder="아이디"
            onChange={changeUser}
            value={chatUser.uiId}
          />
        </div>

        <div className="mb-3">
          <label>PASSWORD</label>
          <input
            type="password"
            id="uiPwd"
            className="form-control"
            placeholder="비밀번호"
            onChange={changeUser}
            value={chatUser.uiPwd}
          />
        </div>

        <div className="mb-3">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
              onChange={checkRememberId} checked={rememberId}
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              &nbsp; Remember Me
            </label>
          </div>
        </div>

        <div className="d-grid">
          <button type="button" className="btn btn-primary" onClick={login}>
            Sign In
          </button>
        </div>
        <p className="forgot-password text-right">
        <a href="#" onClick={()=>{navigate('/sign-up')}}>Sign Up</a>
        </p>
      </form>
      </div>
      </div>
    )
}
