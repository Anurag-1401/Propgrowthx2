// import { Link } from "react-router-dom";


// export default function Navbar() {
//   const token = sessionStorage.getItem("token");
//   const role = sessionStorage.getItem("role");

//   return (
//     <nav
//       style={{
//         position: 'fixed',
//         top: '24px',
//         left: '50%',
//         transform: 'translateX(-50%)',
//         width: 'calc(100% - 48px)',
//         maxWidth: '800px',
//         background: 'rgba(255, 255, 255, 0.5)',
//         backdropFilter: 'blur(20px)',
//         WebkitBackdropFilter: 'blur(20px)',
//         borderRadius: '50px',
//         padding: '8px 20px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
//         border: '1px solid rgba(255, 255, 255, 0.18)',
//         zIndex: 1000,
//       }}
//     >
//       <div
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '10px',
//         }}
//       >
//         <img
//           src="/logo.png"
//           alt="PropGrowthX Logo"
//           style={{
//             width: '36px',
//             height: '36px',
//             objectFit: 'contain',
//           }}
//         />
//         <span
//           style={{
//             fontSize: '18px',
//             fontWeight: '600',
//             color: '#1F2937',
//             fontFamily: 'DM Sans, sans-serif',
//           }}
//         >
//           PropgrowthX
//         </span>
//       </div>

//       <div
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '40px',
//         }}
//       >
//         {token && <a
//           href={`dashboard/${role}`}
//           style={{
//             fontSize: '15px',
//             fontWeight: '500',
//             color: '#1F2937',
//             textDecoration: 'none',
//             transition: 'color 0.2s ease',
//             fontFamily: 'DM Sans, sans-serif',
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
//           onMouseLeave={(e) => (e.currentTarget.style.color = '#1F2937')}
//         >
//           Manage your properties
//         </a>}
//         <a
//           href="#how-it-works"
//           style={{
//             fontSize: '15px',
//             fontWeight: '500',
//             color: '#1F2937',
//             textDecoration: 'none',
//             transition: 'color 0.2s ease',
//             fontFamily: 'DM Sans, sans-serif',
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
//           onMouseLeave={(e) => (e.currentTarget.style.color = '#1F2937')}
//         >
//           How it Works
//         </a>
//         <a
//           href="#features"
//           style={{
//             fontSize: '15px',
//             fontWeight: '500',
//             color: '#1F2937',
//             textDecoration: 'none',
//             transition: 'color 0.2s ease',
//             fontFamily: 'DM Sans, sans-serif',
//           }}
//         >
//           Features
//         </a>
//         <a
//           href="#pricing"
//           style={{
//             fontSize: '15px',
//             fontWeight: '500',
//             color: '#1F2937',
//             textDecoration: 'none',
//             transition: 'color 0.2s ease',
//             fontFamily: 'DM Sans, sans-serif',
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
//           onMouseLeave={(e) => (e.currentTarget.style.color = '#1F2937')}
//         >
//           Pricing
//         </a>
//         <a
//           href="/contact"
//           style={{
//             fontSize: '15px',
//             fontWeight: '500',
//             color: '#1F2937',
//             textDecoration: 'none',
//             transition: 'color 0.2s ease',
//             fontFamily: 'DM Sans, sans-serif',
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
//           onMouseLeave={(e) => (e.currentTarget.style.color = '#1F2937')}
//         >
//           Support
//         </a>
//         {token && <a
//           href='profile'
//           style={{
//             fontSize: '15px',
//             fontWeight: '500',
//             color: '#1F2937',
//             textDecoration: 'none',
//             transition: 'color 0.2s ease',
//             fontFamily: 'DM Sans, sans-serif',
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
//           onMouseLeave={(e) => (e.currentTarget.style.color = '#1F2937')}
//         >
//           Profile
//         </a>}
//       </div>

//       <Link to="/auth">
//       <button
//         style={{
//           background: '#EF4444',
//           color: '#FFFFFF',
//           fontSize: '15px',
//           fontWeight: '600',
//           padding: '8px 24px',
//           borderRadius: '100px',
//           border: 'none',
//           cursor: 'pointer',
//           transition: 'all 0.3s ease',
//           boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
//           fontFamily: 'DM Sans, sans-serif',
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.background = '#DC2626'
//           e.currentTarget.style.transform = 'translateY(-1px)'
//           e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.35)'
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.background = '#EF4444'
//           e.currentTarget.style.transform = 'translateY(0)'
//           e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)'
//         }}
//       >
//         Join Now
//       </button>
//       </Link>
//     </nav>
//   )
// }



import { Link ,useLocation,useNavigate} from "react-router-dom";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const id = sessionStorage.getItem('id')
  const [open, setOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fromProperty = location.state?.fromProperty;

  const isActive = (path: string) => {
    if (path === '/profile' && fromProperty) return;
    else if(location.pathname.startsWith(path)){
    return "border-b-2 border-red-500 text-red-600"
    } else {
      return "border-b-2 border-transparent";
    }
  }


  return (
    <nav className="fixed top-6 left-1/2 z-50 w-[calc(100%-32px)] max-w-6xl -translate-x-1/2 rounded-full border border-white/20 bg-white/60 backdrop-blur-xl shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">

        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection("home")}>
            <img src="/logo.png" className="h-9 w-9" />
          <span className="text-lg font-semibold text-gray-800">
            PropGrowthX
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-6">

        {/* <button onClick={() => scrollToSection("home")}
          className={`nav-link ${isActive("/profile")}`}> Home </button>   */}

        {token && (
            <Link to={`/dashboard/${role}`} className={`nav-link ${isActive(`/dashboard/${role}`)}`}>
              Home
            </Link>
          )}

          {!token && (
          <>
            <button
              onClick={() => scrollToSection("how-it-works")}
                className="nav-link"> How it Works </button>

            <button
              onClick={() => scrollToSection("features")}
                className="nav-link">Features</button>

            <button
              onClick={() => scrollToSection("pricing")}
                className="nav-link">Pricing</button>
          </>
          )}

          <Link to="/contact"   className={`nav-link ${isActive("/contact")}`}>Support</Link>

          {token && <Link to={`/profile/${id}`}   className={`nav-link ${isActive("/profile")}`}>Profile</Link>}

          {token && 
          <button onClick={() => {
            sessionStorage.clear();
            window.location.href = "/"; 
          }} className="flex items-center gap-2 rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
       }
        </div>

        {!token && <div className="hidden lg:block">
          <Link to="/auth">
            <button className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-600 transition">
              Sign Up
            </button>
          </Link>
        </div>}



        <button
          className="lg:hidden text-gray-800"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden rounded-2xl bg-white/90 backdrop-blur-xl shadow-xl px-6 py-4 space-y-4">
          {/* <button onClick={() => {scrollToSection("home");setOpen(false)}}
          className={`nav-link ${isActive("/profile")}`}> Home </button>   */}

        {token && (
            <Link to={`/dashboard/${role}`} className={`nav-link ${isActive(`/dashboard/${role}`)}`}>
              Home
            </Link>
          )}

          {!token && (
          <>
            <button onClick={() => {scrollToSection("how-it-works");setOpen(false)}}
                className="nav-link"> How it Works </button>

            <button onClick={() => {scrollToSection("features");setOpen(false)}}
                className="nav-link">Features</button>

            <button
              onClick={() => {scrollToSection("pricing");setOpen(false)}}
                className="nav-link">Pricing</button>
          </>
          )}

          <Link to="/contact" className={`nav-link ${isActive("/contact")}`}>Support</Link>

          {token && <Link to={`/profile/${id}`}  className={`nav-link ${isActive("/profile")}`}>Profile</Link>}

          {token && 
          <button onClick={() => {
            sessionStorage.clear();
            window.location.href = "/"; 
          }} className="flex items-center gap-2 rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
       }

        {!token && <div className="hidden lg:block">
          <Link to="/auth">
            <button className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-600 transition">
              Sign Up
            </button>
          </Link>
        </div>}
        </div>
      )}
    </nav>
  );
}
