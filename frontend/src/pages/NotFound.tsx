import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { validateInvite } from "@/hooks/GenerateQrInvite";
import SetPassword from "./SetPassword";

const NotFound = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [inviteValid, setInviteValid] = useState(false);
  const [invite, setInvite] = useState<string>(null);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  useEffect(() => {
    if (!token) return;

    setLoading(true);

    validateInvite(token)
      .then((data) => {
        setInvite(data);
        setInviteValid(true);
      })
      .catch(() => {
        setInviteValid(false);
      })
      .finally(() => setLoading(false));
  }, [token]);

  /* ---------------- INVITE FLOW ---------------- */

  if (token) {
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p>Validating invite...</p>
        </div>
      );
    }

    if (!inviteValid) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Invite Invalid</h2>
            <p className="text-muted-foreground mt-2">
              This invite link is expired or already used.
            </p>
          </div>
        </div>
      );
    }

    return <SetPassword/>;
  }

  /* ---------------- NORMAL 404 ---------------- */

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          Oops! Page not found
        </p>
        <a
          href="/"
          className="text-primary underline hover:text-primary/90"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
