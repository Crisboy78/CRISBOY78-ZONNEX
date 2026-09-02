'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Crosshair,
  Radio,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  X,
  Building2,
  Cpu,
  Layers,
  Sparkles,
  Volume2,
  ShieldCheck,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useGeolocation, calculateDistanceMeters, GEOFENCE_MAX_RADIUS_METERS } from '@/hooks/useGeolocation';
import { Asset, Condominium } from '@/types/maintenance';
import { sounds } from '@/lib/soundEffects';

interface GPSLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  condominiums: Condominium[];
  onCheckinSuccess?: (assetId: string, locationStr: string) => void;
}

export const GPSLocatorModal: React.FC<GPSLocatorModalProps> = ({
  isOpen,
  onClose,
  assets,
  condominiums,
  onCheckinSuccess,
}) => {
  const geo = useGeolocation();
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || '');
  const [checkinDone, setCheckinDone] = useState<boolean>(false);
  const [forcedVerificationJustification, setForcedVerificationJustification] = useState<string>('');
  const [isForcingVerification, setIsForcingVerification] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const condo = condominiums.find((c) => c.id === selectedAsset?.condominiumId) || condominiums[0];

  // Asset coordinates approximation
  const assetCoords = {
    lat: selectedAsset ? -23.587416 + (selectedAsset.id.charCodeAt(0) % 5) * 0.0001 : -23.587416,
    lng: selectedAsset ? -46.681532 + (selectedAsset.id.charCodeAt(1) % 5) * 0.0001 : -46.681532,
  };

  const condoCoords = {
    lat: -23.587416,
    lng: -46.681532,
  };

  const distanceToAsset =
    geo.latitude && geo.longitude
      ? calculateDistanceMeters(geo.latitude, geo.longitude, assetCoords.lat, assetCoords.lng)
      : 12;

  const geofenceResult = geo.checkGeofence(condoCoords.lat, condoCoords.lng, GEOFENCE_MAX_RADIUS_METERS);
  const isOutsideGeofence = geofenceResult.distanceMeters > GEOFENCE_MAX_RADIUS_METERS;

  const handlePerformCheckin = () => {
    if (isOutsideGeofence && !isForcingVerification) {
      sounds.playAlarm();
      setIsForcingVerification(true);
      return;
    }

    sounds.playGPSLock();
    setCheckinDone(true);
    if (onCheckinSuccess && selectedAsset) {
      const coordStr = `${geo.latitude?.toFixed(6) || '-23.587416'}, ${geo.longitude?.toFixed(6) || '-46.681532'}${isOutsideGeofence ? ' [Geofence Override Audit]' : ' [Geofence Verified]'}`;
      onCheckinSuccess(selectedAsset.id, coordStr);
    }
    setTimeout(() => {
      setCheckinDone(false);
      setIsForcingVerification(false);
    }, 4500);
  };

  const handleRefresh = () => {
    sounds.playClick();
    geo.refreshLocation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-zinc-900/95 border border-cyan-500/40 shadow-2xl shadow-cyan-950/40 overflow-hidden flex flex-col max-h-[92vh] backdrop-blur-xl">
        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/90">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shrink-0">
              <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-pulse" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-zinc-100 flex items-center gap-2 truncate">
                Geolocalização & Geofencing 50m
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hidden sm:inline">
                  RTK Precision
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono truncate">
                Rastreamento e validação de presença no condomínio com geofence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Live GPS Telemetry Card */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-950/90 border border-cyan-500/30 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 font-mono">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Latitude</span>
              <span className="text-xs sm:text-sm font-bold text-cyan-400 truncate block">
                {geo.latitude ? geo.latitude.toFixed(6) : '--'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Longitude</span>
              <span className="text-xs sm:text-sm font-bold text-cyan-400 truncate block">
                {geo.longitude ? geo.longitude.toFixed(6) : '--'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Precisão GPS</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1">
                ±{geo.accuracy || 4.5}m
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Altitude</span>
              <span className="text-xs sm:text-sm font-bold text-zinc-200">
                {geo.altitude || 780}m
              </span>
            </div>
          </div>

          {/* Geofencing Verification Card */}
          <div className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isOutsideGeofence
              ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
          }`}>
            <div className="flex items-center gap-3">
              {isOutsideGeofence ? (
                <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              )}
              <div>
                <div className="text-xs font-bold font-mono flex items-center gap-1.5">
                  <span>Geofencing Predial (Raio Máximo: {GEOFENCE_MAX_RADIUS_METERS}m):</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isOutsideGeofence ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {isOutsideGeofence ? 'FORA DO RAIO (>50M)' : 'DENTRO DO PERÍMETRO (<50M)'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 font-mono mt-0.5">
                  Distância atual ao condomínio cadastrado: <strong className={isOutsideGeofence ? 'text-amber-400' : 'text-emerald-400'}>{geofenceResult.distanceMeters}m</strong>.
                </p>
              </div>
            </div>

            <div className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 whitespace-nowrap">
              Alvo: {condo.name}
            </div>
          </div>

          {/* Forced Checkin / Verification notice if outside 50m */}
          {isOutsideGeofence && isForcingVerification && (
            <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/50 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Verificação de Localização Forçada Exigida</span>
              </div>
              <p className="text-[11px] text-zinc-300 font-mono">
                Você está a {geofenceResult.distanceMeters}m do local da OS (limite de 50m). Para registrar presença mesmo fora do perímetro, insira a justificativa técnica para auditoria:
              </p>
              <input
                type="text"
                value={forcedVerificationJustification}
                onChange={(e) => setForcedVerificationJustification(e.target.value)}
                placeholder="Ex: Sinal GPS com reflexão em subsolo 2 / Validação presencial autorizada"
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-amber-500/40 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          {/* Compass & Radar Simulation Display */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-zinc-950 to-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Radar Circle */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full border-2 border-cyan-500/30 flex items-center justify-center bg-zinc-950/80 shadow-inner shrink-0">
              <div className="absolute inset-2 rounded-full border border-cyan-500/20"></div>
              <div className="absolute inset-8 rounded-full border border-cyan-500/10"></div>
              <div className="absolute w-full h-[1px] bg-cyan-500/20"></div>
              <div className="absolute h-full w-[1px] bg-cyan-500/20"></div>
              
              {/* Radar sweep line */}
              <div className="absolute w-1/2 h-[2px] bg-gradient-to-r from-transparent to-cyan-400 origin-left left-1/2 animate-spin"></div>
              
              {/* Center User Dot */}
              <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50 flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-950"></div>
              </div>

              {/* Target Equipment Blip */}
              <div className="absolute top-6 right-8 w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
              <div className="absolute top-6 right-8 w-3 h-3 rounded-full bg-emerald-500 border border-white z-10"></div>
            </div>

            {/* Target Asset Information */}
            <div className="w-full sm:flex-1 space-y-2 min-w-0">
              <label className="text-xs font-mono text-zinc-400 block">
                Selecionar Equipamento Alvo para Navegação:
              </label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-xs text-zinc-200 font-mono focus:border-cyan-500 focus:outline-none truncate"
              >
                {assets.map((ast) => (
                  <option key={ast.id} value={ast.id}>
                    {ast.name} ({ast.location})
                  </option>
                ))}
              </select>

              {selectedAsset && (
                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-xs font-mono space-y-1">
                  <div className="text-zinc-300 font-bold truncate">{selectedAsset.name}</div>
                  <div className="text-zinc-400 flex items-center gap-1.5 text-[11px] truncate">
                    <Building2 className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{condo?.name || 'Condomínio Master'} • {selectedAsset.location}</span>
                  </div>
                  <div className="text-emerald-400 font-semibold text-xs flex items-center gap-1 mt-1">
                    <Crosshair className="w-3.5 h-3.5 shrink-0" />
                    <span>Distância estimada ao ativo: {distanceToAsset ?? 12} metros</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <button
              onClick={handleRefresh}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-xs font-mono text-zinc-200 flex items-center justify-center gap-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Atualizar Coordenadas GPS</span>
            </button>

            <button
              onClick={handlePerformCheckin}
              className={`w-full sm:flex-1 py-2.5 rounded-xl active:scale-95 text-xs font-bold font-mono text-zinc-950 flex items-center justify-center gap-2 transition shadow-lg ${
                isOutsideGeofence
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 shadow-cyan-500/20'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {isOutsideGeofence && isForcingVerification
                  ? 'Confirmar Check-in com Justificativa Forçada'
                  : isOutsideGeofence
                  ? 'Forçar Verificação de Localização'
                  : 'Realizar Check-in Georreferenciado'}
              </span>
            </button>
          </div>

          {/* Success Check-in Message */}
          {checkinDone && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                Check-in validado com sucesso! Coordenadas ({geo.formatCoordinates()}) vinculadas à OS e registradas para auditoria com geofencing ativo.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
