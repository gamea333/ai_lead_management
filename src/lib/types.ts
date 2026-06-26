export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  requirement: string;
  ai_category: string | null;
  ai_priority: string | null;
  created_at: string;
}

export interface EmailEvent {
  id: string;
  lead_id: string;
  event_type: "sent" | "opened" | "clicked";
  created_at: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  requirement: string;
}

export interface LeadWithEngagement extends Lead {
  email_opened: boolean;
  link_clicked: boolean;
  created_at_display: string;
}

export interface DashboardStats {
  totalLeads: number;
  totalEmailsSent: number;
  totalEmailsOpened: number;
  openRate: number;
  totalLinkClicks: number;
  clickRate: number;
}

export interface ClassificationResult {
  category: string;
  priority: "High" | "Medium" | "Low";
}
