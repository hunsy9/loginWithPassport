import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";

function App() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const handleOnChange = (e) => {
    console.log(e.target.name + ": " + e.target.value);
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnClick = () => {
    const { email, password } = inputs;

    // users 배열에 추가할 user 객체
    const user = { email, password };
  };
  return (
    <div className="App">
      <input label="아이디" name="email" onChange={handleOnChange}></input>
      <input label="비밀번호" name="password" onChange={handleOnChange}></input>
      <button
        onClick={async () => {
          console.log(inputs.email);
          console.log(inputs.password);
          handleOnClick();
          fetch(
            "http://localhost:8080/login?email=" +
              inputs.email +
              "&pw=" +
              inputs.password,
            {
              method: "post",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
              credentials: "include",
            }
          );
        }}
      >
        로그인
      </button>
      <button
        onClick={async () => {
          fetch("http://localhost:8080/logout");
        }}
      >
        로그아웃
      </button>
      <button
        onClick={async () => {
          fetch("http://localhost:8080/user");
        }}
      >
        유저확인
      </button>
    </div>
  );
}

export default App;
