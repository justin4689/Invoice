import React from "react";
import { Invoice } from "@/type";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  SquareArrowOutUpRight,
  XCircle,
} from "lucide-react";
import { FileText } from "lucide-react";

type InvoiceProps = {
  invoice: Invoice;
  index: number;
};

const InvoiceComponent = ({ invoice, index }: InvoiceProps) => {
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <div className="bagde badge-lg flex items-center gap-2 bg-white  rounded-md p-1">
            <FileText className="w-4" />
            Brouillon
          </div>
        );
      case 2:
        return (
          <div className="bagde badge-lg badge-warning flex items-center gap-2 bg-amber-400 rounded-md p-1">
            <Clock className="w-4" />
            En attente
          </div>
        );
      case 3:
        return (
          <div className="bagde badge-lg badge-success flex items-center gap-2 bg-green-400 rounded-md p-1">
            <CheckCircle className="w-4" />
            Payée
          </div>
        );
      case 4:
        return (
          <div className="bagde badge-lg badge-error flex items-center gap-2 bg-red-400 rounded-md p-1">
            <XCircle className="w-4" />
            Annulée
          </div>
        );
      case 5:
        return (
          <div className="bagde badge-lg badge-error flex items-center gap-2 bg-red-400 rounded-md p-1">
            <FileText className="w-4" />
            Impayée
          </div>
        );
      default:
        return (
          <div className="bagde badge-lg flex items-center gap-2 bg-white rounded-md p-1">
            <XCircle className="w-4" />
            Indefinis
          </div>
        );
    }
  };

    const calculateTotal = () => {

        const totalHT =invoice?.lines?.reduce((acc, line) => {
            const quantity = line.quantity ?? 0;
            const unitPrice = line.unitPrice ?? 0;

            return acc + unitPrice * quantity;
        }, 0);

        const totalVAT = totalHT * (invoice.vatRate / 100);
        const totalTTC = totalHT + totalVAT;
        return totalTTC;
      
    }

  return (
    <div className="bg-base-200/90 p-5 rounded-xl space-y-2 shadow w-full">
      <div className="flex items-center justify-between w-full ">
        <div> {getStatusBadge(invoice.status)}</div>
        <Link href={`/invoice/${invoice.id}`} className="btn btn-sm btn-accent">
          Plus <SquareArrowOutUpRight className="w-4" />
        </Link>
      </div>
      <div className="w-full">
        <div className="">
            <div className="stat-title">
                <div className="uppercase text-sm">
                    Facture n°{invoice.id}
                </div>
                <div>
                    
                    <div className="stat-value">
                        {calculateTotal().toFixed(2)} F CFA
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default InvoiceComponent;
