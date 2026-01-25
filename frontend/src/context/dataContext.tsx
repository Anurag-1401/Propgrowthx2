import { supabase } from "@/lib/supabase"
import { createContext, useContext, useEffect, useState } from "react"
import { PropertyData } from "@/components/dashboard/EditPropertyModal";
import { Transaction } from "@/pages/dashboard/tenant/TenantTransactions";
import { Complaint } from "@/components/tenant/AddComplaintModal";
import { ProfileData } from "@/pages/Profile";

type DataContextType = {
  id?: string | null;
  properties: PropertyData[];
  setProperties?: React.Dispatch<React.SetStateAction<PropertyData[]>>;
  transactions: Transaction[];
  setTransactions?: React.Dispatch<React.SetStateAction<Transaction[]>>;
  complaints: Complaint[];
  setComplaints?: React.Dispatch<React.SetStateAction<Complaint[]>>;
  profile?: ProfileData[] | null;
  setProfile?: React.Dispatch<
    React.SetStateAction<ProfileData[] | null>
  >;
  loading: boolean;
};

const DataContext = createContext<DataContextType | null>(null);


export const DataProvider = ({ children }: { children: React.ReactNode }) => {

    const [properties, setProperties] = useState([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    
    const [profile, setProfile] = useState<ProfileData[]|null>(null);
    const id = sessionStorage.getItem('id');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
  const fetchAllData = async () => {
    setLoading(true);

    try {
      const [
        propertiesRes,
        transactionsRes,
        complaintsRes,
        profileRes,
      ] = await Promise.all([
        supabase.from("properties").select("*"),
        supabase.from("payments").select("*"),
        supabase.from("complaints").select("*"),
        supabase.from("profiles").select("*")
      ]);

      if (propertiesRes.data) setProperties(propertiesRes.data);
      if (transactionsRes.data) setTransactions(transactionsRes.data);
      if (complaintsRes.data) setComplaints(complaintsRes.data);
      if (profileRes.data) setProfile(profileRes.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAllData();
}, [id]);



    return(
        <DataContext.Provider 

            value={{
                id,
                properties, 
                setProperties,
                transactions,
                setTransactions,
                complaints,
                setComplaints,
                profile,
                setProfile,
                loading
            }}>

            {children}

        </DataContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () =>{
    const context =  useContext(DataContext);
    if(!context){
        throw new Error("useData must be used within a DataProvider")
    }
    return context;
}