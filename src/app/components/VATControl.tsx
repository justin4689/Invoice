import { Invoice } from '@/type';
import React from 'react'
interface VATControlProps {
    invoice: Invoice ;
    setInvoice: (invoice: Invoice | null) => void;
  }


  
const VATControl = ({invoice, setInvoice}: VATControlProps) => {
    const handleVatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInvoice({ ...invoice, 
            vatActive: e.target.checked,
            vatRate: e.target.checked ? invoice.vatRate : 0, // Ne pas réinitialiser vatRate quand la TVA est inactive
        });

      };
      const handleVatRateChange=
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setInvoice({ ...invoice,
            vatRate: parseFloat(e.target.value) || 0, // Assurez-vous qu'il y ait une valeur valide
        });

      };
  return (
    <div className='flex items-center'>
        <label className='block text-sm font-bold'>TVA (%)</label>

        <input type="checkbox" 
        className='toggle toggle-sm ml-2'
        checked={invoice?.vatActive }
        onChange={handleVatChange}/>
        {
            invoice?.vatActive &&(
                <input type="number" 
                className='input  input-sm input-bordered w-full'
                value={invoice?.vatRate}
                onChange={handleVatRateChange}
                min={0}
                />
            ) 
        }
      
    </div>
  )
}

export default VATControl
