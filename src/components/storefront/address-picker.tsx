"use client";

import { useState } from "react";
import { createAddress, setDefaultAddress, deleteAddress } from "@/lib/actions/address";

interface Address {
  id: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface AddressPickerProps {
  addresses: Address[];
  isLoggedIn: boolean;
  onSelect: (address: Address | null) => void;
}

export function AddressPicker({ addresses: initial, isLoggedIn, onSelect }: AddressPickerProps) {
  const [addresses, setAddresses] = useState(initial);
  const [selectedId, setSelectedId] = useState<string | null>(
    initial.find((a) => a.isDefault)?.id ?? initial[0]?.id ?? null
  );
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Auto-select on mount
  useState(() => {
    const defaultAddr = initial.find((a) => a.isDefault) ?? initial[0];
    if (defaultAddr) onSelect(defaultAddr);
  });

  function handleSelect(addr: Address) {
    setSelectedId(addr.id);
    onSelect(addr);
  }

  async function handleSave() {
    if (!street.trim() || !number.trim() || !neighborhood.trim()) return;
    setSaving(true);
    try {
      const newAddr = await createAddress({
        street: street.trim(),
        number: number.trim(),
        complement: complement.trim() || undefined,
        neighborhood: neighborhood.trim(),
        city: "Ponta Grossa",
        state: "PR",
        zipCode: zipCode.trim(),
        isDefault: addresses.length === 0,
      });
      const full: Address = {
        ...newAddr,
        complement: newAddr.complement,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [full, ...prev]);
      setSelectedId(full.id);
      onSelect(full);
      setShowForm(false);
      setStreet("");
      setNumber("");
      setComplement("");
      setNeighborhood("");
      setZipCode("");
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }

  async function handleSetDefault(id: string) {
    await setDefaultAddress(id);
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  }

  async function handleDelete(id: string) {
    await deleteAddress(id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedId === id) {
      const remaining = addresses.filter((a) => a.id !== id);
      const next = remaining[0] ?? null;
      setSelectedId(next?.id ?? null);
      onSelect(next);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-2">Endereco de entrega</h2>
        <div className="p-4 bg-card border border-border rounded-xl">
          <p className="text-sm text-muted-foreground">
            Faca login para salvar e gerenciar seus enderecos.
          </p>
          <div className="mt-3 space-y-3">
            <input
              type="text"
              placeholder="Rua"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Numero"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
              />
              <input
                type="text"
                placeholder="Complemento"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                className="col-span-2 flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Bairro"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold">Endereco de entrega</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs font-medium text-primary hover:underline"
        >
          {showForm ? "Cancelar" : "+ Novo endereco"}
        </button>
      </div>

      {/* New address form */}
      {showForm && (
        <div className="p-4 bg-card border border-primary/20 rounded-xl mb-3 space-y-3">
          <input
            type="text"
            placeholder="Rua / Avenida"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Numero"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
            />
            <input
              type="text"
              placeholder="Complemento"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              className="col-span-2 flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Bairro"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
            />
            <input
              type="text"
              placeholder="CEP"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              maxLength={9}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !street.trim() || !number.trim() || !neighborhood.trim()}
            className="w-full h-10 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar endereco"}
          </button>
        </div>
      )}

      {/* Address list */}
      {addresses.length === 0 && !showForm ? (
        <div className="p-4 bg-card border border-dashed border-border rounded-xl text-center">
          <p className="text-sm text-muted-foreground">Nenhum endereco cadastrado</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-sm font-medium text-primary hover:underline"
          >
            Cadastrar endereco
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => handleSelect(addr)}
              className={`w-full text-left p-3 rounded-xl border transition-colors ${
                selectedId === addr.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Radio indicator */}
                <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selectedId === addr.id ? "border-primary" : "border-muted-foreground/30"
                }`}>
                  {selectedId === addr.id && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">
                    {addr.street}, {addr.number}
                    {addr.complement ? ` - ${addr.complement}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {addr.neighborhood} - {addr.city}/{addr.state}
                    {addr.zipCode ? ` - ${addr.zipCode}` : ""}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-primary uppercase">Padrao</span>
                    )}
                    {!addr.isDefault && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSetDefault(addr.id); }}
                        className="text-[10px] text-muted-foreground hover:text-primary"
                      >
                        Definir como padrao
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(addr.id); }}
                      className="text-[10px] text-muted-foreground hover:text-red-500"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
