import Link from "next/link";
import {
  ArrowUpRight,
  Calculator,
  ChartNoAxesCombined,
  Wallet,
  HardHat,
  Percent,
  FilePlus2,
} from "lucide-react";
import { tools } from "@/content/tools";
const icons = [
  Calculator,
  ChartNoAxesCombined,
  Wallet,
  HardHat,
  Percent,
  FilePlus2,
];
export function ToolGrid() {
  return (
    <div className="tool-grid">
      {tools.map((t, i) => {
        const Icon = icons[i];
        return (
          <Link href={"/tools/" + t.slug} key={t.slug} className="tool-card">
            <div className="tool-top">
              <span className="tool-icon">
                <Icon size={24} />
              </span>
              <ArrowUpRight className="tool-arrow" size={21} />
            </div>
            <small className="eyebrow">{t.category}</small>
            <h3>{t.name}</h3>
            <p>{t.description}</p>
            <span className="tool-link">
              Open calculator <span>→</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
