// import Input from "@mui/material/Input";
// import { useState } from "react";

// export default function ModifierForm() {
//   const [showModifierForm, setShowModifierFOrm] = useState(false);

//   let showform=()=>{
//     setShowModifierFOrm(true);
//   }

//   return (
//     <div>

//         {
//             showModifierForm ? <p>Modifier Form</p> : <button onClick={showform}>Add Modifier</button>
//         }
        
//       <div className="space-y-1">
//         <label className="text-xs text-gray-400 ml-1">Modifier Name</label>
//         <input
//           name="name"
//           required
//           className="p-3 bg-black/40 border border-white/10 rounded-lg w-full text-white focus:border-sky-500 outline-none"
//           placeholder="ex. Paneer Tikka"
//           value={}
//           onChange={}
//         />
//       </div>
//       <div className="space-y-1">
//         <label className="text-xs text-gray-400 ml-1">
//           Modifier Description
//         </label>
//         <input
//           name="description"
//           className="p-3 bg-black/40 border border-white/10 rounded-lg w-full text-white focus:border-sky-500 outline-none"
//           placeholder="ex. Tasty paneer tikka"
//           value={}
//           onChange={}
//         />
//       </div>
//       <div className="space-y-1">
//         <label className="text-xs text-gray-400 ml-1">Price (USD)</label>
//         <input
//           name="price"
//           type="number"
//           required
//           className="p-3 bg-black/40 border border-white/10 rounded-lg w-full text-white focus:border-sky-500 outline-none"
//           placeholder="ex. 50"
//           value={}
//           onChange={}
//         />
//       </div>
//       {/* // IsIncluded */}

//       <div className="space-y-1">
//         <label className="text-xs text-gray-400 ml-1">Checkbox</label>
//         <input
//           name="isIncluded"
//           type="checkbox"
//           className="p-3 bg-black/40 border border-white/10 rounded-lg w-full text-white focus:border-sky-500 outline-none"
//           value={}
//           onChange={}
//         />
//       </div>
//     </div>
//   );
// }
