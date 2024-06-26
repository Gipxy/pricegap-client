import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav className="menu">
        <ul>
          <li>
            <Link to="/balance">Balance</Link>
          </li>
          <li>
            <Link to="/tokens">Token</Link>
          </li>
          <li>
            <Link to="/bep20-list">BEP20</Link>
          </li>
          <li>
            <Link to="/live-check">Live</Link>
          </li>
          <li>
            <Link to="/pairs">Pairs</Link>
          </li>
          {/* <li>
            <Link to="/ws-test">WS Test</Link>
          </li> */}
        </ul>
      </nav>

      <Outlet/>
    </>
  );
};

export default Layout;
