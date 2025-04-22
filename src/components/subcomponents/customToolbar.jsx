// import React from 'react';

// const CustomToolbar = ({ label, onView, onNavigate }) => {
//   return (
//     <div className="custom-toolbar flex justify-between items-center bg-gradient-to-r from-orange-600 to-orange-400 text-white p-4 rounded-lg shadow-md">
//       {/* Navigation buttons */}
//       <div className="flex gap-4">
//         <button
//           onClick={() => onNavigate('TODAY')}
//           className="px-5 py-2 rounded-full bg-white text-orange-600 hover:bg-orange-100 transition-all duration-200"
//         >
//           Today
//         </button>
//         <button
//           onClick={() => onNavigate('PREV')}
//           className="px-5 py-2 rounded-full bg-white text-orange-600 hover:bg-orange-100 transition-all duration-200"
//         >
//           Back
//         </button>
//         <button
//           onClick={() => onNavigate('NEXT')}
//           className="px-5 py-2 rounded-full bg-white text-orange-600 hover:bg-orange-100 transition-all duration-200"
//         >
//           Next
//         </button>
//       </div>

//       {/* Current view label */}
//       <div className="text-2xl font-semibold tracking-wider">{label}</div>

//       {/* View switch buttons */}
//       <div className="flex gap-4">
//         <button
//           onClick={() => onView('month')}
//           className="px-4 py-2 rounded-full bg-white text-orange-600 hover:bg-orange-100 transition-all duration-200"
//         >
//           Month
//         </button>
//         <button
//           onClick={() => onView('week')}
//           className="px-4 py-2 rounded-full bg-white text-orange-600 hover:bg-orange-100 transition-all duration-200"
//         >
//           Week
//         </button>
//         <button
//           onClick={() => onView('day')}
//           className="px-4 py-2 rounded-full bg-white text-orange-600 hover:bg-orange-100 transition-all duration-200"
//         >
//           Day
//         </button>
//         <button
//           onClick={() => onView('agenda')}
//           className="px-4 py-2 rounded-full bg-white text-orange-600 hover:bg-orange-100 transition-all duration-200"
//         >
//           Agenda
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CustomToolbar;
