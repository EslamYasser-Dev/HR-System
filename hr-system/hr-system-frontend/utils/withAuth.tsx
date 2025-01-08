// utils/withAuth.tsx

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (!isLoggedIn) {
        router.push("/"); // Change to the desired redirect page
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
