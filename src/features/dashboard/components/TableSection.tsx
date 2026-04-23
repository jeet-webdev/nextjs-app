import TableForm from "@/features/table-reservation/TableForm";
import { Table } from "lucide-react";

export default function TableSection(){
    return(
        <div>
            <h2 className="text-lg font-semibold mb-4">Table Reservation Section</h2>
            <TableForm />
        </div>
    );
}