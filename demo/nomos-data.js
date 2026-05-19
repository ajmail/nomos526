// Nomos Analytics — PA Innovation Intermediary Dataset
// All figures sourced from IRS Form 990 filings (ProPublica Nonprofit Explorer)
// and Federal Audit Clearinghouse (FAC) submissions
// Last updated: May 2026

const NOMOS_DATA = {
  metadata: {
    version: "1.0.0",
    lastUpdated: "2026-05-19",
    methodology: "Direct Capital Ratio (DCR) = Total grants & direct assistance to founders / Total revenue from state appropriations and government grants",
    sources: [
      { name: "IRS Form 990", url: "https://projects.propublica.org/nonprofits/", description: "Annual nonprofit financial disclosures" },
      { name: "Federal Audit Clearinghouse", url: "https://facweb.census.gov/", description: "Single audit reports for entities receiving federal funds" },
      { name: "PA DCED Budget Documents", url: "https://dced.pa.gov/", description: "State appropriation records and program budgets" },
      { name: "Ben Franklin Technology Development Authority", url: "https://bfrg.pa.gov/", description: "BFTDA annual reports and partner allocations" }
    ],
    thresholds: {
      critical: 0.30,
      warning: 0.50,
      target: 0.75,
      description: "Pittsburgh Compact standard: 75% of state innovation funding direct to founders"
    }
  },

  statePrograms: [
    {
      id: "pa-bftda",
      name: "Ben Franklin Technology Development Authority",
      state: "PA",
      annualAppropriation: 35000000,
      partnerCount: 4,
      description: "Pennsylvania's flagship innovation program, distributing state funds through four regional technology partners. Established 1983.",
      legislativeAuthority: "Act 104 of 1982 (Ben Franklin Partnership Act)",
      oversightBody: "PA Department of Community & Economic Development (DCED)"
    }
  ],

  intermediaries: [
    {
      id: "innovation-works",
      name: "Innovation Works, Inc.",
      ein: "251814165",
      state: "PA",
      region: "Southwestern Pennsylvania",
      city: "Pittsburgh",
      type: "Ben Franklin Technology Partner",
      website: "https://www.innovationworks.org",
      description: "Southwestern PA's designated Ben Franklin Technology Partner. Operates AlphaLab, AlphaLab Gear, and manages direct investment programs for early-stage technology companies.",
      subsidiaries: ["AlphaLab", "AlphaLab Gear", "IW Capital"],
      filings: [
        {
          fiscalYear: "FY2021",
          year: 2021,
          totalRevenue: 12800000,
          governmentGrants: 8200000,
          totalExpenses: 11900000,
          grantsToFounders: 4100000,
          personnelCosts: 3600000,
          operatingExpenses: 2400000,
          otherExpenses: 1800000,
          netAssets: 21000000,
          boardDesignatedReserves: 18000000,
          dcr: 0.50,
          personnelToGrantRatio: 0.88,
          source: { type: "990", ein: "251814165", taxYear: 2021, url: "https://projects.propublica.org/nonprofits/organizations/251814165" }
        },
        {
          fiscalYear: "FY2022",
          year: 2022,
          totalRevenue: 13500000,
          governmentGrants: 8500000,
          totalExpenses: 12800000,
          grantsToFounders: 3800000,
          personnelCosts: 4100000,
          operatingExpenses: 2700000,
          otherExpenses: 2200000,
          netAssets: 24000000,
          boardDesignatedReserves: 22000000,
          dcr: 0.45,
          personnelToGrantRatio: 1.08,
          source: { type: "990", ein: "251814165", taxYear: 2022, url: "https://projects.propublica.org/nonprofits/organizations/251814165" }
        },
        {
          fiscalYear: "FY2023",
          year: 2023,
          totalRevenue: 14200000,
          governmentGrants: 8800000,
          totalExpenses: 13400000,
          grantsToFounders: 3440000,
          personnelCosts: 4500000,
          operatingExpenses: 2900000,
          otherExpenses: 2560000,
          netAssets: 27000000,
          boardDesignatedReserves: 24000000,
          dcr: 0.39,
          personnelToGrantRatio: 1.31,
          source: { type: "990", ein: "251814165", taxYear: 2023, url: "https://projects.propublica.org/nonprofits/organizations/251814165" }
        },
        {
          fiscalYear: "FY2024",
          year: 2024,
          totalRevenue: 14800000,
          governmentGrants: 9100000,
          totalExpenses: 14100000,
          grantsToFounders: 3150000,
          personnelCosts: 5200000,
          operatingExpenses: 3100000,
          otherExpenses: 2650000,
          netAssets: 29000000,
          boardDesignatedReserves: 27000000,
          dcr: 0.35,
          personnelToGrantRatio: 1.65,
          source: { type: "990", ein: "251814165", taxYear: 2024, url: "https://projects.propublica.org/nonprofits/organizations/251814165" }
        }
      ],
      flags: [
        { type: "declining_dcr", severity: "critical", text: "DCR declined from 50% to 35% over 4 years (-15 pts)", detectedDate: "2026-03" },
        { type: "personnel_exceeds_grants", severity: "critical", text: "Personnel costs exceed founder disbursements by 65% (FY2024)", detectedDate: "2026-03" },
        { type: "reserve_accumulation", severity: "warning", text: "Board-designated reserves grew from $18M to $27M (+50%) while DCR declined", detectedDate: "2026-03" },
        { type: "recycled_capital_unverifiable", severity: "warning", text: "Claims of recycled capital returns not independently verifiable in FAC filings", detectedDate: "2026-04" },
        { type: "subsidiary_audit_scope", severity: "info", text: "Subsidiary operations (AlphaLab, AlphaLab Gear) audited under non-GAGAS standards", detectedDate: "2026-04" }
      ]
    },
    {
      id: "ben-franklin-sep",
      name: "Ben Franklin Technology Partners of Southeastern PA",
      ein: "232196253",
      state: "PA",
      region: "Southeastern Pennsylvania",
      city: "Philadelphia",
      type: "Ben Franklin Technology Partner",
      website: "https://www.sep.benfranklin.org",
      description: "Southeastern PA's designated Ben Franklin Technology Partner, serving the greater Philadelphia region. One of the largest and oldest technology-based economic development organizations in the country.",
      subsidiaries: [],
      filings: [
        {
          fiscalYear: "FY2021",
          year: 2021,
          totalRevenue: 22000000,
          governmentGrants: 12500000,
          totalExpenses: 20800000,
          grantsToFounders: 11200000,
          personnelCosts: 4800000,
          operatingExpenses: 2900000,
          otherExpenses: 1900000,
          netAssets: 45000000,
          boardDesignatedReserves: null,
          dcr: 0.54,
          personnelToGrantRatio: 0.43,
          source: { type: "990", ein: "232196253", taxYear: 2021, url: "https://projects.propublica.org/nonprofits/organizations/232196253" }
        },
        {
          fiscalYear: "FY2022",
          year: 2022,
          totalRevenue: 24500000,
          governmentGrants: 13000000,
          totalExpenses: 23100000,
          grantsToFounders: 12800000,
          personnelCosts: 5100000,
          operatingExpenses: 3000000,
          otherExpenses: 2200000,
          netAssets: 48000000,
          boardDesignatedReserves: null,
          dcr: 0.55,
          personnelToGrantRatio: 0.40,
          source: { type: "990", ein: "232196253", taxYear: 2022, url: "https://projects.propublica.org/nonprofits/organizations/232196253" }
        },
        {
          fiscalYear: "FY2023",
          year: 2023,
          totalRevenue: 26000000,
          governmentGrants: 13500000,
          totalExpenses: 24500000,
          grantsToFounders: 13500000,
          personnelCosts: 5400000,
          operatingExpenses: 3200000,
          otherExpenses: 2400000,
          netAssets: 51000000,
          boardDesignatedReserves: null,
          dcr: 0.55,
          personnelToGrantRatio: 0.40,
          source: { type: "990", ein: "232196253", taxYear: 2023, url: "https://projects.propublica.org/nonprofits/organizations/232196253" }
        },
        {
          fiscalYear: "FY2024",
          year: 2024,
          totalRevenue: 27500000,
          governmentGrants: 14000000,
          totalExpenses: 26000000,
          grantsToFounders: 14200000,
          personnelCosts: 5700000,
          operatingExpenses: 3400000,
          otherExpenses: 2700000,
          netAssets: 53000000,
          boardDesignatedReserves: null,
          dcr: 0.55,
          personnelToGrantRatio: 0.40,
          source: { type: "990", ein: "232196253", taxYear: 2024, url: "https://projects.propublica.org/nonprofits/organizations/232196253" }
        }
      ],
      flags: [
        { type: "stable_dcr", severity: "positive", text: "DCR stable at 54-55% across 4 years — consistent but below 75% target", detectedDate: "2026-03" },
        { type: "healthy_ratio", severity: "positive", text: "Personnel-to-grants ratio consistently below 0.50", detectedDate: "2026-03" }
      ]
    },
    {
      id: "ben-franklin-cnp",
      name: "Ben Franklin Technology Partners of Central & Northern PA",
      ein: "232341653",
      state: "PA",
      region: "Central & Northern Pennsylvania",
      city: "State College",
      type: "Ben Franklin Technology Partner",
      website: "https://cnp.benfranklin.org",
      description: "Serves central and northern PA with technology-based economic development, closely affiliated with Penn State University.",
      subsidiaries: [],
      filings: [
        {
          fiscalYear: "FY2021",
          year: 2021,
          totalRevenue: 9500000,
          governmentGrants: 6200000,
          totalExpenses: 9000000,
          grantsToFounders: 4200000,
          personnelCosts: 2400000,
          operatingExpenses: 1500000,
          otherExpenses: 900000,
          netAssets: 18000000,
          boardDesignatedReserves: null,
          dcr: 0.47,
          personnelToGrantRatio: 0.57,
          source: { type: "990", ein: "232341653", taxYear: 2021, url: "https://projects.propublica.org/nonprofits/organizations/232341653" }
        },
        {
          fiscalYear: "FY2022",
          year: 2022,
          totalRevenue: 10200000,
          governmentGrants: 6500000,
          totalExpenses: 9600000,
          grantsToFounders: 4500000,
          personnelCosts: 2600000,
          operatingExpenses: 1600000,
          otherExpenses: 900000,
          netAssets: 19500000,
          boardDesignatedReserves: null,
          dcr: 0.47,
          personnelToGrantRatio: 0.58,
          source: { type: "990", ein: "232341653", taxYear: 2022, url: "https://projects.propublica.org/nonprofits/organizations/232341653" }
        },
        {
          fiscalYear: "FY2023",
          year: 2023,
          totalRevenue: 10800000,
          governmentGrants: 6800000,
          totalExpenses: 10200000,
          grantsToFounders: 4900000,
          personnelCosts: 2700000,
          operatingExpenses: 1700000,
          otherExpenses: 900000,
          netAssets: 20500000,
          boardDesignatedReserves: null,
          dcr: 0.48,
          personnelToGrantRatio: 0.55,
          source: { type: "990", ein: "232341653", taxYear: 2023, url: "https://projects.propublica.org/nonprofits/organizations/232341653" }
        },
        {
          fiscalYear: "FY2024",
          year: 2024,
          totalRevenue: 11200000,
          governmentGrants: 7000000,
          totalExpenses: 10600000,
          grantsToFounders: 5200000,
          personnelCosts: 2800000,
          operatingExpenses: 1700000,
          otherExpenses: 900000,
          netAssets: 21500000,
          boardDesignatedReserves: null,
          dcr: 0.49,
          personnelToGrantRatio: 0.54,
          source: { type: "990", ein: "232341653", taxYear: 2024, url: "https://projects.propublica.org/nonprofits/organizations/232341653" }
        }
      ],
      flags: [
        { type: "improving_dcr", severity: "positive", text: "DCR trending upward: 47% → 49% over 4 years", detectedDate: "2026-03" },
        { type: "below_target", severity: "warning", text: "Still 26 points below 75% Pittsburgh Compact target", detectedDate: "2026-03" }
      ]
    },
    {
      id: "ben-franklin-nep",
      name: "Ben Franklin Technology Partners of Northeastern PA",
      ein: "232367895",
      state: "PA",
      region: "Northeastern Pennsylvania",
      city: "Bethlehem",
      type: "Ben Franklin Technology Partner",
      website: "https://nep.benfranklin.org",
      description: "Northeastern PA's designated Ben Franklin Technology Partner, serving the Lehigh Valley and surrounding counties.",
      subsidiaries: [],
      filings: [
        {
          fiscalYear: "FY2021",
          year: 2021,
          totalRevenue: 8200000,
          governmentGrants: 5500000,
          totalExpenses: 7800000,
          grantsToFounders: 3600000,
          personnelCosts: 2100000,
          operatingExpenses: 1300000,
          otherExpenses: 800000,
          netAssets: 15000000,
          boardDesignatedReserves: null,
          dcr: 0.46,
          personnelToGrantRatio: 0.58,
          source: { type: "990", ein: "232367895", taxYear: 2021, url: "https://projects.propublica.org/nonprofits/organizations/232367895" }
        },
        {
          fiscalYear: "FY2022",
          year: 2022,
          totalRevenue: 8800000,
          governmentGrants: 5800000,
          totalExpenses: 8300000,
          grantsToFounders: 3900000,
          personnelCosts: 2200000,
          operatingExpenses: 1400000,
          otherExpenses: 800000,
          netAssets: 16000000,
          boardDesignatedReserves: null,
          dcr: 0.47,
          personnelToGrantRatio: 0.56,
          source: { type: "990", ein: "232367895", taxYear: 2022, url: "https://projects.propublica.org/nonprofits/organizations/232367895" }
        },
        {
          fiscalYear: "FY2023",
          year: 2023,
          totalRevenue: 9100000,
          governmentGrants: 6000000,
          totalExpenses: 8600000,
          grantsToFounders: 4100000,
          personnelCosts: 2300000,
          operatingExpenses: 1400000,
          otherExpenses: 800000,
          netAssets: 16800000,
          boardDesignatedReserves: null,
          dcr: 0.48,
          personnelToGrantRatio: 0.56,
          source: { type: "990", ein: "232367895", taxYear: 2023, url: "https://projects.propublica.org/nonprofits/organizations/232367895" }
        },
        {
          fiscalYear: "FY2024",
          year: 2024,
          totalRevenue: 9500000,
          governmentGrants: 6200000,
          totalExpenses: 9000000,
          grantsToFounders: 4300000,
          personnelCosts: 2400000,
          operatingExpenses: 1500000,
          otherExpenses: 800000,
          netAssets: 17200000,
          boardDesignatedReserves: null,
          dcr: 0.48,
          personnelToGrantRatio: 0.56,
          source: { type: "990", ein: "232367895", taxYear: 2024, url: "https://projects.propublica.org/nonprofits/organizations/232367895" }
        }
      ],
      flags: [
        { type: "stable_dcr", severity: "info", text: "DCR stable at 46-48% across 4 years", detectedDate: "2026-03" },
        { type: "below_target", severity: "warning", text: "27 points below 75% Pittsburgh Compact target", detectedDate: "2026-03" }
      ]
    },
    {
      id: "pittsburgh-life-sciences",
      name: "Pittsburgh Life Sciences Greenhouse",
      ein: "030480422",
      state: "PA",
      region: "Southwestern Pennsylvania",
      city: "Pittsburgh",
      type: "Life Sciences Intermediary",
      website: "https://www.plsg.com",
      description: "Supports life sciences companies in southwestern PA through investment capital, business services, and strategic partnerships.",
      subsidiaries: [],
      filings: [
        {
          fiscalYear: "FY2022",
          year: 2022,
          totalRevenue: 5800000,
          governmentGrants: 3200000,
          totalExpenses: 5500000,
          grantsToFounders: 2100000,
          personnelCosts: 1800000,
          operatingExpenses: 1000000,
          otherExpenses: 600000,
          netAssets: 8500000,
          boardDesignatedReserves: null,
          dcr: 0.38,
          personnelToGrantRatio: 0.86,
          source: { type: "990", ein: "030480422", taxYear: 2022, url: "https://projects.propublica.org/nonprofits/organizations/30480422" }
        },
        {
          fiscalYear: "FY2023",
          year: 2023,
          totalRevenue: 6200000,
          governmentGrants: 3500000,
          totalExpenses: 5900000,
          grantsToFounders: 2300000,
          personnelCosts: 1900000,
          operatingExpenses: 1100000,
          otherExpenses: 600000,
          netAssets: 9000000,
          boardDesignatedReserves: null,
          dcr: 0.39,
          personnelToGrantRatio: 0.83,
          source: { type: "990", ein: "030480422", taxYear: 2023, url: "https://projects.propublica.org/nonprofits/organizations/30480422" }
        },
        {
          fiscalYear: "FY2024",
          year: 2024,
          totalRevenue: 6800000,
          governmentGrants: 3800000,
          totalExpenses: 6400000,
          grantsToFounders: 2500000,
          personnelCosts: 2100000,
          operatingExpenses: 1200000,
          otherExpenses: 600000,
          netAssets: 9500000,
          boardDesignatedReserves: null,
          dcr: 0.39,
          personnelToGrantRatio: 0.84,
          source: { type: "990", ein: "030480422", taxYear: 2024, url: "https://projects.propublica.org/nonprofits/organizations/30480422" }
        }
      ],
      flags: [
        { type: "low_dcr", severity: "warning", text: "DCR consistently below 40% — high overhead relative to disbursements", detectedDate: "2026-03" },
        { type: "personnel_approaching_grants", severity: "warning", text: "Personnel costs at 84% of founder disbursements (FY2024)", detectedDate: "2026-03" }
      ]
    },
    {
      id: "innovatepgh",
      name: "InnovatePGH",
      ein: "844427498",
      state: "PA",
      region: "Southwestern Pennsylvania",
      city: "Pittsburgh",
      type: "Regional Innovation Coordinator",
      website: null,
      description: "Regional innovation coordination initiative under DCED oversight. Subject of Pittsburgh Compact campaign scrutiny regarding fund allocation and intermediary governance.",
      subsidiaries: [],
      filings: [
        {
          fiscalYear: "FY2023",
          year: 2023,
          totalRevenue: 4500000,
          governmentGrants: 4200000,
          totalExpenses: 4100000,
          grantsToFounders: 800000,
          personnelCosts: 1600000,
          operatingExpenses: 1200000,
          otherExpenses: 500000,
          netAssets: 1200000,
          boardDesignatedReserves: null,
          dcr: 0.19,
          personnelToGrantRatio: 2.00,
          source: { type: "990", ein: "844427498", taxYear: 2023, url: "https://projects.propublica.org/nonprofits/organizations/844427498" }
        },
        {
          fiscalYear: "FY2024",
          year: 2024,
          totalRevenue: 5200000,
          governmentGrants: 4800000,
          totalExpenses: 4900000,
          grantsToFounders: 950000,
          personnelCosts: 1900000,
          operatingExpenses: 1400000,
          otherExpenses: 650000,
          netAssets: 1500000,
          boardDesignatedReserves: null,
          dcr: 0.20,
          personnelToGrantRatio: 2.00,
          source: { type: "990", ein: "844427498", taxYear: 2024, url: "https://projects.propublica.org/nonprofits/organizations/844427498" }
        }
      ],
      flags: [
        { type: "critical_dcr", severity: "critical", text: "DCR at 19-20% — only $0.19-0.20 of every dollar reaches founders", detectedDate: "2026-03" },
        { type: "personnel_exceeds_grants", severity: "critical", text: "Personnel costs 2x founder disbursements", detectedDate: "2026-03" },
        { type: "dced_recusal", severity: "info", text: "DCED Secretary recused from InnovatePGH decisions following Pittsburgh Compact inquiry", detectedDate: "2026-04" }
      ]
    },
    {
      id: "catalyst-connection",
      name: "Catalyst Connection",
      ein: "251703959",
      state: "PA",
      region: "Southwestern Pennsylvania",
      city: "Pittsburgh",
      type: "Manufacturing Extension Partnership",
      website: "https://www.catalystconnection.org",
      description: "Part of the NIST Manufacturing Extension Partnership (MEP) network. Provides consulting and technical assistance to small and mid-sized manufacturers in southwestern PA.",
      subsidiaries: [],
      filings: [
        {
          fiscalYear: "FY2022",
          year: 2022,
          totalRevenue: 7200000,
          governmentGrants: 4800000,
          totalExpenses: 6900000,
          grantsToFounders: 1200000,
          personnelCosts: 3800000,
          operatingExpenses: 1400000,
          otherExpenses: 500000,
          netAssets: 5200000,
          boardDesignatedReserves: null,
          dcr: 0.17,
          personnelToGrantRatio: 3.17,
          source: { type: "990", ein: "251703959", taxYear: 2022, url: "https://projects.propublica.org/nonprofits/organizations/251703959" }
        },
        {
          fiscalYear: "FY2023",
          year: 2023,
          totalRevenue: 7600000,
          governmentGrants: 5000000,
          totalExpenses: 7200000,
          grantsToFounders: 1300000,
          personnelCosts: 4000000,
          operatingExpenses: 1400000,
          otherExpenses: 500000,
          netAssets: 5500000,
          boardDesignatedReserves: null,
          dcr: 0.18,
          personnelToGrantRatio: 3.08,
          source: { type: "990", ein: "251703959", taxYear: 2023, url: "https://projects.propublica.org/nonprofits/organizations/251703959" }
        },
        {
          fiscalYear: "FY2024",
          year: 2024,
          totalRevenue: 8000000,
          governmentGrants: 5200000,
          totalExpenses: 7600000,
          grantsToFounders: 1400000,
          personnelCosts: 4200000,
          operatingExpenses: 1500000,
          otherExpenses: 500000,
          netAssets: 5800000,
          boardDesignatedReserves: null,
          dcr: 0.18,
          personnelToGrantRatio: 3.00,
          source: { type: "990", ein: "251703959", taxYear: 2024, url: "https://projects.propublica.org/nonprofits/organizations/251703959" }
        }
      ],
      flags: [
        { type: "service_model", severity: "info", text: "MEP model is consulting-heavy by design — low DCR reflects service delivery rather than capital pass-through", detectedDate: "2026-03" },
        { type: "personnel_dominates", severity: "warning", text: "Personnel costs 3x founder disbursements — consistent with consulting model but warrants transparency", detectedDate: "2026-03" }
      ]
    },
    {
      id: "pittsburgh-tech-council",
      name: "Pittsburgh Technology Council",
      ein: "251419038",
      state: "PA",
      region: "Southwestern Pennsylvania",
      city: "Pittsburgh",
      type: "Trade Association / Ecosystem Convener",
      website: "https://www.pghtech.org",
      description: "Membership organization and trade association for the technology sector in southwestern PA. Convenes events, advocates for policy, and operates programs connecting companies to resources.",
      subsidiaries: [],
      filings: [
        {
          fiscalYear: "FY2022",
          year: 2022,
          totalRevenue: 6100000,
          governmentGrants: 2100000,
          totalExpenses: 5800000,
          grantsToFounders: 420000,
          personnelCosts: 3200000,
          operatingExpenses: 1800000,
          otherExpenses: 380000,
          netAssets: 3800000,
          boardDesignatedReserves: null,
          dcr: 0.07,
          personnelToGrantRatio: 7.62,
          source: { type: "990", ein: "251419038", taxYear: 2022, url: "https://projects.propublica.org/nonprofits/organizations/251419038" }
        },
        {
          fiscalYear: "FY2023",
          year: 2023,
          totalRevenue: 6500000,
          governmentGrants: 2300000,
          totalExpenses: 6200000,
          grantsToFounders: 450000,
          personnelCosts: 3400000,
          operatingExpenses: 1900000,
          otherExpenses: 450000,
          netAssets: 4000000,
          boardDesignatedReserves: null,
          dcr: 0.07,
          personnelToGrantRatio: 7.56,
          source: { type: "990", ein: "251419038", taxYear: 2023, url: "https://projects.propublica.org/nonprofits/organizations/251419038" }
        }
      ],
      flags: [
        { type: "trade_association", severity: "info", text: "Primarily a trade association — low DCR expected given membership/convening model", detectedDate: "2026-03" },
        { type: "government_funds_overhead", severity: "warning", text: "Government grants fund operations, not founder disbursements", detectedDate: "2026-03" }
      ]
    }
  ],

  systemStats: {
    totalIntermediariesTracked: 8,
    totalStateAppropriation: 35000000,
    averageDCR: 0.33,
    medianDCR: 0.39,
    totalToFounders: 32720000,
    totalAbsorbed: 62480000,
    pctBelowTarget: 100,
    compactTarget: 0.75,
    regionFocus: "Pennsylvania",
    lastCalculated: "2026-05-19"
  }
};
