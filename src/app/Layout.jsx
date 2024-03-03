import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav className="menu">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/compare">Compare</Link>
          </li>
          <li>
            <Link to="/hot-list">HotList</Link>
          </li>
          <li>
            <Link to="/pairs">Pairs</Link>
          </li>
          <li>
            <Link to="/live-check">Live Check</Link>
          </li>
          <li>
            <Link to="/ws-test">WS Test</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
