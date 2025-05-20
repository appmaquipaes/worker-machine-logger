
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useReport } from "@/context/ReportContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const Reports = () => {
  const { user } = useAuth();
  const { reports } = useReport();
  const navigate = useNavigate();
  const [filteredReports, setFilteredReports] = useState(reports);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Reportes</h1>
          <Button onClick={() => navigate("/dashboard")} variant="outline" className="gap-2">
            <ArrowLeft size={16} />
            Volver al Dashboard
          </Button>
        </div>

        <div className="grid gap-6">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No hay reportes disponibles.
                </p>
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => (
              <Card key={report.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">
                      {report.machineName} - {report.type}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(report.date)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p>{report.description}</p>
                    
                    {/* Conditional rendering based on report type */}
                    {report.trips && (
                      <p>
                        <span className="font-semibold">Viajes:</span> {report.trips}
                      </p>
                    )}
                    {report.hours && (
                      <p>
                        <span className="font-semibold">Horas:</span> {report.hours}
                      </p>
                    )}
                    {report.value && (
                      <p>
                        <span className="font-semibold">Valor:</span> ${report.value.toLocaleString()}
                      </p>
                    )}
                    {report.workSite && (
                      <p>
                        <span className="font-semibold">Sitio:</span> {report.workSite}
                      </p>
                    )}
                    {report.origin && (
                      <p>
                        <span className="font-semibold">Origen:</span> {report.origin}
                      </p>
                    )}
                    {report.destination && (
                      <p>
                        <span className="font-semibold">Destino:</span> {report.destination}
                      </p>
                    )}
                    {report.cantidadM3 && (
                      <p>
                        <span className="font-semibold">Cantidad:</span> {report.cantidadM3} m³
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Reportado por: {user?.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
