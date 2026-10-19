import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { WheelSvg } from "@/components/Wheel";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-ink text-chalk flex items-center justify-center px-6 relative overflow-hidden">
      <WheelSvg className="absolute w-[720px] h-[720px] text-chalk/10 animate-[spin_90s_linear_infinite]" />
      <div className="relative text-center">
        <p className="font-display font-black leading-none text-[10rem] sm:text-[14rem] text-haldi">404</p>
        <p className="font-display font-extrabold uppercase tracking-[0.2em] text-xl mb-8">This page took a wrong turn</p>
        <Link to="/" className="btn-haldi">Back to home</Link>
      </div>
    </div>
  );
};

export default NotFound;
