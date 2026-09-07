'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Search, X } from 'lucide-react';
import { Button, Select } from '@autohub360/ui';
import { track } from '@autohub360/analytics';
import { useFitmentStore } from '@autohub360/vehicle-fitment';
import {
  getVehicleMakes,
  getVehicleModels,
  getVehicleVersions,
  describeVehicle,
} from '@autohub360/catalog';;

type Mode = 'car' | 'moto' | 'truck';

const MODES: Array<{ key: Mode; label: string }> = [
  { key: 'car', label: 'Carro' },
  { key: 'moto', label: 'Moto' },
  { key: 'truck', label: 'Caminhão' },
];

/** Structured vehicle fitment selector (type → make → model → year/version). */
export function VehicleSelector({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('car');
  const [makeId, setMakeId] = useState('');
  const [modelId, setModelId] = useState('');
  const [versionId, setVersionId] = useState('');
  const setVehicle = useFitmentStore((s) => s.setVehicle);
  const saveToGarage = useFitmentStore((s) => s.saveToGarage);
  const garage = useFitmentStore((s) => s.garage);
  const selected = useFitmentStore((s) => s.selected);
  const clearVehicle = useFitmentStore((s) => s.clearVehicle);

  const makes = useMemo(() => getVehicleMakes(mode), [mode]);
  const models = useMemo(() => (makeId ? getVehicleModels(makeId) : []), [makeId]);
  const versions = useMemo(() => (modelId ? getVehicleVersions(modelId) : []), [modelId]);
  const yearOptions = useMemo(() => {
    const years = new Set<number>();
    for (const v of versions) {
      for (let y = v.yearEnd; y >= v.yearStart; y--) years.add(y);
    }
    return [...years].sort((a, b) => b - a);
  }, [versions]);
  const [year, setYear] = useState('');
  const validVersions = useMemo(
    () => (year ? versions.filter((v) => Number(year) >= v.yearStart && Number(year) <= v.yearEnd) : versions),
    [versions, year],
  );

  const ready = validVersions.length === 1 || (year && versionId);

  function onSearch() {
    const vid = versionId || validVersions[0]?.id;
    if (!vid) return;
    const label = describeVehicle(vid);
    setVehicle({ makeId, modelId, versionId: vid });
    track('vehicle_selected', { vehicle: label });
    saveToGarage(label);
    router.push(`/veiculo?versao=${vid}`);
  }

  return (
    <section
      aria-label="Encontre peças e acessórios para o seu veículo"
      className="rounded-xl border border-ahblue-500/25 bg-gradient-to-br from-ahblue-500/[0.07] to-white p-4 sm:p-5"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ahblue-500 text-white">
          <Car className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-[17px] font-extrabold text-ink-900">
            Encontre peças e acessórios para o seu veículo
          </h2>
          <p className="text-[13px] text-ink-500">
            Selecione os dados do veículo e veja apenas o que é compatível.
          </p>
        </div>
      </div>

      {garage.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink-500">Sua garagem:</span>
          {garage.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setVehicle({ makeId: g.makeId, modelId: g.modelId, versionId: g.versionId })}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                selected.versionId === g.versionId
                  ? 'border-ahblue-500 bg-ahblue-500 text-white'
                  : 'border-surface-300 bg-white text-ink-700 hover:border-ahblue-400'
              }`}
            >
              {g.label}
            </button>
          ))}
          {selected.versionId && (
            <button
              type="button"
              onClick={clearVehicle}
              className="inline-flex items-center gap-1 rounded-full border border-surface-300 bg-white px-2.5 py-1 text-xs text-ink-500 hover:border-red-300 hover:text-red-600"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              limpar
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => {
              setMode(m.key);
              setMakeId('');
              setModelId('');
              setVersionId('');
              setYear('');
            }}
            aria-pressed={mode === m.key}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              mode === m.key
                ? 'bg-navy-900 text-white'
                : 'bg-white text-ink-700 border border-surface-300 hover:border-ahblue-400'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className={`grid gap-3 ${compact ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
        <Select
          aria-label="Marca"
          value={makeId}
          onChange={(e) => {
            setMakeId(e.target.value);
            setModelId('');
            setVersionId('');
          }}
        >
          <option value="">Marca</option>
          {makes.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Modelo"
          value={modelId}
          onChange={(e) => {
            setModelId(e.target.value);
            setVersionId('');
            setYear('');
          }}
          disabled={!makeId}
        >
          <option value="">Modelo</option>
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Ano"
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            setVersionId('');
          }}
          disabled={!modelId}
        >
          <option value="">Ano</option>
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>
        {!compact ? (
          <Select
            aria-label="Versão e motorização"
            value={versionId}
            onChange={(e) => setVersionId(e.target.value)}
            disabled={!modelId}
          >
            <option value="">Versão / motorização</option>
            {validVersions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} · {v.engine}
              </option>
            ))}
          </Select>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={onSearch} disabled={!ready} size={compact ? 'sm' : 'md'}>
          <Search className="h-4.5 w-4.5" aria-hidden="true" />
          Buscar compatibilidade
        </Button>
        {ready && (
          <span className="text-xs text-ink-500">
            {validVersions.length === 1
              ? describeVehicle(validVersions[0]!.id)
              : versionId
                ? describeVehicle(versionId)
                : `${validVersions.length} versões encontradas`}
          </span>
        )}
      </div>
    </section>
  );
}
