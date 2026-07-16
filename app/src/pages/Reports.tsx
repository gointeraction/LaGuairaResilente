import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  reportsService,
  Report,
  ReportModule,
  ReportData
} from '../services/reports';
import toast from 'react-hot-toast';

type ViewMode = 'catalog' | 'generator' | 'results';

export default function Reports() {
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<ReportModule | 'ALL'>('ALL');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const allReports = await reportsService.getAllReports();
      setReports(allReports);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = selectedModule === 'ALL' 
    ? reports 
    : reports.filter(r => r.module === selectedModule);

  const getModuleStats = () => {
    const modules: ReportModule[] = ['EDUCATION', 'RESILIENCE', 'PSYCHOLOGISTS', 'EMPLOYMENT', 'SPONSORSHIP', 'CENSUS', 'GAMIFICATION', 'IMPACT'];
    return modules.map(m => ({
      module: m,
      count: reports.filter(r => r.module === m).length,
      label: reportsService.getModuleLabel(m),
      color: reportsService.getModuleColor(m)
    }));
  };

  const handleGenerateReport = async (report: Report) => {
    setSelectedReport(report);
    setViewMode('generator');
    setReportData(null);
  };

  const handleExecuteReport = async () => {
    if (!selectedReport) return;
    
    setGenerating(true);
    try {
      const data = await reportsService.generateReport(selectedReport.id, {});
      setReportData(data);
      setViewMode('results');
      toast.success('Reporte generado exitosamente');
    } catch (error) {
      toast.error('Error al generar reporte');
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async (format: string) => {
    if (!reportData || !selectedReport) return;
    
    try {
      if (format === 'CSV') {
        await reportsService.exportToCSV(reportData, selectedReport.name);
        toast.success('Archivo CSV descargado');
      } else if (format === 'EXCEL') {
        await reportsService.exportToExcel(reportData, selectedReport.name);
        toast.success('Archivo Excel descargado');
      } else if (format === 'PDF') {
        await reportsService.exportToPDF(reportData, selectedReport.name);
        toast.success('PDF generado');
      }
    } catch (error) {
      toast.error('Error al exportar');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Centro de Reportes</h1>
              <p className="text-primary-100 mt-1">35 reportes para monitorear el impacto del programa</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setViewMode('catalog')}
                className={`${
                  viewMode === 'catalog' 
                    ? 'bg-white text-primary-600' 
                    : 'bg-primary-500 text-white hover:bg-primary-400'
                }`}
              >
                📋 Catálogo
              </Button>
              <Button
                onClick={() => setViewMode('generator')}
                className={`${
                  viewMode === 'generator' 
                    ? 'bg-white text-primary-600' 
                    : 'bg-primary-500 text-white hover:bg-primary-400'
                }`}
              >
                🔧 Generador
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Module Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {getModuleStats().map(stat => (
            <Card 
              key={stat.module}
              className={`p-4 cursor-pointer hover:shadow-md transition-all ${
                selectedModule === stat.module ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setSelectedModule(selectedModule === stat.module ? 'ALL' : stat.module)}
            >
              <div className="text-center">
                <div className="text-2xl font-bold">{stat.count}</div>
                <div className={`text-sm ${stat.color} rounded-full px-2 py-1 mt-1`}>
                  {stat.label}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* CATALOG VIEW */}
          {viewMode === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Catálogo de Reportes ({filteredReports.length})</h3>
                    <select
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value as ReportModule | 'ALL')}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="ALL">Todos los módulos</option>
                      <option value="EDUCATION">📚 Educación</option>
                      <option value="RESILIENCE">🧠 Resiliencia</option>
                      <option value="PSYCHOLOGISTS">👨‍⚕️ Psicólogos</option>
                      <option value="EMPLOYMENT">💼 Empleo</option>
                      <option value="SPONSORSHIP">🤝 Patrocinio</option>
                      <option value="CENSUS">📋 Censo</option>
                      <option value="GAMIFICATION">🏆 Gamificación</option>
                      <option value="IMPACT">📈 Impacto</option>
                    </select>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4">ID</th>
                        <th className="text-left py-3 px-4">Nombre</th>
                        <th className="text-left py-3 px-4">Módulo</th>
                        <th className="text-left py-3 px-4">Frecuencia</th>
                        <th className="text-left py-3 px-4">Métricas</th>
                        <th className="text-left py-3 px-4">Formatos</th>
                        <th className="text-left py-3 px-4">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map(report => (
                        <tr key={report.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm text-gray-600">{report.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-medium">{report.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{report.description}</div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={reportsService.getModuleColor(report.module)}>
                              {reportsService.getModuleLabel(report.module)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className="bg-gray-100 text-gray-700">
                              {reportsService.getFrequencyLabel(report.frequency)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600">{report.metrics.length} métricas</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              {report.formats.map(f => (
                                <Badge key={f} className="bg-primary-100 text-primary-700 text-xs">{f}</Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              onClick={() => handleGenerateReport(report)}
                              className="bg-primary-600 hover:bg-primary-700 text-white text-sm px-3 py-1"
                            >
                              Generar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* GENERATOR VIEW */}
          {viewMode === 'generator' && (
            <motion.div
              key="generator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Report Selection */}
                <div className="lg:col-span-1">
                  <Card className="p-6">
                    <h3 className="text-lg font-bold mb-4">Seleccionar Reporte</h3>
                    <select
                      value={selectedReport?.id || ''}
                      onChange={(e) => {
                        const report = reports.find(r => r.id === e.target.value);
                        setSelectedReport(report || null);
                      }}
                      className="w-full px-4 py-2 border rounded-lg mb-4"
                    >
                      <option value="">Seleccione un reporte...</option>
                      {reports.map(r => (
                        <option key={r.id} value={r.id}>{r.id} - {r.name}</option>
                      ))}
                    </select>

                    {selectedReport && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Descripción</h4>
                          <p className="text-sm text-gray-600">{selectedReport.description}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Métricas</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedReport.metrics.map(m => (
                              <Badge key={m} className="bg-gray-100 text-gray-700 text-xs">{m}</Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Filtros Disponibles</h4>
                          <div className="space-y-2">
                            {selectedReport.filters.map(f => (
                              <div key={f}>
                                <label className="text-sm text-gray-600">{f}</label>
                                <input
                                  type={f.includes('Fecha') ? 'date' : 'text'}
                                  className="w-full px-3 py-1 border rounded text-sm"
                                  placeholder={f}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          onClick={handleExecuteReport}
                          disabled={generating}
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                        >
                          {generating ? 'Generando...' : '🔧 Generar Reporte'}
                        </Button>
                      </div>
                    )}
                  </Card>
                </div>

                {/* Report Results */}
                <div className="lg:col-span-2">
                  <Card className="p-6">
                    {reportData ? (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold">{selectedReport?.name}</h3>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleExport('CSV')}
                              className="bg-green-600 hover:bg-green-700 text-white text-sm"
                            >
                              📥 CSV
                            </Button>
                            <Button
                              onClick={() => handleExport('EXCEL')}
                              className="bg-primary-600 hover:bg-primary-700 text-white text-sm"
                            >
                              📊 Excel
                            </Button>
                            <Button
                              onClick={() => handleExport('PDF')}
                              className="bg-red-600 hover:bg-red-700 text-white text-sm"
                            >
                              📄 PDF
                            </Button>
                          </div>
                        </div>

                        {/* Summary */}
                        {reportData.summary && (
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            {Object.entries(reportData.summary).map(([key, value]) => (
                              <div key={key} className="bg-gray-50 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-primary-600">{value}</div>
                                <div className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Data Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full border">
                            <thead>
                              <tr className="bg-gray-50">
                                {reportData.headers.map((header, idx) => (
                                  <th key={idx} className="text-left py-3 px-4 border-b font-medium">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {reportData.rows.map((row, rowIdx) => (
                                <tr key={rowIdx} className="hover:bg-gray-50">
                                  {row.map((cell, cellIdx) => (
                                    <td key={cellIdx} className="py-3 px-4 border-b text-sm">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Selecciona un reporte</h3>
                        <p className="text-gray-600">Elige un reporte del catálogo y haz clic en "Generar" para ver los resultados</p>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULTS VIEW */}
          {viewMode === 'results' && reportData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedReport?.name}</h2>
                    <p className="text-gray-600">{selectedReport?.description}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setViewMode('generator')}
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      ← Volver
                    </Button>
                    <Button
                      onClick={() => handleExport('CSV')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      📥 Exportar CSV
                    </Button>
                    <Button
                      onClick={() => handleExport('PDF')}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      📄 Exportar PDF
                    </Button>
                  </div>
                </div>

                {/* Summary Cards */}
                {reportData.summary && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {Object.entries(reportData.summary).map(([key, value]) => (
                      <Card key={key} className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary-600">{value}</div>
                        <div className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Data Table */}
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-primary-50">
                        {reportData.headers.map((header, idx) => (
                          <th key={idx} className="text-left py-3 px-4 border-b font-semibold text-primary-700">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-gray-50 border-b">
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx} className="py-3 px-4 text-sm">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-sm text-gray-500 text-right">
                  Generado: {new Date().toLocaleString()}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}