// import React from 'react'
// import { NavLink } from 'react-router-dom';

// const Navbar = () => {
//     const navlinks = ["Home",  "Login", ];
//     return (
//         <div>
//             <div className='flex flex-row gap-10 justify-center my-4 font-semi text-lg'>
//                 {navlinks.map((nav) => (
//                     <NavLink
//                         key={nav}
//                         to={`/${nav.toLowerCase()}`}
//                         className={({ isActive }) =>
//                             isActive
//                                 ? "text-orange-500"
//                                 : "text-gray-500"
//                         }
//                     >
//                         {nav}
//                     </NavLink>
//                 ))}
//             </div>
//         </div >
//     )
// }

// export default Navbar