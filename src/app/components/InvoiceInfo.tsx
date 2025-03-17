import { Invoice } from "@/type";
import React from "react";

interface InvoiceInfoProps {
  invoice: Invoice ;
  setInvoice: (invoice: Invoice | null) => void;
}

const InvoiceInfo = ({ invoice, setInvoice }: InvoiceInfoProps) => {
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    field: string
  ) => {
    setInvoice({ ...invoice, [field]: e.target.value });
  };
  return (
    <div className="flex flex-col h-fit bg-base-200 p-5 rounded-xl mb-4 md:mb-0">
      <div className="space-y-4">
        <h2 className="badge badge-accent">Emetteur</h2>
        <input
          type="text"
          value={invoice?.issuerName}
          placeholder=" nom de l'entreprise émettrice"
          className="input input-bordered w-full resize-none"
          onChange={(e) => handleInputChange(e, "issuerName")}
        />
        <textarea
          value={invoice?.issuerAddress}
          className="textarea textarea-bordered w-full resize-none h-40"
          placeholder="Adresse de l'entreprise émettrice"
          aria-rowcount={5}
          onChange={(e) => handleInputChange(e, "issuerAddress")}
        ></textarea>

        <h2 className="badge badge-accent">Client</h2>
        <input
          type="text"
          value={invoice?.clientName}
          placeholder=" nom de l'entreprise client"
          className="input input-bordered w-full resize-none"
              onChange={(e) => handleInputChange(e, "clientName")}
        />
        <textarea
          value={invoice?.clientAddress}
          className="textarea textarea-bordered w-full resize-none h-40"
          placeholder="Adresse de l'entreprise émettrice"
          aria-rowcount={5}
          onChange={(e) => handleInputChange(e, "clientAddress")}
        ></textarea>

        <h2 className="badge badge-accent">Date de la facture</h2>
        <input
          type="date"
          value={invoice?.invoiceDate}
          onChange={(e) => handleInputChange(e, "invoiceDate")}
          placeholder="Date de la facture"
          className="input input-bordered w-full resize-none"
        />
        <h2 className="badge badge-accent">Date d'échéance</h2>
        <input
          type="date"
          value={invoice?.dueDate}
          onChange={(e) => handleInputChange(e, "dueDate")}
          placeholder="Date d'échéance"
          className="input input-bordered w-full resize-none"
        />
      </div>
    </div>
  );
};

export default InvoiceInfo;
