import { useState, useEffect } from 'react';
import { 
  Award, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  Download,
  Share2,
  Eye,
  Search,
  Calendar,
  Clock,
  Star
} from 'lucide-react';
import { 
  certificateService, 
  Certificate, 
  CertificateType,
  CertificateStatus
} from '../services/certificates';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

type TabType = 'my' | 'verify' | 'catalog';

export default function CertificatesPage() {
  const user = useAuthStore(state => state.user);
  const [activeTab, setActiveTab] = useState<TabType>('my');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filterType, setFilterType] = useState<CertificateType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<{valid: boolean; certificate: Certificate | null; message: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, [user]);

  const loadCertificates = async () => {
    if (!user?.uid) {
      setCertificates([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await certificateService.getUserCertificates(user.uid);
      setCertificates(data);
    } catch (error) {
      console.error('Error loading certificates:', error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyCode) {
      toast.error('Ingresa un código');
      return;
    }
    
    const result = await certificateService.verifyCertificate(verifyCode);
    setVerificationResult(result);
    
    if (result.valid) {
      toast.success('Certificado válido');
    } else {
      toast.error(result.message);
    }
  };

  const getTypeIcon = (type: CertificateType) => {
    switch (type) {
      case 'MODULO': return <Award className="w-5 h-5 text-primary-500" />;
      case 'CURSO': return <Award className="w-5 h-5 text-green-500" />;
      case 'TRACK': return <Award className="w-5 h-5 text-purple-500" />;
      case 'ESPECIALIDAD': return <Award className="w-5 h-5 text-yellow-500" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: CertificateType) => {
    switch (type) {
      case 'MODULO': return 'bg-primary-100 text-primary-800';
      case 'CURSO': return 'bg-green-100 text-green-800';
      case 'TRACK': return 'bg-purple-100 text-purple-800';
      case 'ESPECIALIDAD': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: CertificateStatus) => {
    switch (status) {
      case 'EMITIDO': return 'bg-green-100 text-green-800';
      case 'VERIFICADO': return 'bg-primary-100 text-primary-800';
      case 'REVOCADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    if (filterType !== 'ALL' && cert.certificate_type !== filterType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        cert.title.toLowerCase().includes(query) ||
        cert.code.toLowerCase().includes(query) ||
        cert.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando certificados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Award className="w-8 h-8 text-primary-600" />
                Certificados QR Verificables
              </h1>
              <p className="text-gray-600 mt-1">Certificados digitales con código QR verificable</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('my')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'my'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Mis Certificados
                </div>
              </button>
              <button
                onClick={() => setActiveTab('verify')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'verify'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Verificar
                </div>
              </button>
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'catalog'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Catálogo
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'my' && (
              <>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar certificado..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as CertificateType | 'ALL')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="ALL">Todos</option>
                    <option value="MODULO">Módulos</option>
                    <option value="CURSO">Cursos</option>
                    <option value="TRACK">Tracks</option>
                    <option value="ESPECIALIDAD">Especialidades</option>
                  </select>
                </div>

                {/* Certificates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCertificates.map((cert) => (
                    <div key={cert.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(cert.certificate_type)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(cert.certificate_type)}`}>
                            {cert.certificate_type}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}>
                          {cert.status}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-2">{cert.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{cert.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <QrCode className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Código: {cert.code}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{cert.issued_date?.toDate().toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{cert.hours_completed}h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-600">{cert.points_earned} pts</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {cert.skills_acquired.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {cert.skills_acquired.length > 3 && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                            +{cert.skills_acquired.length - 3}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-xs text-gray-500">Emitter: {cert.issuer}</span>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'verify' && (
              <div className="max-w-md mx-auto text-center py-12">
                <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Verificar Certificado</h3>
                <p className="text-gray-600 mb-6">
                  Ingresa el código del certificado para verificar su autenticidad
                </p>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej: CERT-2025-001"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={handleVerify}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Verificar
                  </button>
                </div>
                
                {verificationResult && (
                  <div className={`mt-6 p-4 rounded-lg ${
                    verificationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {verificationResult.valid ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                      <span className={`font-medium ${verificationResult.valid ? 'text-green-800' : 'text-red-800'}`}>
                        {verificationResult.message}
                      </span>
                    </div>
                    
                    {verificationResult.certificate && (
                      <div className="text-sm text-left space-y-1">
                        <p><strong>Código:</strong> {verificationResult.certificate.code}</p>
                        <p><strong>Nombre:</strong> {verificationResult.certificate.user_name}</p>
                        <p><strong>Título:</strong> {verificationResult.certificate.title}</p>
                        <p><strong>Fecha:</strong> {verificationResult.certificate.issued_date?.toDate().toLocaleDateString()}</p>
                        <p><strong>Emisor:</strong> {verificationResult.certificate.issuer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'catalog' && (
              <div className="space-y-6">
                <div className="bg-primary-50 rounded-lg p-4">
                  <h3 className="font-medium text-primary-900 mb-2">Tipos de Certificados</h3>
                  <p className="text-sm text-primary-700">
                    Los certificados se emiten al completar módulos, cursos o tracks de capacitación.
                    Cada certificado incluye un código QR verificable.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-primary-500" />
                      <h4 className="font-medium text-gray-900">Certificado de Módulo</h4>
                    </div>
                    <p className="text-sm text-gray-600">Se emite al completar un módulo individual</p>
                    <p className="text-xs text-gray-500 mt-2">Puntos: +25 | Horas: 8h</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-green-500" />
                      <h4 className="font-medium text-gray-900">Certificado de Curso</h4>
                    </div>
                    <p className="text-sm text-gray-600">Se emite al completar un curso completo</p>
                    <p className="text-xs text-gray-500 mt-2">Puntos: +100 | Horas: 30-40h</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-purple-500" />
                      <h4 className="font-medium text-gray-900">Certificado de Track</h4>
                    </div>
                    <p className="text-sm text-gray-600">Se emite al completar un track completo</p>
                    <p className="text-xs text-gray-500 mt-2">Puntos: +300 | Horas: 25-40h</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <h4 className="font-medium text-gray-900">Certificado QR Premium</h4>
                    </div>
                    <p className="text-sm text-gray-600">Certificado verificable con carta de presentación</p>
                    <p className="text-xs text-gray-500 mt-2">Costo: 250 puntos</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
