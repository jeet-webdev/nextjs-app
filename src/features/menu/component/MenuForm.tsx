import { RestaurantFormState } from "@/features/restaurants/types";
import { Delete, Edit2, Plus, VenetianMaskIcon } from "lucide-react";
import { useEffect } from "react";

type MenuFormProps = {
  setForm: React.Dispatch<React.SetStateAction<RestaurantFormState>>;
    // onSubmit: (data: MenuFormData) => void;
};

export default function MenuForm({ setForm }: MenuFormProps) {

  
  return (
    <div className="rounded-2xl  hover:border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-lg font-semibold mb-4">Create Menu Item</h2>
    
<div className=" hover:border-sky-500 m-5 rounded-2xl p-3">


  <p 
  className="p-2 mt-10 font-semibold border-b hover:border-b-sky-500  rounded-xl hover:text-sky-500 flex items-center justify-center "
  >Add Menu Name, Price, Description And Image</p>
  <div className="flex gap-3 mt-3">
    <Plus className="h-8 w-8 text-green-400 bg-green-100 rounded-2xl p-2  hover:text-green-900" />

  </div>
  
<div className=" mt-3 menu-field grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 border border-white/10 rounded-lg p-4">
{/* menu name */}
  <input
    className="p-3 mt-4 bg-black/40 border border-white/10 rounded-lg w-full"
    placeholder="Add Menu Name"
    // value={}
    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
  />

  {/* menu description */}
  <input
    className="p-3 mt-4 bg-black/40 border border-white/10 rounded-lg w-full"
    placeholder="Add Menu Description"
    // value={}
    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
  />

  {/* menu price */}
  <input
    className="p-3 mt-4 bg-black/40 border border-white/10 rounded-lg w-full"
    placeholder="Add Menu Price"
    // value={}
    onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
  />

    {/* menu image url */}
  <input
    className="p-3 mt-4 bg-black/40 border border-white/10 rounded-lg w-full"
    placeholder="Add Menu Image URL"
    // value={}
    onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
  />   

  {/* menu category */}
    <input
    className="p-3 mt-4 bg-black/40 border border-white/10 rounded-lg w-full"
    placeholder="Add Menu Category"
    // value={}
    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
  />   

  {/* menu subcategory */}
   <input
    className="p-3 mt-4 bg-black/40 border border-white/10 rounded-lg w-full"
    placeholder="Add Menu Subcategory"
    // value={}
    onChange={(e) => setForm((prev) => ({ ...prev, subcategory: e.target.value }))}
  />   
  
  {/* menu discount price */}
   <input
    className="p-3 mt-4 bg-black/40 border border-white/10 rounded-lg w-full"
    placeholder="Add Menu Discount Price"
    // value={}
    onChange={(e) => setForm((prev) => ({ ...prev, discountPrice: e.target.value }))}
  />    
  
  {/* menu availability */}
  <input
    className="p-3 mt-4 bg-black/40 border border-white/10 rounded-lg w-full"
    placeholder="Add Menu Availability"
    // value={}
    onChange={(e) => setForm((prev) => ({ ...prev, availability: e.target.value }))}
  />   
 
  <div className="flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-3 ">
  
  <Edit2 className="h-10 w-10 text-yellow-400 bg-yellow-500/10 rounded-2xl p-2 hover:text-yellow-900 flex justify-end" />
  <VenetianMaskIcon className="h-10 w-10 text-blue-400 bg-blue-500/10 rounded-2xl p-2 hover:text-blue-900 flex justify-end" />
  <Delete className="h-10 w-10 text-red-400 bg-red-500/10 rounded-2xl p-2 hover:text-red-900 flex justify-end" />
</div>
 </div>
<button type="button"  className="p-3 mt-3 bg-sky-600 hover:bg-sky-700 rounded-lg font-semibold disabled:opacity-60">
            Save Menu
</button>
    </div>
      
    </div>
  );
}