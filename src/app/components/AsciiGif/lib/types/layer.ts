export type Layer = {
  id: number;              
  symbol: string;         
  fg: string;             
  bg: string;             
  bgEnabled?: boolean;     
  target: string;         
  spread: number;       
  visible: boolean;     
  fontVariant?: "Reg" | "Med" | "Bold" | "Black"; 
};