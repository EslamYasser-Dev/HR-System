import { Link } from "react-router-dom";
const { VITE_GREENMEA_LINK } = import.meta.env;
const Footer = () => {
  return (
    <footer className="w-full bg-white shadow dark:bg-gray-900">
      <div className="w-full max-w-screen-xl p-2 mx-auto md:p-4">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center mb-2 sm:mb-0 rtl:space-x-reverse">
          </Link>
          <ul className="flex flex-wrap items-center text-xs font-medium text-gray-500 dark:text-gray-400">
            <li>
              <a href={VITE_GREENMEA_LINK} target="_blank" className="hover:underline me-3 md:me-4">About</a>
            </li>
            <li>
              <a href="info@greenmea.net" className="hover:underline">Contact</a>
            </li>
          </ul>
        </div>
        <hr className="my-4 border-gray-200 sm:mx-auto dark:border-gray-700" />
        <span className="block text-xs text-gray-500 sm:text-center dark:text-gray-400">
          © 2025 <a href={VITE_GREENMEA_LINK} target="_blank" className="hover:underline">GreenMEA</a>. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
