import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css"; // Import toastr styles
import VirtualKeyboard from "../component/VirtualKeyboard";

export default function Home() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    code: "",
    mobile: "+358",
    address: "",
  });
  const [focusedInput, setFocusedInput] = useState(null);

  const onFocusChange = (e) => {
    setFocusedInput(e.target.name);
  };
  const handleKeyPress = (key) => {
    if (focusedInput === "code") {
      if (key === "C") {
        setCredentials({ ...credentials, code: "" });
      } else if (key === "X") {
        setCredentials({
          ...credentials,
          code: credentials.code.slice(0, -1),
        });
      } else {
        setCredentials({
          ...credentials,
          code: credentials.code + key,
        });
      }
    } else if (focusedInput === "mobile") {
      if (key === "C") {
        setCredentials({ ...credentials, mobile: "+358" });
      } else if (key === "X") {
        // Remove one character at a time until "+358"
        const mobileLength = credentials.mobile.length;
        const plus358Index = credentials.mobile.indexOf("+358");

        if (plus358Index !== -1 && mobileLength > 4) {
          // If "+358" is found and there are characters to remove
          const newMobile = credentials.mobile.slice(0, mobileLength - 1);
          setCredentials({
            ...credentials,
            mobile: newMobile === "+" ? "+358" : newMobile, // Ensure at least "+358" remains
          });
        }
      } else {
        setCredentials({
          ...credentials,
          mobile: credentials.mobile + key,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("code", credentials.code);
    localStorage.setItem("mobile", credentials.mobile);
    localStorage.setItem("address", credentials.address);
    const response = await fetch(`${process.env.REACT_APP_API}/touchscreen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: credentials.code,
        mobile: credentials.mobile,
        address: credentials.address,
      }),
    });

    const json = await response.json();
    console.log(json);

    if (json.success) {
      toastr.success(json.message);
      localStorage.setItem("success", json.success);

      setTimeout(() => {
        toastr.clear();
      }, 50000);
      navigate("/home");
    } else if (!json.success) {
      toastr.error(json.errors.msg);
    } else {
      toastr.error(json.errors.common.msg);
    }
  };
  const handleSubmitCancel = async (e) => {
    localStorage.removeItem("success");
    e.preventDefault();
    const response = await fetch(
      `${process.env.REACT_APP_API}/touchscreen/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          auth_token: "Cancel",
        },
        body: JSON.stringify({
          code: localStorage.getItem("code"),
          mobile: localStorage.getItem("mobile"),
          address: localStorage.getItem("address"),
        }),
      }
    );

    const json = await response.json();
    if (json.success) {
      setCredentials({ code: "", mobile: "+358", address: "" });
      localStorage.removeItem("success");
      localStorage.removeItem("code");
      localStorage.removeItem("mobile");
      localStorage.removeItem("address");
      navigate("/home");
    } else if (!json.success) {
      toastr.error(json.errors.common.msg);
    }
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundSize: "cover",
      }}
    >
      {localStorage.getItem("success") ? (
        <div className="container">
          <button className="m-3 btn btn-success" onClick={handleSubmitCancel}>
            Close Cabinet Door
          </button>
        </div>
      ) : (
        <div className="container">
          <form
            className="w-50 m-auto mt-5 bg-dark rounded"
            style={{ padding: "2PX" }}
            onSubmit={handleSubmit}
          >
            <div className="m-3">
              <label>Enter Location</label>
              <select
                className="form-control"
                name="address"
                value={credentials.address}
                onChange={onChange}
              >
                <option value="">Select a Location</option>
                <option value="Oulu">Oulu</option>
                <option value="Helsinki">Helsinki</option>
                <option value="Tampere">Tampere</option>
                <option value="Turku">Turku</option>
                <option value="Kuopio">Kuopio</option>
              </select>
            </div>
            <div className="m-3">
              <label>Enter Code</label>
              <input
                type="text"
                className="form-control"
                name="code"
                value={credentials.code}
                onChange={onChange}
                onFocus={onFocusChange}
              />
            </div>
            <div className="m-3">
              <label>Mobile Number</label>

              <input
                type="text"
                className="form-control"
                name="mobile"
                value={credentials.mobile}
                onChange={onChange}
                onFocus={onFocusChange}
              />
            </div>

            <button type="submit" className="m-3 btn btn-success">
              Submit
            </button>
          </form>
          <VirtualKeyboard onKeyPress={handleKeyPress} />
        </div>
      )}
    </div>
  );
}
