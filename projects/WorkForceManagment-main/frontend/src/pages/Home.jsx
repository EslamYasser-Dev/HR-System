import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <section className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            We invest in the world’s potential
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
            to Get started you must define your devices then assign them to
            employees so you can get started from here ...
          </p>
          {/* <Link
            to="/devices"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          >
            Manage your Devices
            <svg
              className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link> */}

          <Link
            to="/employees"
            className="py-3 px-5 sm:ms-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-70"
          >
            Manage your Employees
          </Link>

          <p className="h-200 m-20">
            Lorem ipsum dolor sit, ame consectetur adipisicing elit. Autem,
            assumenda facere, delectus illo, temporibus quibusdam soluta error
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, eum?
            Et facere fugiat inventore corrupti soluta, necessitatibus autem
            voluptate modi aliquid, repellendus esse, quo ex. Maxime optio
            accusantium doloremque Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Excepturi cupiditate, earum quae ducimus mollitia
            et veniam eos aliquam in expedita? Hic quidem delectus optio
            adipisci asperiores amet nulla dolorum necessitatibus? sapiente
            aperiam voluptas quae dolorum doloremque beatae. Sunt architecto
            dolorum tempora? Tempore, nulla Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Error officia deserunt optio
            reiciendis veniam eos blanditiis cupiditate amet placeat unde
            magnam, ratione fuga obcaecati. Odio sit quasi ullam vero nobis?
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
