"use client";
import { deleteInvoice, getInvoiceById, updateInvoice } from "@/app/action";
import { Invoice, Totals } from "@/type";
import { useState } from "react";
import { useEffect } from "react";
import Wrapper from "@/app/components/Wrapper";
import { Save, Trash } from "lucide-react";
import InvoiceInfo from "@/app/components/InvoiceInfo";
import VATControl from "@/app/components/VATControl";
import InvoiceLines from "@/app/components/InvoiceLines";
import { useRouter } from "next/navigation";
import { InvoicePdf } from "@/app/components/InvoicePdf";

export default function page({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [initialInvoice, setInitialInvoice] = useState<Invoice | null>(null);
  const [totals, setTotals] = useState<Totals | null>(null);
  const  [isSaveDisabled,setIsSaveDisabled] = useState(true )
   const  [isLoading,setIsLoading] = useState(false)
   const router = useRouter()

  const fetchInvoice = async () => {
    const invoiceId = (await params).invoiceId;

    try {
      const fetchedInvoice = await getInvoiceById(invoiceId);
      if (fetchedInvoice) {
        setInvoice(fetchedInvoice);
        setInitialInvoice(fetchedInvoice);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);
  useEffect(() => {
    if (!invoice) return;
    const ht = invoice.lines.reduce(
      (acc, line) => acc + line.quantity * line.unitPrice,
      0
    );
    const vat = invoice.vatActive ? ht * (invoice.vatRate / 100) : 0;
    const ttc = ht + vat;
    setTotals({
      totalHT: ht,
      totalVAT: vat,
      totalTTC: ttc,
    });
  }, [invoice]);

  useEffect(() => {
    setIsSaveDisabled(
      JSON.stringify(invoice) == JSON.stringify(initialInvoice)
    );
 
  }, [invoice,initialInvoice]);


  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = parseInt(e.target.value);
    if (invoice) {
      const updatedInvoice = { ...invoice, status: newStatus };
      setInvoice(updatedInvoice);
    }
  };
    const  handleSave = async () => {
        if (!invoice)  return 
        setIsLoading(true)
        try {
          
          await updateInvoice(invoice)
          const  updatedInvoice = await getInvoiceById(invoice.id)
          if (updatedInvoice) {
            setInvoice(updatedInvoice)
          }
          
        } catch (error) {
           console.error("Erreur lors de la sauvegarde de la facture :", error)
          
        }
    }

    const handleDelete = async () => {
      const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")
      if (confirmed) {
        try {
          await deleteInvoice(invoice?.id)
          router.push("/")
        } catch (error) {
          
        }
      
        }
    }

  if (!invoice || !totals) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <span className="font-bold ">Facture non trouvée</span>
      </div>
    );
  }

  return (
    <Wrapper>
      <div>
        <div>
          <span className="bagde badge-ghost bagde-lg uppercase p-2 rounded-md">
            <span>Facture -</span>
            {invoice?.id}
          </span>
          <div className="flex mt-4 items-center">
            <div className="flex md:mt-0 mt-4 w-full">
              <select
                name="status"
                className="select select-bordered select-sm w-full"
                value={invoice?.status}
                onChange={handleStatusChange}
              >
                <option value={1}>Brouillon</option>
                <option value={2}>En Attente</option>
                <option value={3}>Payée</option>
                <option value={4}>Annulée</option>
                <option value={5}>Impayée</option>
              </select>
            </div>
            <button className="btn btn-small btn-accent ml-4" disabled={isSaveDisabled|| isLoading} onClick={handleSave}>

              {
                isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>

                ) : (
                  <div className="flex gap-1">
                     Sauvegarder
                     <Save className="w-4 ml-2"/> 
                  </div>
                )
              }
             
            </button>
            <button className="btn btn-small btn-accent ml-4" onClick={handleDelete}>
              <Trash className="w-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full gap-1 mt-2 ">
          <div className="flex flex-col w-full md:w-1/3">
            <div className="mb-4 bg-base-200 p-5 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="badge badge-accent">Résumé des Totaux</div>
                <VATControl invoice={invoice} setInvoice={setInvoice} />
              </div>

              <div className="flex justify-between">
                <span>Total Hors Taxes</span>
                <span>{(totals?.totalHT).toFixed(2)} F CFA</span>
              </div>
              <div className="flex justify-between">
                <span>
                  TVA ({invoice?.vatRate ? `${invoice?.vatRate}%` : "0%"} )
                </span>
                <span>{(totals?.totalVAT).toFixed(2)} F CFA</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total TTC</span>
                <span>{(totals?.totalTTC).toFixed(2)} F CFA</span>
              </div>
            </div>
            <InvoiceInfo invoice={invoice} setInvoice={setInvoice} />
          </div>
          <div className="flex flex-col w-full md:w-2/3">
            <InvoiceLines invoice={invoice} setInvoice={setInvoice} />
            <InvoicePdf invoice={invoice} totals={totals} />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
