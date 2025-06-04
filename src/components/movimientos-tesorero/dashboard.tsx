import React, { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Finanza_Barrio, getAllFinanzasByBarrio } from "@/services/finanzas";

export default function TreasurerDashboard() {
    const [financialData, setFinancialData] = useState<Finanza_Barrio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Evitar acceso a localStorage en SSR
    if (typeof window === "undefined") return;

    const barrioId = JSON.parse(localStorage.getItem("user") || "{}")?.barrio_id;

    getAllFinanzasByBarrio(barrioId)
    .then((data) => {
        if (data) {
        setFinancialData(data);
        } else {
        setFinancialData(null);
        }
        setLoading(false);
    })
      .catch((err) => {
        setError(err.message || "Error desconocido");
        setLoading(false);
      });
  }, []);

  // Formateo moneda
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);

  // Formateo fecha
const formatDate = (dateStr: string) => {
  if (!dateStr) return "Fecha inválida";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Fecha inválida";

  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};


  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!financialData)
    return <div>No hay datos financieros disponibles para este barrio.</div>;

  const lastTransaction = financialData.movimientos.length > 0
  ? financialData.movimientos[0]
  : null;


  const tipoMinuscula = lastTransaction?.tipo?.toLowerCase() || "";

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-6 p-4 sm:p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Ingresos</CardTitle>
              <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(financialData.total_ingresos)}
              </div>
              <p className="text-xs text-muted-foreground">Acumulado hasta la fecha</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Egresos</CardTitle>
              <ArrowDownIcon className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">
                {formatCurrency(financialData.total_egresos)}
              </div>
              <p className="text-xs text-muted-foreground">Acumulado hasta la fecha</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(financialData.saldo)}
              </div>
              <p className="text-xs text-muted-foreground">Disponible actualmente</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Último Movimiento</CardTitle>
            <CardDescription>Detalle del movimiento más reciente registrado</CardDescription>
          </CardHeader>
          <CardContent>
            {lastTransaction ? (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`rounded-full p-2 ${
                        tipoMinuscula === "ingreso" ? "bg-emerald-100" : "bg-rose-100"
                      }`}
                    >
                      {tipoMinuscula === "ingreso" ? (
                        <ArrowUpIcon className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <ArrowDownIcon className="h-5 w-5 text-rose-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{lastTransaction.descripcion}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {formatDate(lastTransaction.fecha)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={tipoMinuscula === "ingreso" ? "outline" : "destructive"}
                      className={
                        tipoMinuscula === "ingreso"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : ""
                      }
                    >
                      {lastTransaction.tipo}
                    </Badge>
                    <span
                      className={`font-bold ${
                        tipoMinuscula === "ingreso" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {tipoMinuscula === "ingreso" ? "+" : "-"}
                      {formatCurrency(lastTransaction.monto)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p>No hay movimientos registrados</p>
            )}
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-3">
            <Link href="/dashboard/movimientos-tesorero" className="w-full block">
              <Button variant="outline" className="w-full cursor-pointer">
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Ver todos los movimientos
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
