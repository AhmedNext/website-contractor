"use client";
import Link from "next/link";
import { Menu, ArrowUpRight, HardHat } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
const links = [
  ["Home", "/"],
  ["Calculators", "/tools"],
  ["Takeoff lab", "/field-lab"],
  ["Methodology", "/methodology"],
  ["About", "/about"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Contractor Money Lab home">
          <span className="brand-icon">
            <HardHat size={25} />
          </span>
          <span>
            CONTRACTOR
            <span className="brand-sub">
              MONEY LAB<span className="orange">.</span>
            </span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, url]) => (
            <Link key={url} href={url}>
              {label}
            </Link>
          ))}
        </nav>
        <Link className="header-cta" href="/tools/job-profit-calculator">
          Run the numbers <ArrowUpRight size={16} />
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="icon" className="mobile-menu" />
            }
            aria-label="Open navigation"
          >
            <Menu />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Contractor Money Lab</SheetTitle>
            </SheetHeader>
            <nav className="mobile-links" aria-label="Mobile navigation">
              {links.map(([label, url]) => (
                <Link key={url} href={url} onClick={() => setOpen(false)}>
                  {label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
