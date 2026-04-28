import { type RestaurantFormState } from "@/features/restaurants/types";
import { RestaurantStatus } from "@prisma/client";
import { Delete, Edit, Edit2,  Plus, VenetianMaskIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

type RestaurantsFormProps = {
  onSubmit: (e: React.FormEvent) => void;
  form: RestaurantFormState;
  setForm: React.Dispatch<React.SetStateAction<RestaurantFormState>>;
  isSubmitting: boolean;
  error?: string;
  allCount: number;
  isEditing?: boolean;
  onCancel?: () => void;
};


const STORAGE_KEY = "site-theme";

export default function RestaurantsForm({ onSubmit, form, setForm, isSubmitting, error, allCount, isEditing = false, onCancel, }: RestaurantsFormProps) {
  const [theme, setTheme] = useState<string | null>(null);
  
  useEffect(() => {
  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    setTheme(storedTheme);
    // applyTheme(storedTheme);
  }
},  []);
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6 mb-8">
      <h2 className="text-base sm:text-lg font-semibold mb-4">{isEditing ? "Edit Restaurant" : "Create Restaurant"}</h2>

      <form className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" onSubmit={onSubmit}>
        {/* Basic Info Fields */}
        <div>
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg w-full"
          placeholder="Restaurant Name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
           aria-errormessage={error}

        />
        { !form.name?error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Restaurant name is required.</p> : null} 
        {/* {!form.name && <p className="mt-2 text-xs sm:text-sm text-rose-400">Restaurant name is required.</p>} */}
  
     
        </div>
     
        <div>

        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg w-full"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
        aria-errormessage={error}
        />
        {!form.city?error && <p className="mt-2 text-xs sm:text-sm text-rose-400">City is required.</p> : null}
        
        </div>
        <div>
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg w-full"
          placeholder="Slug (unique identifier for URL)"
          value={form.slug}
          onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
         aria-errormessage={error}
        />
        
        {!form.slug?error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Slug is required.</p> : null}
   
        </div>
<div>
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg w-full"
          placeholder="Restaurant Address"
          value={form.address}
          onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
          aria-errormessage={error}
        />
        {!form.address?error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Address is required.</p> : null}
        </div>

        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg w-full"
          placeholder="Logo URL"
          value={form.logo}
          onChange={(e) => setForm((prev) => ({ ...prev, logo: e.target.value }))}
        />
       

        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="SEO Title"
          value={form.seoTitle}
          onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
        />

        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="SEO Description"
          value={form.seoDescription}
          onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
        />
         <input 
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Title"
          value={form.content.heroTitle}
          onChange={(e) => setForm((prev) => ({ ...prev, content: { ...prev.content, heroTitle: e.target.value } }))}
        />
          <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Description"
          value={form.content.heroDescription}
          onChange={(e) => setForm((prev) => ({ ...prev, content: { ...prev.content, heroDescription: e.target.value } }))}
        />
          <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Hero Image URL"
          value={form.content.heroImageUrl}
          onChange={(e) => setForm((prev) => ({ ...prev, content: { ...prev.content, heroImageUrl: e.target.value } }))}
        />



        <input 
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Title"
          value={form.content.title}
          onChange={(e) => setForm((prev) => ({ ...prev, content: { ...prev.content, title: e.target.value } }))}
        />
        <input 
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Description"
          value={form.content.description}
          onChange={(e) => setForm((prev) => ({ ...prev, content: { ...prev.content, description: e.target.value } }))}
        />
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Image URL"
          value={form.content.imageUrl}
          onChange={(e) => setForm((prev) => ({ ...prev, content: { ...prev.content, imageUrl: e.target.value } }))}
        />
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Menu Book URL"
          value={form.content.menuBookUrl}
          onChange={(e) => setForm((prev) => ({ ...prev, content: { ...prev.content, menuBookUrl: e.target.value } }))}
        />
        {/* Contact Info Fields */}
        {/* Website */}
<div>
  <input
  className="p-3 bg-black/40 border border-white/10 rounded-lg w-full"
  placeholder="Website URL"
  value={form.contactInfo.website}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, website: e.target.value },
    }))
  }
// aria-errormessage={error}
/>
{/* {!form.contactInfo.website ? error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Website URL is required.</p> : null} */}
</div>
        <div>
        <input
  className="p-3 bg-black/40 border border-white/10 rounded-lg w-full"
  placeholder="Phone Number"
  value={form.contactInfo.phone}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, phone: e.target.value },
    }))
  }
  aria-errormessage={error}
 
        />
        {!form.contactInfo.phone ? error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Phone number is required.</p> : null}
        </div>

{/* Email Input */}
<div>
<input
  className="p-3 bg-black/40 border border-white/10 rounded-lg w-full"
  placeholder="Email Address"
  value={form.contactInfo.email}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, email: e.target.value },
    }))
  }
aria-errormessage={error}
/>
{!form.contactInfo.email ? error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Email address is required.</p> : null}
</div>

{/* Opening Hours */}

{/* Opening Hours Section */}
<div className="flex flex-col gap-2">
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <TimePicker
      label="Opening Hours"
      value={form.contactInfo.openingHours ? dayjs(form.contactInfo.openingHours, "HH:mm") : null}
      onChange={(newValue) => {
        const formattedTime = newValue ? newValue.format("HH:mm") : "";
        setForm((prev) => ({
          ...prev,
          contactInfo: { ...prev.contactInfo, openingHours: formattedTime },
        }));
      }} 
      
      slotProps={{
        textField: {
          fullWidth: true,
          // className: "border border-white/10 rounded-lg",
          className:`rounded-lg ${window.localStorage.getItem(STORAGE_KEY) === "light" ? "bg-pink-200/20 " : "bg-emerald-400/20 "} border border-white/10` ,
          sx: {
            input: { color: 'rgba(216, 2, 2, 0.88)'  },
            label: { color: 'rgba(255,255,255,0.5)' },
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
          }
          
        }
      }}
    />
  </LocalizationProvider>
  
  {!form.contactInfo.openingHours && error && (
    <p className="text-xs sm:text-sm text-rose-400">Opening hours are required.</p>
  )}
</div>

{/* Closing Hours */}

<div className="flex flex-col gap-2">
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <TimePicker
      label="Closing Hours"
      value={form.contactInfo.closingHours ? dayjs(form.contactInfo.closingHours, "HH:mm") : null}
      onChange={(newValue) => {
        const formattedTime = newValue ? newValue.format("HH:mm") : "";
        setForm((prev) => ({
          ...prev,
          contactInfo: { ...prev.contactInfo, closingHours: formattedTime },
        }));
      }} 
      
      slotProps={{
        textField: {
          fullWidth: true,
          // className: "border border-white/10 rounded-lg",
          className:`rounded-lg ${window.localStorage.getItem(STORAGE_KEY) === "light" ? "bg-pink-200/20 " : "bg-emerald-400/20 "} border border-white/10` ,
          sx: {
            input: { color: 'rgba(216, 2, 2, 0.88)'  },
            label: { color: 'rgba(255,255,255,0.5)' },
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
          }
          
        }
      }}
    />
  </LocalizationProvider>
  
  {!form.contactInfo.closingHours && error && (
    <p className="text-xs sm:text-sm text-rose-400">Closing hours are required.</p>
  )}
</div>
{/* Website */}
<div className="flex gap-3 col-span-1 sm:col-span-2">
  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-white">
    <input
      type="checkbox"
      checked={form.status === "OPEN"} 
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          status: e.target.checked ? "OPEN" : "CLOSED",
        }))
      }
      className="h-4 w-4 rounded border-white/10 bg-white/5 text-sky-500 focus:ring-sky-500"
    />
    <span>Open Now</span>
  </label>
</div>



        <div className="flex gap-3 col-span-1 sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="p-3 bg-sky-600 hover:bg-sky-700 rounded-lg font-semibold disabled:opacity-60"
          >
            {isSubmitting ? (isEditing ? "Saving..." : "Publishing...") : isEditing ? "Save Changes" : "Publish Restaurant"}
          </button>

          {isEditing && onCancel ? (
            <button type="button" onClick={onCancel} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {error && <p className="text-rose-400 text-sm mt-3">{error}</p>}


{/* <div className="border border-sky-500 m-5 rounded-2xl p-3">


  <p 
  className="p-2 mt-10 font-semibold border-b hover:border-b-sky-500  rounded-xl hover:text-sky-500 flex items-center justify-center "
  >Add Menu Name, Price, Description And Image</p>
  <div className="flex gap-3 mt-3">
    <Plus className="h-8 w-8 text-green-400 bg-green-100 rounded-2xl p-2  hover:text-green-900" />

  </div>
  
<div className=" mt-3 menu-field grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 border border-white/10 rounded-lg p-4">

  <input
    className="p-3 mt-4 bg-black/40 border border-white/10 rounded-lg w-full"
    placeholder="Add Menu Name"
    // value={}
    onChange={(e) => setForm((prev) => ({ ...prev, menuUrl: e.target.value }))}
  />
  <input
    className="p-3 mt-4 bg-black/40 border border-white/10 rounded-lg w-full"
    placeholder="Add Menu Description"
    // value={}
    onChange={(e) => setForm((prev) => ({ ...prev, menuUrl: e.target.value }))}
  />
  <input
    className="p-3 mt-4 bg-black/40 border border-white/10 rounded-lg w-full"
    placeholder="Add Menu Price"
    // value={}
    onChange={(e) => setForm((prev) => ({ ...prev, menuUrl: e.target.value }))}
  />
  <input
    className="p-3 mt-4 bg-black/40 border border-white/10 rounded-lg w-full"
    placeholder="Add Menu Image URL"
    // value={}
    onChange={(e) => setForm((prev) => ({ ...prev, menuUrl: e.target.value }))}
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
    </div> */}



      {/* <div className="mt-4 text-sm text-gray-300">
        Live restaurants: <span className="font-semibold text-white">{allCount}</span>
     
      </div> */}
    </div>
  );
}
