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
        "Contractor Money Lab helps small U.S. construction businesses measure quantities, prepare bids, examine profitability and plan payment timing. Financial calculators, visual takeoffs and private document studios are free and require no account.",
      ],
      [
        "Useful over complicated",
        "We use transparent formulas, hypothetical examples, and your own assumptions. We do not present invented market rates, promise a profit, or replace your accountant.",
      ],
      [
        "How the site is supported",
        "The tools are free and have no paid tier. Display advertising may support the site in the future. No advertising or analytics scripts are currently active, and using the tools does not require an email address.",
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
        "Visual takeoffs",
        "Dimensions use feet and inches, areas use square feet, and volumes use cubic yards. One cubic yard is 27 cubic feet; one U.S. short ton is 2,000 pounds. Net geometry is separate from order allowance. Bag yield, package coverage, bulk density and loose-to-placed factors are explicit product or user assumptions. Simplified diagrams are not structural drawings, installation specifications or optimized cutting plans. Cost-spectrum ranges are editable hypothetical scenarios, not verified regional benchmarks.",
      ],
      [
        "Customer documents",
        "Estimate and invoice line amounts round to cents before subtotaling. Discount applies proportionally across all lines, tax applies to marked discounted taxable lines, and retainage applies to the discounted pre-tax subtotal. Current due is total after tax less retainage; retained money remains part of the total. Lien-document language uses linked official state sources, while General drafts require local review. The studios do not send, sign, serve, file or verify payments.",
      ],
      [
        "Precision and limits",
        "Financial calculator formulas use JavaScript floating-point numbers without intermediate rounding. Purchase counts round upward to whole units, while customer-document amounts round to cents at stated stages. Display uses U.S. dollars and percentages. This is estimating software, not a bookkeeping ledger. Tool-specific input bounds help avoid unrealistic magnitude and nonfinite results. End-of-month forecasts do not capture every daily cash shortage. Taxes and financing are excluded unless entered.",
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
        "Calculator and takeoff values remain in your browser’s page memory. They are not submitted to a backend, stored in a database, or serialized into shared URLs. Reloading clears those inputs. The job tracker, change-order builder, estimate/invoice studio and lien-document studio save local browser drafts and offer downloadable backups. Preparing an estimate line from a takeoff creates a local sessionStorage transfer which you explicitly add to the document. No account is required.",
      ],
      [
        "Cookies and storage",
        "The delivered site uses no analytics or advertising scripts. Saved jobs and document drafts use localStorage on your device; pending takeoff transfers use sessionStorage. Clearing browser storage deletes these records, and closing a browser session may clear transfers. Use downloaded backups to keep or move drafts. Shared devices can expose saved details to other people using the same browser. Your hosting provider may process standard request data such as IP address and browser information to deliver and secure the site.",
      ],
      [
        "Future advertising and analytics",
        "No advertising or analytics scripts are currently active. If that changes, this policy will describe the services used and any available privacy choices. Using a calculator does not give consent to future tracking.",
      ],
      [
        "Contact and policy changes",
        "When you email support, your email provider and our inbox provider process the message. We use your message and reply address to answer your request. Do not send private customer, employee or contract records. You can ask us to delete support correspondence; your own email provider may keep a separate copy. Updates to our data practices will be reflected on this page.",
      ],
    ],
  },
  terms: {
    title: "Terms of use",
    description:
      "Terms and limitations for the free Contractor Money Lab planning tools.",
    sections: [
      [
        "Who these terms cover",
        "These terms apply to Contractor Money Lab's free calculators, visual takeoffs, job workspace and document studios. They describe the scope of the tools and your responsibilities when using their results. No subscription or account is required.",
      ],
      [
        "Educational planning tools",
        "Calculations are estimates based on your inputs and stated assumptions. They do not constitute accounting, tax, legal, lending, or investment advice. Use your contracts and qualified advisers to verify decisions.",
      ],
      [
        "Your responsibility",
        "You are responsible for input accuracy, expense allocation, contract interpretation, and checking the result against your business circumstances. No revenue, profitability, payment timing, or financing outcome is guaranteed.",
      ],
      [
        "Material quantities and local prices",
        "Diagrams are estimating sketches, not engineered plans or installation instructions. Verify measurements, product coverage, supplier density, construction requirements and purchase quantities before ordering. Cost ranges and examples are hypothetical; they are not current regional price surveys. The tools do not inspect a jobsite or certify compliance.",
      ],
      [
        "Documents and approvals",
        "You may print, download and use the estimates, invoices and change orders you prepare. You remain responsible for their scope, taxes, payment terms and approval process. Lien-waiver and notice drafts need review for the actual state, payment status and contract. The site does not collect signatures, verify cleared funds, serve notices, file documents or calculate legal deadlines.",
      ],
      [
        "Saved work and backups",
        "Saved drafts stay in this browser on this device. Clearing storage, changing browser or using another domain can make them unavailable. Download backups before replacing important work. The site does not provide cloud recovery or accounting records. Read the Privacy policy for details about local storage and support correspondence.",
      ],
      [
        "Availability and permitted use",
        "The site is provided as available. Use it lawfully, without interfering with availability or attempting to manipulate future advertising impressions or clicks. All tools remain available without registration.",
      ],
      [
        "Limitations",
        "The tools are provided as available, without a guarantee that an estimate is complete, accurate for your project or suitable for a particular purpose. To the extent permitted by applicable law, the operator is not responsible for losses caused by relying on unverified inputs or results. Nothing in these terms excludes rights or liability that applicable law does not allow to be excluded.",
      ],
      [
        "Corrections, updates and questions",
        "Report unexpected results using a hypothetical example so we can investigate. Features, formulas and these terms may change as the site improves. The revision date on this page identifies the current text. Contact support with questions about the site or these terms.",
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
        "Support and feedback",
        "Email us about calculation errors, accessibility problems, broken links, privacy requests or suggestions. Tell us which page you used, your browser and device, and the steps that reproduce the issue. We cannot promise a response time or provide project-specific legal, tax or engineering advice.",
      ],
      [
        "A useful bug report",
        "For example: Concrete Slab & Footing Calculator; solid slab; 24 ft × 24 ft × 6 in; zero order allowance; expected net volume 10.67 cubic yards. Describe what appeared instead and include a screenshot with any private details removed. This lets us reproduce the calculation without needing your actual job records.",
      ],
    ],
  },
};
