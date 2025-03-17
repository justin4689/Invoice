"use client";
import { Layers } from "lucide-react";
import Wrapper from "./components/Wrapper";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createEmptyInvoice, getInvoicesByEmail } from "./action";
import confetti from "canvas-confetti";
import { Invoice } from "@/type";
import InvoiceComponent from "./components/InvoiceComponent";

export default function Home() {
  const  {user} = useUser();
  const [invoiceName, setInvoiceName] = useState("");
  const [isNameValid, setIsNameValid] = useState(false);
  const email = user?.primaryEmailAddress?.emailAddress;
  const  [invoices , setInvoices] = useState <Invoice[]>([]);


  const fetchInvoices = async () => {
    try {
      if (!email) return;
      
      const data = await getInvoicesByEmail(email); 

      if (!data) return;

      setInvoices(data);
    } catch (error) {
      console.error("Erreur lors de la recuperation des factures :", error);
      
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [email]);

  useEffect(() => {
    setIsNameValid(invoiceName.length > 60);
  }, [invoiceName]);

  const handleCreateInvoice = async () => {
    try {
      if (email) {
        await createEmptyInvoice(email, invoiceName);
      }
      fetchInvoices();
      setInvoiceName("");
      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      if(modal) {
        modal.close();
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
    } catch (error) {
      console.error("Erreur lors de la creation de la facture:", error);
    }
    
  }
  return (
    <Wrapper>
      <div className="flex flex-col space-y-4">
        <h1 className="text-lg font-bold">Mes Factures</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="cursor-pointer border border-accent rounded-xl flex flex-col justify-center items-center p-1 gap-2"
            onClick={() =>
              (
                document.getElementById("my_modal_3") as HTMLDialogElement
              ).showModal()
            }
          >
            <div className="font-bold text-accent">Créer une facture</div>
            <div className="bg-accent-content text-accent rounded-full">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          {/* Listes des factures */}

          {
            invoices.length > 0 && (
              invoices.map((invoice,index) => (
                <div key={index} className="cursor-pointer border border-accent rounded-xl flex flex-col justify-center items-center p-1 gap-2">
                 <InvoiceComponent invoice={invoice} index={index} />
                </div>
              ))
            )
          }
        </div>

        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">
              Nouvelle Facture
              <input
                type="text"
                placeholder="Nom de la facture (60 caractères max)"
                className="input input-bordererd w-full my-4"
                value={invoiceName}
                onChange={(e) => setInvoiceName(e.target.value)}
              />
              {isNameValid && (
                <p className="text-red-500 text-sm">
                  Le nom de la facture doit contenir au moins 60 caractères.
                </p>
              )}
              <button
                className="btn btn-accent"
                disabled={isNameValid || invoiceName.length === 0}
                onClick={handleCreateInvoice}
              >
                Créer
              </button>
            </h3>
          </div>
        </dialog>
      </div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
    </Wrapper>
  );
}
