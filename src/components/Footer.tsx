import { Wheat, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-primary text-primary-foreground">
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg saffron-gradient">
              <Wheat className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-extrabold text-base">SMART PDS</span>
          </div>
          <p className="text-sm text-primary-foreground/60 leading-relaxed">
            Blockchain-enabled transparent and accountable public food distribution system for Ranchi, Jharkhand.
          </p>
        </div>
        <div>
          <h4 className="font-display font-bold mb-3 text-sm">Important Links</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/60">
            <li><a href="https://dfpd.gov.in" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Dept. of Food & Public Distribution</a></li>
            <li><a href="https://nfsa.gov.in" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">National Food Security Act</a></li>
            <li><a href="https://epds.gov.in" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">ePDS Portal</a></li>
            <li><a href="https://jharkhand.gov.in" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Govt. of Jharkhand</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold mb-3 text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/60">
            <li><a href="/about" className="hover:text-accent transition-colors">About SMART PDS</a></li>
            <li><a href="/dashboard" className="hover:text-accent transition-colors">Operational Dashboard</a></li>
            <li><a href="/grievance" className="hover:text-accent transition-colors">File Grievance</a></li>
            <li><a href="/login" className="hover:text-accent transition-colors">Login Portal</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold mb-3 text-sm">Contact</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/60">
            <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-accent" /> SMART PDS Cell, Ranchi</li>
            <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-accent" /> support@smartpds.gov.in</li>
            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-accent" /> 1800-XXX-XXXX</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-4 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-primary-foreground/40">© 2026 SMART PDS, Ranchi District. All rights reserved.</p>
        <div className="flex gap-3 text-xs text-primary-foreground/40">
          <span>Powered by Hyperledger Fabric</span>
          <span>•</span>
          <span>Govt. of Jharkhand</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
