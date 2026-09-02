export type UserRole = 'ADMIN' | 'GESTOR' | 'TECNICO' | 'CLIENTE';

export type OSStatus = 
  | 'ABERTA' 
  | 'AGENDADA' 
  | 'EM_ANDAMENTO' 
  | 'AGUARDANDO_APROVACAO' 
  | 'CONCLUIDA' 
  | 'CANCELADA';

export type OSPriority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type AssetCategory = 
  | 'CLIMATIZACAO' 
  | 'INCENDIO_AVCB' 
  | 'ELETRICA_SPDA' 
  | 'HIDRAULICA' 
  | 'ELEVADORES' 
  | 'GAS' 
  | 'GERADORES' 
  | 'ESTRUTURAL';

export type NormativeType = 
  | 'PMOC' 
  | 'AVCB' 
  | 'SPDA_NBR5419' 
  | 'POTABILIDADE_AGUA' 
  | 'ELEVADOR_RIA' 
  | 'ESTANQUEIDADE_GAS' 
  | 'NR10_ELETRICA' 
  | 'NR13_VASOS' 
  | 'NR33_ESPACO_CONFINADO' 
  | 'NR35_TRABALHO_ALTURA' 
  | 'NBR5674_MANUTENCAO' 
  | 'NBR16280_REFORMAS';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  condominiumId?: string; // For CLIENTE role
  title: string;
  phone?: string;
}

export interface Condominium {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  towers: number;
  unitsCount: number;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  avcbExpiry: string;
  pmocStatus: 'CONFORME' | 'EM_REVISAO' | 'VENCIDO';
  potabilityExpiry: string;
  spdaExpiry: string;
  totalAssets: number;
  healthScore: number; // 0-100
  image?: string;
}

export interface IoTSensor {
  id: string;
  assetId: string;
  type: 'VIBRACAO' | 'TEMPERATURA' | 'PRESSAO' | 'HORIMETRO' | 'NIVEL_AGUA' | 'CORRENTE';
  label: string;
  value: number;
  unit: string;
  minThreshold: number;
  maxThreshold: number;
  status: 'NORMAL' | 'WARNING' | 'ALARM';
  lastUpdate: string;
  history: { timestamp: string; value: number }[];
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  category: AssetCategory;
  condominiumId: string;
  location: string;
  floorLevel: 'COBERTURA' | 'ANDAR_TIPO' | 'TERREO' | 'SUBSOLO_1' | 'SUBSOLO_2' | 'CASA_MAQUINAS';
  brand: string;
  model: string;
  serialNumber: string;
  installDate: string;
  status: 'OPERANDO' | 'ALERTA' | 'CRITICO' | 'MANUTENCAO';
  qrCode: string;
  lastMaintenance: string;
  nextMaintenance: string;
  normativeRef: string;
  specifications: Record<string, string>;
  sensors: IoTSensor[];
  manualPdfUrl?: string;
  photoUrl?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  normativeRef: string;
  required: boolean;
  checked: boolean;
  measuredValue?: string;
  observation?: string;
}

export interface WorkOrder {
  id: string;
  code: string; // e.g. "OS-2026-089"
  title: string;
  description: string;
  condominiumId: string;
  assetId?: string;
  category: AssetCategory;
  priority: OSPriority;
  status: OSStatus;
  type: 'PREVENTIVA_PMOC' | 'CORRETIVA_EMERGENCIAL' | 'INSPECAO_NORMATIVA' | 'SOLICITACAO_MORADOR' | 'PREDITIVA_IOT';
  assignedTechId?: string;
  assignedTechName?: string;
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  checklist: ChecklistItem[];
  photosBefore?: string[];
  photosAfter?: string[];
  signature?: {
    name: string;
    document: string; // CPF or RG
    role: string; // Síndico, Zelador, etc.
    dataUrl: string;
    timestamp: string;
    gpsCoordinates?: string;
  };
  partsUsed: {
    partId: string;
    partName: string;
    quantity: number;
    unitCost: number;
  }[];
  totalCost: number;
  aiDiagnostic?: {
    probableCause: string;
    suggestedParts: string[];
    safetyRequirements: string[];
    estimatedHours: number;
    recommendedActions?: string[];
    severity?: string;
    actionPlan?: string[];
  };
  voiceNote?: string;
  gpsCheckin?: string;
  isOfflineQueued?: boolean;
  normativeTags: string[];
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: AssetCategory;
  quantity: number;
  minQuantity: number;
  unit: string;
  unitCost: number;
  supplier: string;
  location: string;
  lastRestock: string;
}

export interface NormativeCompliance {
  id: string;
  condominiumId: string;
  normType: NormativeType;
  title: string;
  code: string; // e.g. "NBR 5419 / NBR 5410"
  legalBasis: string; // e.g. "Lei Federal 13.589/2018"
  validityDate: string;
  status: 'CONFORME' | 'VENCENDO' | 'VENCIDO' | 'EM_ANDAMENTO';
  certNumber?: string;
  artNumber?: string;
  responsibleEngineer?: string;
  creaRrt?: string;
  documentUrl?: string;
  inspectionFrequency: 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
  lastInspection: string;
  nextInspection: string;
}

export interface FinancialRecord {
  id: string;
  condominiumId: string;
  title: string;
  type: 'CONTRATO_MENSAL' | 'PECAS_ESTOQUE' | 'SERVICO_EXTRA' | 'TAXA_LAUDO';
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'PAGO' | 'PENDENTE' | 'VENCIDO';
  invoiceNumber: string;
  code?: string;
  description?: string;
}

export type FinancialInvoice = FinancialRecord;

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  target: string;
  details: string;
}

export interface ReliabilityKPIs {
  mttrHours: number; // Mean Time to Repair
  mtbfDays: number; // Mean Time Between Failures
  pmocComplianceRate: number; // %
  avcbComplianceRate: number; // %
  slaAdherenceRate: number; // %
  totalMonitoredSensors: number;
  criticalAlertsCount: number;
  activeWorkOrders: number;
  completedThisMonth: number;
}
