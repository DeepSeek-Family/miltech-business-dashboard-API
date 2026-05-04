import { Link } from "react-router-dom";

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Sora", sans-serif;
  }
  html, body, #root {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;
  }
  body {
    background: linear-gradient(45deg, #22b455, #1dd1a1);
  }
  .container {
    width: 550px;
    height: 350px;
    border-radius: 50px;
    background: #e0e0e0;
    box-shadow: 12px 12px 23px #bebebe, -12px -12px 23px #fff;
    text-align: center;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .container h1 {
    font-size: 10rem;
    background: linear-gradient(45deg, #22b455, #1dd1a1) center;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    font-weight: 750;
  }
  .container h2 {
    color: #204829;
    margin-top: -10px;
    margin-bottom: 10px;
  }
  .container p {
    color: #204829;
    font-weight: 450;
    margin: 10px;
  }
  .container .btn {
    padding: 12px 24px;
    border-radius: 20%;
    border: none;
    background: linear-gradient(to left, #22b455, #1dd1a1, #22b455);
    background-size: 200%;
    color: white;
    cursor: pointer;
    transition: 0.3s linear;
  }
  .container .btn:hover {
    background-position: right;
  }
`;

const NotFound = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <h1>404</h1>
        <h2>Oops, Page Not Found</h2>
        <p>Page that you're looking for isn't found</p>
        <Link to="/">
          <button className="btn">Go Back</button>
        </Link>
      </div>
    </>
  );
};

export default NotFound;
