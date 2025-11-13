import React from "react";
const Footer: React.FC = () => (
  <footer style={{padding:20, textAlign:"center", marginTop:24}}>
    <small>© {new Date().getFullYear()} DairyDelights — Fresh from our farm</small>
  </footer>
);
export default Footer;
