export const pages: Record<
  string,
  { title: string; description: string; sections: [string, string][] }
> = {
  about: {
    title: "Built for the business behind the build",
    description:
      "About Contractor Money Lab and our commitment to useful, transparent contractor finance tools.",
    sections: [
      [
        "Our purpose",
        "Contractor Money Lab helps small U.S. construction businesses examine pricing, overhead, profitability, and payment timing before committing to work. All six calculators are free and require no account.",
      ],
      [
        "Useful over complicated",
        "We use transparent formulas, hypothetical examples, and your own assumptions. We do not present invented market rates, promise a profit, or replace your accountant.",
      ],
      [
        "How the site is supported",
        "The intended business model is display advertising. Advertising is disabled in this implementation until publisher approval, configuration, and appropriate consent are in place. The tools have no paid tier.",
      ],
    ],
  },
  methodology: {
    title: "Clear formulas. Explicit assumptions.",
    description:
      "How Contractor Money Lab calculates job profit, contribution, cash flow, hourly rates, markup, and changes.",
    sections: [
      [
        "Revenue, profit, and cash",
        "Revenue is contract value or billed work. Estimated profit subtracts the modeled expenses from revenue. Cash flow follows when money is received and paid. These are different measurements, and none alone describes the health of a business.",
      ],
      [
        "Job profit and overhead",
        "Direct costs are materials, labor, subcontractors, equipment, permits, and other job expenses. Gross profit excludes allocated overhead and expected contingency expense. Estimated job profit includes both. Allocate overhead consistently and avoid counting it twice. Unspent contingency reserve is not an expense.",
      ],
      [
        "Margins and markups",
        "Margin is profit divided by revenue. Markup is profit divided by cost. A target margin uses cost / (1 − margin); a markup uses cost × (1 + markup). Zero denominators return unavailable. A target margin must be below 100%.",
      ],
      [
        "Break-even",
        "Contribution per job is job revenue minus variable cost. We divide monthly fixed overhead by positive contribution and round up to whole jobs. Target profit is added to overhead before division. With zero or negative contribution, volume cannot cover positive overhead.",
      ],
      [
        "Labor rates",
        "Annual wages are hourly wage times paid hours. User-entered payroll burden is applied to wages. Annual workers’ compensation, benefits, and allocated overhead are then added. Total annual cost is divided by billable hours and grossed up for the selected operating margin.",
      ],
      [
        "Cash-flow timing",
        "Invoice month plus the whole-month payment delay determines regular collection. Retainage is withheld from the invoice balance after advance credit and collected at the later of the configured release month and regular due month. Advances arrive in month 1, offset earliest invoices, and are not extra revenue. Amounts beyond the displayed forecast are reported separately. Other cash flows affect cash, not project profit.",
      ],
      [
        "Change orders",
        "Revised revenue includes the entered change amount; revised costs include direct, overhead, delay, and expected contingency expense. Incremental profit measures the change alone. Proposed changes remain scenarios until approved. Maximum total additional cost equals change revenue; remaining capacity deducts modeled added costs.",
      ],
      [
        "Precision and limits",
        "All formulas use JavaScript floating-point numbers without intermediate rounding. Display uses U.S. dollars and percentages. This is estimating software, not a bookkeeping ledger. Inputs are limited to one trillion to prevent unrealistic magnitude and nonfinite results. End-of-month forecasts do not capture every daily cash shortage. Taxes and financing are excluded unless entered.",
      ],
    ],
  },
  "privacy-policy": {
    title: "Privacy policy",
    description:
      "How this browser-based calculator site handles financial inputs and optional services.",
    sections: [
      [
        "Financial inputs",
        "Calculator values remain in your browser’s page memory. They are not submitted to a backend, stored in a database, or serialized into shared URLs. Reloading clears them. No account is required.",
      ],
      [
        "Cookies and storage",
        "The delivered site uses no analytics or advertising scripts and does not store financial inputs in localStorage. Your hosting provider may process standard request data such as IP address and browser information to deliver and secure the site.",
      ],
      [
        "Future advertising and analytics",
        "Advertising and analytics are disabled by default. Before activating them, the operator must update this policy to identify actual vendors, purposes, retention, consent choices, and applicable rights. Personalized Google ads require a properly configured consent platform where applicable. No consent to tracking is implied by using a calculator.",
      ],
      [
        "Contact and policy changes",
        "If you use the operator’s configured email link, your email provider and the recipient process that message. Avoid sending private job or employee data. Deployment documentation requires a real contact address before public launch. This policy must be reviewed when the site’s actual data practices change.",
      ],
    ],
  },
  terms: {
    title: "Terms of use",
    description:
      "Terms and limitations for the free Contractor Money Lab planning tools.",
    sections: [
      [
        "Educational planning tools",
        "Calculations are estimates based on your inputs and stated assumptions. They do not constitute accounting, tax, legal, lending, or investment advice. Use your contracts and qualified advisers to verify decisions.",
      ],
      [
        "Your responsibility",
        "You are responsible for input accuracy, expense allocation, contract interpretation, and checking the result against your business circumstances. No revenue, profitability, payment timing, or financing outcome is guaranteed.",
      ],
      [
        "Availability and permitted use",
        "The site is provided as available. Use it lawfully, without interfering with availability or attempting to manipulate future advertising impressions or clicks. All tools remain available without registration.",
      ],
      [
        "Limitations",
        "To the extent permitted by applicable law, the operator does not warrant that estimates are complete or suitable for a particular purpose. These terms do not override rights that cannot lawfully be excluded. The operator should obtain a legal review appropriate to its actual jurisdiction before public launch.",
      ],
    ],
  },
  contact: {
    title: "Get in touch",
    description:
      "Report a calculation issue or contact the Contractor Money Lab operator.",
    sections: [
      [
        "Found a calculation issue?",
        "Include the calculator name, a non-sensitive hypothetical example, expected result, and the result you saw. Never send employee records, customer details, or confidential contract documents.",
      ],
      [
        "Contact availability",
        "A public contact address is not yet configured. The site operator must set NEXT_PUBLIC_CONTACT_EMAIL before launch. No address has been invented for this project.",
      ],
    ],
  },
};
