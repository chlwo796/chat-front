import { ChangeEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../types/User.type";

export const SignUp = ()=>{
    const [error, setError] = useState<boolean>(false);
    const [chatUser, setChatUser] = useState<User>({});
    const [errMsg, setErrMsg] = useState<string>('');
    const navigate = useNavigate();
    const join = ()=>{
        if(chatUser.uiId===''){
            setErrMsg('아이디를 입력해주세요.');
            return;
        }
        axios.post('http://localhost/join', chatUser,{
          headers : {
            'Content-Type' : 'application/json;charset=UTF-8'
          }
        })
        // console.log(res); // promise의 객체가 담김(비동기)
        .then(res=>{
          console.log(res);
          alert('회원가입이 완료 되었습니다.')
          localStorage.setItem('user', JSON.stringify(res.data));
          navigate('/sign-in');
        })
        .catch(err=>{
          // 맨 마지막에 선언할 경우 .then과 .post 에러를 다 catch
          setError(true);
          console.log(err);
        })
    }

    const changeUser = (evt:any)=>{
        setChatUser({
          ...chatUser,
          [evt.target.id] : evt.target.value,
        })
        console.log(chatUser);
      }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
        <form>
        <h3>Sign Up</h3>
        <div className="mb-3">
        <div className='text-danger'>
        {errMsg!==''?errMsg:''}
        </div>
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
        <label>비밀번호 확인</label>
        <input type="password" className="form-control" placeholder="비밀번호 확인" id='uiPwdCheck' />
        </div>
        <div className="mb-3">
          <label>NAME</label>
          <input
            type="text"
            id="uiName"
            className="form-control"
            placeholder="이름"
            onChange={changeUser}
            value={chatUser.uiName}
          />
        </div>
        <div className="mb-3">
          <label>PHONE</label>
          <input
            type="text"
            id="uiPhone"
            className="form-control"
            placeholder="전화번호"
            onChange={changeUser}
            value={chatUser.uiPhone}
          />
        </div>
        <div className="mb-3">
          <label>EMAIL</label>
          <input
            type="text"
            id="uiEmail"
            className="form-control"
            placeholder="이메일"
            onChange={changeUser}
            value={chatUser.uiEmail}
          />
        </div>
        <div className="mb-3">
          <label>BIRTH</label>
          <input
            type="date"
            id="uiBirth"
            className="form-control"
            placeholder="생년월일"
            onChange={changeUser}
            value={chatUser.uiBirth}
          />
        </div>
        <div className="mb-3">
          <label>GENDER</label>
          <select id="uiGender"
            className="form-select"
            onChange={changeUser}
          >
          <option value="">성별을 선택해주세요</option>
          <option value="M">남자</option>
          <option value="F">여자</option>
          </select>
        </div>

        <div className="d-grid">
          <button type="button" className="btn btn-primary" onClick={join}>
            Sign Up
          </button>
        </div>
        <p className="forgot-password text-right">
        <a href="#" onClick={()=>{navigate('/sign-in')}}>Login</a>
        </p>
      </form>
      </div>
      </div>
    )
}