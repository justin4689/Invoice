'use client'
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Layers } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { checkAndAddUser } from "../action";

function Navbar() {
  const pathname = usePathname();

  const {user} = useUser();

  const navLinks = [
    { label: "Factures", href: "/" },

  ];

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && user.fullName) {
      checkAndAddUser(user.primaryEmailAddress.emailAddress, user.fullName);
    }
  }, [user]);
  const isActiveLink = (href: string) =>
    pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

  const renderLinks = (classNames: string) => {
    return navLinks.map(({ label, href }) => (
      <Link
        key={label}
        href={href}
        className={`btn-sm btn ${classNames} ${
          isActiveLink(href) ? "btn-accent" : ""
        }`}
      >
        {label}
      </Link>
    ));
  };

  return (
    <div className="border-b border-base-300 px-5 md:px-[10%] py-4 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-accent-content text-accent rounded-full">
            <Layers className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl italic">
            In<span className="text-accent">Voice</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {renderLinks("btn")}
          <UserButton />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
