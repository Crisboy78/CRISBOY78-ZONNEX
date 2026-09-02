'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  UserSession, 
  UserRole, 
  WorkOrder, 
  Asset, 
  IoTSensor, 
  Condominium, 
  NormativeCompliance, 
  InventoryItem, 
  FinancialInvoice,
  OSStatus
} from '@/types/maintenance';
import { 
  MOCK_USERS, 
  MOCK_KPI, 
  MOCK_CONDOMINIUMS, 
  MOCK_ASSETS, 
  MOCK_WORK_ORDERS, 
  MOCK_NORMATIVES, 
  MOCK_INVENTORY, 
  MOCK_INVOICES 
} from '@/lib/mockDatabase';

import { AppHeader } from '@/components/AppHeader';
import { AppSidebar } from '@/components/AppSidebar';
import { RoleLoginBar } from '@/components/RoleLoginBar';
import { ModuleNavigationMenu } from '@/components/ModuleNavigationMenu';
import { CommandPalette } from '@/components/CommandPalette';
import { DashboardView } from '@/components/DashboardView';
import { KanbanBoard } from '@/components/KanbanBoard';
import { DigitalTwin } from '@/components/DigitalTwin';
import { NormativeComplianceView } from '@/components/NormativeComplianceView';
import { FieldExecutionView } from '@/components/FieldExecutionView';
import { ClientPortalView } from '@/components/ClientPortalView';
import { AssetsInventoryView } from '@/components/AssetsInventoryView';
import { CopilotModal } from '@/components/CopilotModal';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { LoginModal } from '@/components/LoginModal';
import { GPSLocatorModal } from '@/components/GPSLocatorModal';
import { InteractiveCommandHub } from '@/components/InteractiveCommandHub';
import { OfflineStatusBanner } from '@/components/OfflineStatusBanner';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useGeolocation } from '@/hooks/useGeolocation';
import { sounds } from '@/lib/soundEffects';
import { 
  Plus, 
  X, 
  Wrench, 
  Sparkles, 
  Building2, 
  DollarSign, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Navigation,
  Zap,
  Radio
} from 'lucide-react';

export default function ZX360Platform() {
  // Session & Auth State
  const [currentUser, setCurrentUser] = useState<UserSession>(MOCK_USERS[0]); // Default to ADMIN
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Platform Data State with Local Persistence
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(MOCK_WORK_ORDERS);
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [normatives, setNormatives] = useState<NormativeCompliance[]>(MOCK_NORMATIVES);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [condominiums, setCondominiums] = useState<Condominium[]>(MOCK_CONDOMINIUMS);
  const [invoices, setInvoices] = useState<FinancialInvoice[]>(MOCK_INVOICES);
  const [kpis, setKpis] = useState(MOCK_KPI);

  // Load client persisted data on mount safely
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedWO = localStorage.getItem('zx360_v2_work_orders');
        if (savedWO) setWorkOrders(JSON.parse(savedWO));
      } catch (e) {
        console.warn('Falha ao restaurar OS do cache local:', e);
      }
      try {
        const savedAst = localStorage.getItem('zx360_v2_assets');
        if (savedAst) setAssets(JSON.parse(savedAst));
      } catch (e) {
        console.warn('Falha ao restaurar ativos do cache local:', e);
      }
      try {
        const savedInv = localStorage.getItem('zx360_v2_inventory');
        if (savedInv) setInventory(JSON.parse(savedInv));
      } catch (e) {
        console.warn('Falha ao restaurar estoque do cache local:', e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Register Service Worker for offline PWA capabilities & ensure fresh cache
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          reg.update().catch(() => {});
        })
        .catch((err) => {
          console.warn('Falha no registro do Service Worker ZX 360:', err);
        });

      // Clear any outdated caches from previous versions
      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => {
            if (key !== 'zx360-pro-v4') {
              caches.delete(key);
            }
          });
        }).catch(() => {});
      }
    }
  }, []);

  // Save to localStorage whenever core entities change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('zx360_v2_work_orders', JSON.stringify(workOrders));
    } catch {}
  }, [workOrders]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('zx360_v2_assets', JSON.stringify(assets));
    } catch {}
  }, [assets]);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Interactive Selection State
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Modals & Drawers
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotInitialSymptom, setCopilotInitialSymptom] = useState<string>('');
  const [copilotInitialAsset, setCopilotInitialAsset] = useState<Asset | undefined>(undefined);
  const [isNewOSModalOpen, setIsNewOSModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Mobile & Offline & GPS Modals
  const [isGPSModalOpen, setIsGPSModalOpen] = useState(false);
  const [isCommandHubOpen, setIsCommandHubOpen] = useState(false);
  const [systemAlertMessage, setSystemAlertMessage] = useState<string | null>(null);

  // Geolocation & Offline Sync Hooks
  const { 
    coordinates: userGPS, 
    loading: gpsLoading, 
    error: gpsError, 
    refreshCoordinates: refreshGPS, 
    calculateDistanceTo, 
    formatCoordinates 
  } = useGeolocation();

  const {
    isOnline,
    pendingCount,
    isSyncing,
    lastSyncTime,
    queueAction,
    syncNow
  } = useOfflineSync((count) => {
    setSystemAlertMessage(`${count} alterações enviadas e salvas no servidor via internet com sucesso.`);
    setTimeout(() => setSystemAlertMessage(null), 4500);
  });

  // New Work Order Form State
  const [newOSTitle, setNewOSTitle] = useState('');
  const [newOSCategory, setNewOSCategory] = useState('CLIMATIZACAO');
  const [newOSPriority, setNewOSPriority] = useState('MEDIA');
  const [newOSCondoId, setNewOSCondoId] = useState(MOCK_CONDOMINIUMS[0].id);
  const [newOSAssetId, setNewOSAssetId] = useState(MOCK_ASSETS[0].id);
  const [newOSDesc, setNewOSDesc] = useState('');

  // Auto-switch primary tab based on role
  const handleSwitchUser = (role: UserRole) => {
    sounds.playClick();
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    setCurrentUser(user);

    if (role === 'TECNICO') {
      setActiveTab('campo');
    } else if (role === 'CLIENTE') {
      setActiveTab('portal');
    } else {
      setActiveTab('dashboard');
    }
  };

  // Keyboard shortcut Ctrl+K for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        sounds.playClick();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update OS Status
  const handleUpdateWorkOrderStatus = (id: string, newStatus: OSStatus) => {
    sounds.playClick();
    setWorkOrders(prev => prev.map(wo => 
      wo.id === id ? { ...wo, status: newStatus } : wo
    ));

    // Save & transmit via internet or queue locally
    queueAction({
      type: 'UPDATE_OS_STATUS',
      payload: { id, status: newStatus }
    });
  };

  // Complete OS from Field Execution
  const handleCompleteWorkOrder = (
    woId: string, 
    signatureData: { name: string; document: string; signatureBase64: string; gpsCoordinates?: string }
  ) => {
    const gpsLocationStr = signatureData.gpsCoordinates || formatCoordinates();
    
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== woId) return wo;
      return {
        ...wo,
        status: 'CONCLUIDA',
        completedAt: new Date().toISOString(),
        checklist: wo.checklist.map(c => ({ ...c, checked: true })),
        signature: {
          name: signatureData.name,
          document: signatureData.document,
          role: 'Síndico / Responsável',
          dataUrl: signatureData.signatureBase64,
          timestamp: new Date().toLocaleString('pt-BR'),
          gpsCoordinates: gpsLocationStr
        },
        gpsCheckin: gpsLocationStr
      };
    }));

    // Save & transmit via internet or queue locally
    queueAction({
      type: 'COMPLETE_OS',
      payload: { woId, signatureData, gpsCoordinates: gpsLocationStr }
    });

    setSystemAlertMessage(`OS finalizada com sucesso! Laudo técnico e comprovante salvos.`);
    setTimeout(() => setSystemAlertMessage(null), 5000);
  };

  // Trigger AI Copilot with context
  const handleOpenCopilotWithContext = (symptom?: string, asset?: Asset) => {
    sounds.playClick();
    setCopilotInitialSymptom(symptom || '');
    setCopilotInitialAsset(asset);
    setIsCopilotOpen(true);
  };

  // QR Code scanned from Interactive Command Hub
  const handleQRCodeScanned = (scannedCode: string) => {
    const foundAsset = assets.find(a => a.code.toLowerCase() === scannedCode.toLowerCase()) || assets[0];
    setSelectedAsset(foundAsset);
    
    // Find or create OS for this asset
    const matchingWo = workOrders.find(w => w.assetId === foundAsset.id);
    if (matchingWo) {
      setSelectedWorkOrder(matchingWo);
      setActiveTab('campo');
    } else {
      setActiveTab('ativos');
    }

    setSystemAlertMessage(`QR Code "${scannedCode}" lido com sucesso! Ativo ${foundAsset.name} selecionado.`);
    setTimeout(() => setSystemAlertMessage(null), 4000);
  };

  // LOTO Emergency Lockdown from Command Hub
  const handleEmergencyLOTOLockdown = () => {
    const emergencyCode = `OS-2026-${String(workOrders.length + 99).padStart(3, '0')}`;
    const emergencyWo: WorkOrder = {
      id: `wo-loto-${Date.now()}`,
      code: emergencyCode,
      title: '🚨 PARADA DE EMERGÊNCIA & BLOQUEIO LOTO (NR-10 / NR-12)',
      description: 'Bloqueio físico de disjuntores e válvulas disparado via Centro de Controle Móvel ZX 360º. Desenergização de segurança em andamento.',
      category: 'ELETRICA_SPDA',
      priority: 'CRITICA',
      status: 'EM_ANDAMENTO',
      type: 'CORRETIVA_EMERGENCIAL',
      condominiumId: condominiums[0].id,
      assetId: assets[0].id,
      assignedTechName: currentUser.name,
      scheduledDate: new Date().toISOString().split('T')[0],
      checklist: [
        { id: 'l1', title: 'Desligamento Geral da Carga', description: 'Abrir seccionadora sob carga', required: true, checked: true, normativeRef: 'NR-10' },
        { id: 'l2', title: 'Instalação de Cadeado LOTO', description: 'Inserir garra plástica e cartão de bloqueio', required: true, checked: false, normativeRef: 'NR-10 / NR-12' },
        { id: 'l3', title: 'Teste de Tensão Residual', description: 'Verificar ausência de potencial elétrico', required: true, checked: false, normativeRef: 'NBR 5410' },
      ],
      partsUsed: [],
      totalCost: 0,
      normativeTags: ['NR-10', 'NR-12', 'LOTO', 'SEGURANCA']
    };

    setWorkOrders(prev => [emergencyWo, ...prev]);
    setSelectedWorkOrder(emergencyWo);
    setActiveTab('campo');
    setSystemAlertMessage('PROTOCOLO LOTO ATIVADO: Ordem Crítica Gerada e equipe notificada.');
    setTimeout(() => setSystemAlertMessage(null), 6000);
  };

  // Trigger IoT Anomaly Test
  const handleTriggerIoTAnomalyTest = () => {
    sounds.playAlert();
    setAssets(prev => prev.map((asset, idx) => {
      if (idx !== 0) return asset;
      return {
        ...asset,
        status: 'CRITICO',
        sensors: asset.sensors.map(s => 
          s.type === 'VIBRACAO' 
            ? { ...s, value: 5.4, status: 'ALARM', lastReading: new Date().toLocaleTimeString('pt-BR') }
            : s
        )
      };
    }));

    setSystemAlertMessage('ANOMALIA IOT SIMULADA: Vibração do Chiller excedeu 5.4 mm/s RMS.');
    setTimeout(() => setSystemAlertMessage(null), 5000);
  };

  // Create Predictive OS from IoT Anomaly
  const handleCreatePredictiveOS = (asset: Asset, sensor: IoTSensor) => {
    sounds.playScanBeep();
    const newCode = `OS-2026-${String(workOrders.length + 90).padStart(3, '0')}`;
    const newWo: WorkOrder = {
      id: `wo-${Date.now()}`,
      code: newCode,
      title: `Manutenção Preditiva Automática: ${asset.name}`,
      description: `Telemetria do sensor ${sensor.label} acusou leitura de ${sensor.value} ${sensor.unit}, excedendo o limiar de segurança de ${sensor.maxThreshold} ${sensor.unit}. Disparo preventivo de inspeção e substituição de componentes.`,
      category: asset.category,
      priority: 'CRITICA',
      status: 'EM_ANDAMENTO',
      type: 'CORRETIVA_EMERGENCIAL',
      assetId: asset.id,
      condominiumId: asset.condominiumId,
      assignedTechId: 'user-tecnico',
      assignedTechName: 'Duncan / Mentor (Man-At-Arms)',
      scheduledDate: new Date().toISOString().split('T')[0],
      checklist: [
        { id: 'c1', title: 'Desenergização LOTO', description: 'Bloquear disjuntor conforme NR-10', required: true, checked: false, normativeRef: 'NR-10' },
        { id: 'c2', title: 'Análise Espectral de Vibração', description: 'Medir frequência de falha do rolamento', required: true, checked: false, normativeRef: 'ISO 10816' },
        { id: 'c3', title: 'Troca de Rolamento SKF', description: 'Substituir rolamento e lubrificar', required: true, checked: false, normativeRef: 'Manual Fabricante' },
      ],
      partsUsed: [
        {
          partId: 'part-rolamento-skf',
          partName: 'Rolamento SKF 6308 2RS C3',
          quantity: 1,
          unitCost: 145.0,
        }
      ],
      totalCost: 145.0,
      normativeTags: ['PREDITIVA', 'ISO 10816', 'NR-10']
    };

    setWorkOrders(prev => [newWo, ...prev]);
    setSelectedWorkOrder(newWo);
    setActiveTab('kanban');
  };

  // Submit New OS Form
  const handleCreateNewOSSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOSTitle.trim()) return;

    sounds.playClick();
    const newCode = `OS-2026-${String(workOrders.length + 90).padStart(3, '0')}`;
    const newWo: WorkOrder = {
      id: `wo-${Date.now()}`,
      code: newCode,
      title: newOSTitle,
      description: newOSDesc || 'Ordem de serviço aberta via Centro de Controle ZX 360º.',
      category: newOSCategory as any,
      priority: newOSPriority as any,
      status: 'ABERTA',
      type: 'PREVENTIVA_PMOC',
      assetId: newOSAssetId,
      condominiumId: newOSCondoId,
      assignedTechName: 'Aguardando atribuição',
      scheduledDate: new Date().toISOString().split('T')[0],
      checklist: [
        { id: 'c1', title: 'Inspeção Visual Preliminar', description: 'Verificar integridade do equipamento', required: true, checked: false, normativeRef: 'NBR 5674' },
        { id: 'c2', title: 'Execução do Procedimento Padrão', description: 'Realizar manutenção conforme normas', required: true, checked: false, normativeRef: 'ABNT / PMOC' },
      ],
      partsUsed: [],
      totalCost: 0,
      normativeTags: ['PMOC', 'NBR 5674']
    };

    setWorkOrders(prev => [newWo, ...prev]);
    setIsNewOSModalOpen(false);
    setNewOSTitle('');
    setNewOSDesc('');
    setSelectedWorkOrder(newWo);
    setActiveTab('kanban');

    // Save & transmit via internet or queue locally
    queueAction({
      type: 'CREATE_OS',
      payload: newWo
    });

    setSystemAlertMessage(`Nova Ordem de Serviço ${newCode} aberta com sucesso.`);
    setTimeout(() => setSystemAlertMessage(null), 4000);
  };

  // Count active sensors in alert
  const activeAlertsCount = assets.filter(a => a.status === 'ALERTA' || a.status === 'CRITICO').length;

  return (
    <div className="flex flex-col min-h-screen bg-[#09090B] text-zinc-100 antialiased font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top HUD Header */}
      <AppHeader
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenCopilot={() => handleOpenCopilotWithContext()}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onLogout={() => setIsLoginModalOpen(true)}
        activeSensorsAlertsCount={activeAlertsCount}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenGPSModal={() => setIsGPSModalOpen(true)}
        onOpenCommandHub={() => setIsCommandHubOpen(true)}
      />

      {/* Offline Status Banner */}
      <OfflineStatusBanner
        isOnline={isOnline}
        pendingCount={pendingCount}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
        onSync={syncNow}
      />

      {/* Floating System Toast Alert */}
      {systemAlertMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md p-3.5 rounded-xl bg-zinc-900/95 border border-cyan-500/50 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
          <p className="text-xs text-zinc-200 font-medium">{systemAlertMessage}</p>
          <button 
            onClick={() => setSystemAlertMessage(null)}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 ml-auto"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex flex-1 min-w-0">
        
        {/* Left Sidebar (Desktop) */}
        <AppSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          userRole={currentUser.role}
          onOpenCopilot={() => handleOpenCopilotWithContext()}
          activeSensorsAlertsCount={activeAlertsCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto min-w-0 max-w-[1920px] mx-auto pb-24 md:pb-8 space-y-4">
          
          {/* Fast Login / Role Access Banner on Main Screen */}
          <RoleLoginBar
            currentUser={currentUser}
            onSelectRole={handleSwitchUser}
            onOpenFullLogin={() => setIsLoginModalOpen(true)}
          />

          {/* Categorized Module Menu (Prevents Main Screen Overload) */}
          <ModuleNavigationMenu
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            userRole={currentUser.role}
            activeSensorsAlertsCount={activeAlertsCount}
          />
          
          {/* 1. Dashboard / Centro de Controle */}
          {activeTab === 'dashboard' && (
            <DashboardView
              kpis={kpis}
              workOrders={workOrders}
              assets={assets}
              normatives={normatives}
              condominiums={condominiums}
              userRole={currentUser.role}
              onSelectTab={setActiveTab}
              onSelectWorkOrder={(wo) => {
                setSelectedWorkOrder(wo);
                setActiveTab('kanban');
              }}
              onOpenCopilot={() => handleOpenCopilotWithContext()}
              onTriggerNewOS={() => setIsNewOSModalOpen(true)}
            />
          )}

          {/* 2. Quadro Kanban de OS */}
          {activeTab === 'kanban' && (
            <KanbanBoard
              workOrders={workOrders}
              assets={assets}
              userRole={currentUser.role}
              selectedWorkOrder={selectedWorkOrder}
              onSelectWorkOrder={setSelectedWorkOrder}
              onUpdateWorkOrderStatus={handleUpdateWorkOrderStatus}
              onOpenFieldExecution={(wo) => {
                setSelectedWorkOrder(wo);
                setActiveTab('campo');
              }}
              onOpenCopilotWithContext={(wo) => handleOpenCopilotWithContext(`Avalie a OS ${wo.code}: ${wo.title} - ${wo.description}`)}
              onTriggerNewOS={() => setIsNewOSModalOpen(true)}
            />
          )}

          {/* 3. Execução em Campo 4.0 (/campo) */}
          {activeTab === 'campo' && (
            <FieldExecutionView
              workOrders={workOrders}
              assets={assets}
              userRole={currentUser.role}
              activeWorkOrderId={selectedWorkOrder?.id}
              isOnline={isOnline}
              onCompleteWorkOrder={handleCompleteWorkOrder}
              onOpenCopilot={() => handleOpenCopilotWithContext()}
              onOpenGPSModal={() => setIsGPSModalOpen(true)}
            />
          )}

          {/* 4. Gêmeo Digital & IoT */}
          {activeTab === 'digital-twin' && (
            <DigitalTwin
              assets={assets}
              onOpenCopilot={handleOpenCopilotWithContext}
              onSelectAsset={(asset) => {
                setSelectedAsset(asset);
                setActiveTab('ativos');
              }}
              onCreatePredictiveOS={handleCreatePredictiveOS}
            />
          )}

          {/* 5. Normativas, NRs & PMOC */}
          {activeTab === 'normativas' && (
            <NormativeComplianceView
              normatives={normatives}
              userRole={currentUser.role}
              onGeneratePMOCReport={() => {
                setIsCopilotOpen(true);
              }}
            />
          )}

          {/* 6. Ativos & QR Codes / Estoque */}
          {activeTab === 'ativos' && (
            <AssetsInventoryView
              assets={assets}
              inventory={inventory}
              userRole={currentUser.role}
              onOpenCopilot={handleOpenCopilotWithContext}
              onSelectAsset={(asset) => setSelectedAsset(asset)}
            />
          )}

          {/* 7. Estoque isolado */}
          {activeTab === 'estoque' && (
            <AssetsInventoryView
              assets={assets}
              inventory={inventory}
              userRole={currentUser.role}
              onOpenCopilot={handleOpenCopilotWithContext}
              onSelectAsset={(asset) => setSelectedAsset(asset)}
            />
          )}

          {/* 8. Portal do Síndico / Cliente */}
          {activeTab === 'portal' && (
            <ClientPortalView
              condominium={condominiums[0]}
              workOrders={workOrders}
              normatives={normatives}
              invoices={invoices}
              onOpenNewTicket={() => setIsNewOSModalOpen(true)}
              onSelectWorkOrder={(wo) => {
                setSelectedWorkOrder(wo);
                setActiveTab('kanban');
              }}
            />
          )}

          {/* 9. Condomínios & Clientes */}
          {activeTab === 'condominios' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-12">
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-base sm:text-lg font-bold text-zinc-100">Condomínios & Contratos de Facilities</h1>
                    <p className="text-xs text-zinc-400">Gerenciamento de unidades prediais, síndicos e dados cadastrais</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {condominiums.map(c => (
                  <div key={c.id} className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 shadow-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">{c.cnpj}</span>
                        <h3 className="text-base font-bold text-zinc-100">{c.name}</h3>
                        <p className="text-xs text-zinc-400">{c.address}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {c.healthScore}% Saúde
                      </span>
                    </div>

                    <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-300 space-y-1 font-mono">
                      <div>Síndico(a): <strong className="text-zinc-100">{c.managerName}</strong></div>
                      <div>Contato: <strong className="text-cyan-300">{c.managerPhone} ({c.managerEmail})</strong></div>
                    </div>

                    <button
                      onClick={() => setActiveTab('portal')}
                      className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                    >
                      Acessar Portal do Condomínio
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. Financeiro & Faturas */}
          {activeTab === 'financeiro' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-12">
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-base sm:text-lg font-bold text-zinc-100">Faturamento & Contratos</h1>
                    <p className="text-xs text-zinc-400">Controle financeiro mensal de prestação de serviços de Facilities</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-mono text-[10px] uppercase">
                    <tr>
                      <th className="px-4 py-3">Código</th>
                      <th className="px-4 py-3">Condomínio</th>
                      <th className="px-4 py-3">Descrição do Serviço</th>
                      <th className="px-4 py-3">Vencimento</th>
                      <th className="px-4 py-3">Valor</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-zinc-800/40">
                        <td className="px-4 py-3 font-mono font-bold text-zinc-100">{inv.code}</td>
                        <td className="px-4 py-3 font-semibold text-zinc-200">Condomínio Fortaleza Castelo de Grayskull</td>
                        <td className="px-4 py-3 text-zinc-400">{inv.description}</td>
                        <td className="px-4 py-3 font-mono text-zinc-400">{inv.dueDate}</td>
                        <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                          R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                            inv.status === 'PAGO' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 11. Usuários & Auditoria (Admin Only) */}
          {activeTab === 'auditoria' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-12">
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-950 text-rose-400 border border-rose-800">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-base sm:text-lg font-bold text-zinc-100">Usuários, Papéis & Auditoria (RBAC)</h1>
                    <p className="text-xs text-zinc-400">Matriz de isolamento de privilégios e logs de auditoria</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_USERS.map(u => (
                  <div key={u.id} className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-3">
                      <Image
                        src={u.avatar}
                        alt={u.name}
                        width={40}
                        height={40}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-700"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-zinc-100">{u.name}</h4>
                        <p className="text-[11px] text-zinc-400">{u.email}</p>
                        <span className="text-[10px] font-mono text-cyan-400 mt-0.5 block">{u.role}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSwitchUser(u.role)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                    >
                      Assumir Perfil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        userRole={currentUser.role}
        onOpenMoreMenu={() => setIsCommandPaletteOpen(true)}
        onOpenGPSModal={() => setIsGPSModalOpen(true)}
        onOpenCommandHub={() => setIsCommandHubOpen(true)}
        pendingOfflineCount={pendingCount}
      />

      {/* GPS Geolocation & Telemetry Modal */}
      <GPSLocatorModal
        isOpen={isGPSModalOpen}
        onClose={() => setIsGPSModalOpen(false)}
        assets={assets}
        condominiums={condominiums}
        onCheckinSuccess={(condoName, coords) => {
          setSystemAlertMessage(`Check-in de presença validado em ${condoName} (${coords})`);
          setTimeout(() => setSystemAlertMessage(null), 5000);
        }}
      />

      {/* Interactive Command Hub & Tools Modal */}
      <InteractiveCommandHub
        isOpen={isCommandHubOpen}
        onClose={() => setIsCommandHubOpen(false)}
        onScanResult={handleQRCodeScanned}
        onTriggerEmergencyStop={handleEmergencyLOTOLockdown}
        onSimulateVibrationAnomaly={handleTriggerIoTAnomalyTest}
        onVoiceNoteRecorded={(note) => {
          setSystemAlertMessage(`Nota de voz salva no diário técnico: "${note.slice(0, 40)}..."`);
          setTimeout(() => setSystemAlertMessage(null), 5000);
        }}
      />

      {/* Command Palette Modal (Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        workOrders={workOrders}
        assets={assets}
        condominiums={condominiums}
        userRole={currentUser.role}
        onSelectTab={setActiveTab}
        onSelectWorkOrder={(wo) => {
          setSelectedWorkOrder(wo);
          setActiveTab('kanban');
        }}
        onSelectAsset={(asset) => {
          setSelectedAsset(asset);
          setActiveTab('ativos');
        }}
        onOpenCopilot={() => handleOpenCopilotWithContext()}
      />

      {/* AI Copilot Modal */}
      <CopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        initialSymptom={copilotInitialSymptom}
        initialAsset={copilotInitialAsset}
        assets={assets}
      />

      {/* Login & Fast Role Switch Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsLoginModalOpen(false);
          handleSwitchUser(user.role);
        }}
      />

      {/* NEW OS MODAL */}
      {isNewOSModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in">
          <div 
            className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-700 p-6 space-y-4 shadow-2xl text-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-cyan-400" />
                <h2 className="text-sm sm:text-base font-bold text-zinc-100">Nova Ordem de Serviço</h2>
              </div>
              <button
                onClick={() => setIsNewOSModalOpen(false)}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewOSSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Título da OS:</label>
                <input
                  type="text"
                  required
                  value={newOSTitle}
                  onChange={(e) => setNewOSTitle(e.target.value)}
                  placeholder="Ex: Manutenção Preventiva PMOC Chiller Cobertura"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Categoria do Ativo:</label>
                  <select
                    value={newOSCategory}
                    onChange={(e) => setNewOSCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CLIMATIZACAO">Climatização (PMOC)</option>
                    <option value="INCENDIO_AVCB">Incêndio & AVCB</option>
                    <option value="ELETRICA_SPDA">Elétrica & SPDA</option>
                    <option value="HIDRAULICA">Hidráulica & Bombas</option>
                    <option value="GERADORES">Geradores</option>
                    <option value="ELEVADORES">Elevadores (RIA)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Prioridade:</label>
                  <select
                    value={newOSPriority}
                    onChange={(e) => setNewOSPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="BAIXA">Baixa (Rotina)</option>
                    <option value="MEDIA">Média (Preventiva)</option>
                    <option value="ALTA">Alta (Corretiva)</option>
                    <option value="CRITICA">Crítica (Emergência 24h)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Equipamento Vinculado:</label>
                <select
                  value={newOSAssetId}
                  onChange={(e) => setNewOSAssetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.code} - {a.name} ({a.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Descrição Detalhada do Serviço:</label>
                <textarea
                  rows={3}
                  value={newOSDesc}
                  onChange={(e) => setNewOSDesc(e.target.value)}
                  placeholder="Detalhe o escopo do serviço, procedimentos técnicos ou anomalias encontradas..."
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewOSModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
                >
                  Abrir Ordem de Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/60 backdrop-blur-xs animate-in fade-in">
          <div 
            className="w-full max-w-sm h-full bg-zinc-900 border-l border-zinc-800 p-5 space-y-4 text-zinc-100 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold">Notificações da Central</h3>
                </div>
                <button onClick={() => setNotificationsOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs space-y-1">
                  <span className="font-bold text-amber-300 block">Alerta de Vibração IoT</span>
                  <p className="text-zinc-400 text-[11px]">Bomba Recalque 01 atingiu 4.82 mm/s RMS no Subsolo 2.</p>
                  <span className="text-[10px] font-mono text-zinc-500">Há 15 minutos</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                  <span className="font-bold text-emerald-400 block">Certificado SPDA Válido</span>
                  <p className="text-zinc-400 text-[11px]">Laudo NBR 5419 arquivado e homologado com sucesso.</p>
                  <span className="text-[10px] font-mono text-zinc-500">Hoje às 10:20</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                  <span className="font-bold text-cyan-400 block">Assinatura Coletada</span>
                  <p className="text-zinc-400 text-[11px]">OS-2026-085 assinada pelo síndico Rei Randor.</p>
                  <span className="text-[10px] font-mono text-zinc-500">Ontem às 16:45</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setNotificationsOpen(false)}
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
            >
              Fechar Notificações
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
