import React, { useState, useRef } from 'react';
import { 
  CircleDollarSign, 
  Lightbulb, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  PieChart, 
  BarChart3, 
  Building, 
  Home, 
  Calculator, 
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

const AltersvorsorgeTool = () => {
  // Refs für die Formularvalidierung
  const formRefs = {
    versicherungsArt: useRef(),
    rentenHöhe: useRef(),
    etfSparplanBetrag: useRef(),
    immobilienWert: useRef(),
    jährlicheEinkünfte: useRef(),
    monatlicheRücklage: useRef(),
    geschätzteRente: useRef(),
    gewünschtesEinkommen: useRef()
  };

  // State für den aktuellen Schritt im Formular
  const [currentStep, setCurrentStep] = useState(0);
  const [formCompleted, setFormCompleted] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    gesetzlich: true,
    privat: false,
    betrieblich: false,
    immobilien: false,
    einnahmen: false,
    rentenlücke: false
  });

  // State für Tooltip-Anzeige
  const [activeTooltip, setActiveTooltip] = useState(null);

  // State für Formularfehler
  const [errors, setErrors] = useState({});

  // Form-State
  const [formData, setFormData] = useState({
    // Gesetzliche Rentenversicherung
    versicherungsArt: '',
    rentenHöhe: '',
    freiwilligeEinzahlung: false,
    
    // Private Altersvorsorge
    privateRente: false,
    privateRenteVerzinsung: '',
    privateRenteKosten: '',
    etfSparpläne: false,
    etfSparplanBetrag: '',
    rürupRente: false,
    riesterRente: false,
    
    // Betriebliche Altersvorsorge
    direktversicherung: false,
    unterstützungskasse: false,
    pensionskasse: false,
    versorgungswerk: false,
    
    // Immobilien
    wohneigentum: false,
    vermietet: false,
    immobilienWert: '',
    kredite: '',
    mietrendite: '',
    
    // Einnahmen & Steuer
    jährlicheEinkünfte: '',
    monatlicheRücklage: '',
    steuerAbsetzung: [],
    höchstbeträgeAusgeschöpft: false,
    
    // Rentenlücke
    geschätzteRente: '',
    gewünschtesEinkommen: '',
    rentenlücke: 0,
    benötigtesKapital: 0
  });

  // Tooltip-Inhalte
  const tooltips = {
    versicherungsArt: "Gibt an, ob Sie in die gesetzliche Rentenversicherung einzahlen und in welcher Form.",
    rentenHöhe: "Die bisher von Ihnen erworbene monatliche Rente laut Ihrer Renteninformation der Deutschen Rentenversicherung.",
    freiwilligeEinzahlung: "Selbständige können freiwillig in die gesetzliche Rentenversicherung einzahlen, um Rentenansprüche zu erwerben.",
    privateRente: "Private Rentenversicherungen sind Vorsorgeverträge, die eine lebenslange Rente im Alter garantieren.",
    privateRenteVerzinsung: "Der garantierte Zinssatz, mit dem Ihr Kapital in der privaten Rentenversicherung verzinst wird.",
    privateRenteKosten: "Die jährlichen Verwaltungs- und Abschlusskosten der privaten Rentenversicherung in Prozent.",
    etfSparpläne: "ETF-Sparpläne investieren regelmäßig in börsengehandelte Indexfonds und bieten Renditechancen bei höherem Risiko.",
    etfSparplanBetrag: "Der monatliche Betrag, den Sie in ETF- oder Fondssparpläne investieren.",
    rürupRente: "Die Basisrente (Rürup) ist eine staatlich geförderte private Altersvorsorge für Selbständige mit steuerlichen Vorteilen.",
    riesterRente: "Die Riester-Rente ist eine staatlich geförderte private Altersvorsorge mit Zulagen und Steuervorteilen.",
    direktversicherung: "Eine Direktversicherung ist eine betriebliche Altersvorsorge, die der Arbeitgeber für den Arbeitnehmer abschließt.",
    unterstützungskasse: "Die Unterstützungskasse ist eine Form der betrieblichen Altersvorsorge für Geschäftsführer oder leitende Angestellte.",
    pensionskasse: "Eine Pensionskasse ist ein Versorgungswerk, das Betriebsrenten für die Mitarbeiter von Unternehmen verwaltet.",
    versorgungswerk: "Versorgungswerke sind berufsständische Organisationen, die die Altersvorsorge für bestimmte Berufsgruppen übernehmen.",
    wohneigentum: "Selbstgenutztes Wohneigentum kann im Alter für Mietersparnis sorgen und das verfügbare Einkommen erhöhen.",
    vermietet: "Vermietete Immobilien können im Alter einen zusätzlichen Einkommensstrom generieren.",
    immobilienWert: "Der aktuelle Marktwert Ihrer Immobilien, basierend auf vergleichbaren Objekten in Ihrer Region.",
    kredite: "Die Summe aller noch offenen Immobilienkredite und Hypotheken.",
    mietrendite: "Die jährliche Rendite Ihrer vermieteten Immobilien, berechnet als (Jahresmiete - Kosten) / Immobilienwert * 100.",
    jährlicheEinkünfte: "Ihr zu versteuerndes Jahreseinkommen vor Steuern und Abgaben.",
    monatlicheRücklage: "Der Betrag, den Sie monatlich für Ihre Altersvorsorge zurücklegen.",
    steuerAbsetzung: "Altersvorsorgeprodukte, die Sie steuerlich geltend machen können, um Ihre Steuerlast zu reduzieren.",
    höchstbeträgeAusgeschöpft: "Sie können jährlich bis zu 27.566 € (Ledige) bzw. 55.132 € (Verheiratete) für Basisrente oder freiwillige DRV-Beiträge steuerlich absetzen.",
    geschätzteRente: "Die voraussichtliche monatliche Rente aus allen Ihren Vorsorgebausteinen (gesetzlich, privat, betrieblich).",
    gewünschtesEinkommen: "Das monatliche Nettoeinkommen, das Sie im Ruhestand zur Verfügung haben möchten."
  };

  // Berechnung der Gesamtrente und Rentenlücke
  const calculateRetirementGap = () => {
    const monatlicheRente = parseFloat(formData.geschätzteRente) || 0;
    const gewünschtesEinkommen = parseFloat(formData.gewünschtesEinkommen) || 0;
    
    const rentenlücke = Math.max(0, gewünschtesEinkommen - monatlicheRente);
    const benötigtesKapital = rentenlücke * 12 * 25; // Faustregel: Jährlicher Bedarf x 25
    
    setFormData({
      ...formData,
      rentenlücke: rentenlücke,
      benötigtesKapital: benötigtesKapital
    });
  };

  // Formular-Validierung
  const validateForm = (step) => {
    const newErrors = {};
    let isValid = true;

    // Validierungsregeln entsprechend des aktuellen Schritts
    if (step === 0) {
      if (formData.versicherungsArt === '') {
        newErrors.versicherungsArt = 'Bitte wählen Sie die Art der Versicherung aus';
        isValid = false;
      }

      if (formData.privateRente && (formData.privateRenteVerzinsung === '' || isNaN(parseFloat(formData.privateRenteVerzinsung)))) {
        newErrors.privateRenteVerzinsung = 'Bitte geben Sie einen gültigen Prozentsatz ein';
        isValid = false;
      }

      if (formData.etfSparpläne && (formData.etfSparplanBetrag === '' || isNaN(parseFloat(formData.etfSparplanBetrag)))) {
        newErrors.etfSparplanBetrag = 'Bitte geben Sie einen gültigen Betrag ein';
        isValid = false;
      }

      if ((formData.wohneigentum || formData.vermietet) && (formData.immobilienWert === '' || isNaN(parseFloat(formData.immobilienWert)))) {
        newErrors.immobilienWert = 'Bitte geben Sie einen gültigen Immobilienwert ein';
        isValid = false;
      }
    } else if (step === 1) {
      if (formData.jährlicheEinkünfte === '' || isNaN(parseFloat(formData.jährlicheEinkünfte))) {
        newErrors.jährlicheEinkünfte = 'Bitte geben Sie Ihre jährlichen Einkünfte an';
        isValid = false;
      }

      if (formData.monatlicheRücklage === '' || isNaN(parseFloat(formData.monatlicheRücklage))) {
        newErrors.monatlicheRücklage = 'Bitte geben Sie Ihre monatliche Rücklage an';
        isValid = false;
      }
    } else if (step === 2) {
      if (formData.geschätzteRente === '' || isNaN(parseFloat(formData.geschätzteRente))) {
        newErrors.geschätzteRente = 'Bitte geben Sie Ihre geschätzte monatliche Rente an';
        isValid = false;
      }

      if (formData.gewünschtesEinkommen === '' || isNaN(parseFloat(formData.gewünschtesEinkommen))) {
        newErrors.gewünschtesEinkommen = 'Bitte geben Sie Ihr gewünschtes Einkommen im Alter an';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handler für Form-Änderungen
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Bei numerischen Feldern: Sicherstellen, dass nur Zahlen und Dezimalpunkte eingegeben werden
    if (type === 'number' && value !== '') {
      const numericValue = value.replace(/[^0-9.]/g, '');
      
      setFormData({
        ...formData,
        [name]: numericValue
      });
      
      // Entferne Fehler für dieses Feld, wenn es gültig ist
      if (errors[name] && !isNaN(parseFloat(numericValue))) {
        const updatedErrors = { ...errors };
        delete updatedErrors[name];
        setErrors(updatedErrors);
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
      
      // Entferne Fehler für dieses Feld, wenn es gültig ist
      if (errors[name] && value !== '') {
        const updatedErrors = { ...errors };
        delete updatedErrors[name];
        setErrors(updatedErrors);
      }
    }
  };

  // Toggle für Tooltip
  const toggleTooltip = (fieldName) => {
    setActiveTooltip(activeTooltip === fieldName ? null : fieldName);
  };

  // Toggle für expandierte Sektionen
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Form-Submit-Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm(currentStep)) {
      // Scrolle zum ersten Fehler
      const errorField = Object.keys(errors)[0];
      if (errorField && formRefs[errorField]) {
        formRefs[errorField].current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateRetirementGap();
      setFormCompleted(true);
    }
  };

  // Berechnung des Fortschritts
  const calculateProgress = () => {
    const totalSteps = 3;
    return ((currentStep) / totalSteps) * 100;
  };

  // Rendert die Ergebnisse nach Abschluss des Formulars
  const renderResults = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Ihre Altersvorsorge im Überblick</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center">
              <CircleDollarSign className="mr-2" size={20} />
              Aktuelle Situation
            </h3>
            <ul className="space-y-2">
              {formData.versicherungsArt && (
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span>Rentenversicherung: {formData.versicherungsArt}</span>
                </li>
              )}
              {formData.rentenHöhe && (
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span>Erworbene Rente: {parseFloat(formData.rentenHöhe).toLocaleString('de-DE')} €/Monat</span>
                </li>
              )}
              {formData.privateRente && (
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span>Private Rentenversicherung</span>
                </li>
              )}
              {formData.etfSparpläne && formData.etfSparplanBetrag && (
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span>ETF-/Fondssparpläne: {parseFloat(formData.etfSparplanBetrag).toLocaleString('de-DE')} €/Monat</span>
                </li>
              )}
              {formData.rürupRente && (
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span>Rürup-Rente</span>
                </li>
              )}
              {formData.riesterRente && (
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span>Riester-Rente</span>
                </li>
              )}
              {(formData.direktversicherung || formData.unterstützungskasse || formData.pensionskasse || formData.versorgungswerk) && (
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span>Betriebliche Altersvorsorge</span>
                </li>
              )}
              {(formData.wohneigentum || formData.vermietet) && formData.immobilienWert && (
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span>Immobilienvermögen: {parseFloat(formData.immobilienWert).toLocaleString('de-DE')} €</span>
                </li>
              )}
            </ul>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center">
              <Calculator className="mr-2" size={20} />
              Rentenlücke
            </h3>
            <div className="space-y-4">
              <p><span className="font-medium">Geschätzte monatliche Rente:</span> {parseFloat(formData.geschätzteRente).toLocaleString('de-DE')} €</p>
              <p><span className="font-medium">Gewünschtes Einkommen:</span> {parseFloat(formData.gewünschtesEinkommen).toLocaleString('de-DE')} €</p>
              <p className="text-orange-600 font-bold">Monatliche Rentenlücke: {formData.rentenlücke.toLocaleString('de-DE')} €</p>
              <p className="text-orange-600 font-bold">Benötigtes Kapital: {formData.benötigtesKapital.toLocaleString('de-DE')} €</p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-blue-900">Ihre Altersvorsorgestrategie</h3>
          <div className="flex items-center mb-4">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-900 h-4 rounded-full" 
                style={{ width: `${Math.min(calculateVorsorgeScore(), 100)}%` }}
              ></div>
            </div>
            <span className="ml-2 font-bold">{calculateVorsorgeScore()}%</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderVorsorgeElement('Gesetzliche Rente', 
              formData.versicherungsArt ? 'Vorhanden' : 'Prüfen',
              formData.versicherungsArt ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            )}
            {renderVorsorgeElement('Private Vorsorge', 
              (formData.privateRente || formData.etfSparpläne || formData.rürupRente || formData.riesterRente) ? 'Vorhanden' : 'Empfohlen',
              (formData.privateRente || formData.etfSparpläne || formData.rürupRente || formData.riesterRente) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            )}
            {renderVorsorgeElement('Betriebliche Vorsorge', 
              (formData.direktversicherung || formData.unterstützungskasse || formData.pensionskasse || formData.versorgungswerk) ? 'Vorhanden' : 'Optional',
              (formData.direktversicherung || formData.unterstützungskasse || formData.pensionskasse || formData.versorgungswerk) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            )}
            {renderVorsorgeElement('Immobilienvermögen', 
              (formData.wohneigentum || formData.vermietet) ? 'Vorhanden' : 'Optional',
              (formData.wohneigentum || formData.vermietet) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            )}
            {renderVorsorgeElement('Sparquote', 
              formData.monatlicheRücklage ? `${getPercentage(formData.monatlicheRücklage, formData.jährlicheEinkünfte)}% vom Einkommen` : 'Zu niedrig',
              formData.monatlicheRücklage && getPercentage(formData.monatlicheRücklage, formData.jährlicheEinkünfte) >= 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            )}
            {renderVorsorgeElement('Steuerliche Optimierung', 
              formData.höchstbeträgeAusgeschöpft ? 'Optimiert' : 'Potenzial',
              formData.höchstbeträgeAusgeschöpft ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-blue-900 flex items-center">
            <Lightbulb className="mr-2" size={20} />
            Empfehlungen für Sie
          </h3>
          <ul className="space-y-4">
            {!formData.versicherungsArt && (
              <li className="flex items-start">
                <ArrowRight className="text-orange-600 mr-2 mt-1 flex-shrink-0" size={16} />
                <span>Prüfen Sie Ihren Status bei der Deutschen Rentenversicherung und fordern Sie eine Renteninformation an.</span>
              </li>
            )}
            {formData.versicherungsArt === 'Nicht versichert' && (
              <li className="flex items-start">
                <ArrowRight className="text-orange-600 mr-2 mt-1 flex-shrink-0" size={16} />
                <span>Erwägen Sie eine freiwillige Einzahlung in die gesetzliche Rentenversicherung, um Basisschutz zu erhalten.</span>
              </li>
            )}
            {!formData.privateRente && !formData.etfSparpläne && !formData.rürupRente && !formData.riesterRente && (
              <li className="flex items-start">
                <ArrowRight className="text-orange-600 mr-2 mt-1 flex-shrink-0" size={16} />
                <span>Bauen Sie eine private Altersvorsorge auf, z.B. mit ETF-Sparplänen oder einer Basisrente (Rürup).</span>
              </li>
            )}
            {!formData.höchstbeträgeAusgeschöpft && (
              <li className="flex items-start">
                <ArrowRight className="text-orange-600 mr-2 mt-1 flex-shrink-0" size={16} />
                <span>Nutzen Sie steuerliche Vorteile durch Rürup-Rente oder freiwillige Einzahlungen in die DRV (bis zu 27.566 € bei Ledigen, 55.132 € bei Verheirateten in 2024).</span>
              </li>
            )}
            {parseFloat(formData.monatlicheRücklage || 0) / (parseFloat(formData.jährlicheEinkünfte || 1) / 12) < 0.1 && formData.monatlicheRücklage && formData.jährlicheEinkünfte && (
              <li className="flex items-start">
                <ArrowRight className="text-orange-600 mr-2 mt-1 flex-shrink-0" size={16} />
                <span>Erhöhen Sie Ihre Sparquote auf mindestens 10-15% Ihres Einkommens für eine ausreichende Altersvorsorge.</span>
              </li>
            )}
            {formData.rentenlücke > 500 && (
              <li className="flex items-start">
                <ArrowRight className="text-orange-600 mr-2 mt-1 flex-shrink-0" size={16} />
                <span>Ihre Rentenlücke ist erheblich. Erwägen Sie, Ihre Vorsorgestrategie mit einem Finanzberater zu optimieren.</span>
              </li>
            )}
            <li className="flex items-start">
              <ArrowRight className="text-orange-600 mr-2 mt-1 flex-shrink-0" size={16} />
              <span>Überprüfen Sie Ihre Altersvorsorgestrategie mindestens einmal jährlich und passen Sie sie an veränderte Lebensumstände an.</span>
            </li>
          </ul>
        </div>
        
        <button 
          onClick={() => {
            setFormCompleted(false);
            setCurrentStep(0);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="mt-8 bg-blue-900 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-950 transition-colors"
        >
          Neue Berechnung starten
        </button>
      </div>
    );
  };

  // Hilfsfunktion zur Berechnung des Prozentsatzes
  const getPercentage = (monthly, yearly) => {
    if (!monthly || !yearly) return 0;
    const monthlyValue = parseFloat(monthly);
    const yearlyValue = parseFloat(yearly);
    if (isNaN(monthlyValue) || isNaN(yearlyValue) || yearlyValue === 0) return 0;
    
    return Math.round((monthlyValue * 12 / yearlyValue) * 100);
  };

  // Berechnung eines Vorsorge-Scores basierend auf den Eingaben
  const calculateVorsorgeScore = () => {
    let score = 0;
    
    // Gesetzliche Rente
    if (formData.versicherungsArt) score += 20;
    
    // Private Vorsorge
    if (formData.privateRente || formData.etfSparpläne || formData.rürupRente || formData.riesterRente) score += 20;
    
    // Betriebliche Vorsorge
    if (formData.direktversicherung || formData.unterstützungskasse || formData.pensionskasse || formData.versorgungswerk) score += 15;
    
    // Immobilien
    if (formData.wohneigentum || formData.vermietet) score += 15;
    
    // Sparquote
    const sparquote = getPercentage(formData.monatlicheRücklage, formData.jährlicheEinkünfte);
    if (sparquote >= 20) score += 20;
    else if (sparquote >= 10) score += 15;
    else if (sparquote >= 5) score += 5;
    
    // Steueroptimierung
    if (formData.höchstbeträgeAusgeschöpft) score += 10;
    
    return score;
  };

  // Rendert ein Element für die Vorsorgestrategie
  const renderVorsorgeElement = (title, status, statusClass) => {
    return (
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">{title}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
          {status}
        </span>
      </div>
    );
  };

  // Rendert ein Formular-Feld mit Label und Tooltip
  const renderFormField = (label, name, type = 'text', options = {}) => {
    const { placeholder, min, step, choices, helpText } = options;
    const hasError = errors[name];
    
    return (
      <div className="mb-4" ref={formRefs[name]}>
        <div className="flex items-center mb-1">
          <label className="block text-gray-700 font-medium" htmlFor={name}>
            {label}
          </label>
          {tooltips[name] && (
            <div className="relative ml-2">
              <HelpCircle
                size={16}
                className="text-blue-900 cursor-help"
                onMouseEnter={() => toggleTooltip(name)}
                onMouseLeave={() => toggleTooltip(null)}
              />
              {activeTooltip === name && (
                <div className="absolute z-10 left-6 top-0 p-2 bg-blue-900 text-white text-sm rounded shadow-lg w-64">
                  {tooltips[name]}
                </div>
              )}
            </div>
          )}
        </div>
        
        {type === 'select' ? (
          <div>
            <select
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-500' : 'focus:ring-blue-900'} focus:border-transparent`}
            >
              <option value="">Bitte wählen</option>
              {choices.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
            {hasError && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1" /> {errors[name]}
              </p>
            )}
          </div>
        ) : type === 'checkbox' ? (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={name}
              name={name}
              checked={formData[name]}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-900 border-gray-300 rounded mr-2"
            />
            <label htmlFor={name} className="text-gray-700">{label}</label>
          </div>
        ) : (
          <div>
            <input
              type={type}
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              placeholder={placeholder}
              min={min}
              step={step}
              className={`w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-500' : 'focus:ring-blue-900'} focus:border-transparent`}
            />
            {hasError && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1" /> {errors[name]}
              </p>
            )}
          </div>
        )}
        
        {helpText && !hasError && (
          <p className="text-sm text-gray-500 mt-1">{helpText}</p>
        )}
      </div>
    );
  };
  
  // Rendert die Sektion für Gesetzliche Rentenversicherung
  const renderGesetzlicheRenteSection = () => {
    return (
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer bg-blue-50 p-3 rounded-lg mb-2"
          onClick={() => toggleSection('gesetzlich')}
        >
          <h3 className="font-bold text-blue-900 flex items-center">
            <Building className="mr-2" size={20} /> 
            Gesetzliche Rentenversicherung
          </h3>
          {expandedSections.gesetzlich ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.gesetzlich && (
          <div className="p-4 border border-gray-200 rounded-lg">
            {renderFormField('Art der Versicherung', 'versicherungsArt', 'select', {
              choices: [
                { value: 'Pflichtversichert', label: 'Pflichtversichert' },
                { value: 'Freiwillig versichert', label: 'Freiwillig versichert' },
                { value: 'Nicht versichert', label: 'Nicht versichert' }
              ],
              helpText: 'Pflichtversichert = z.B. als Handwerker, freiwillig = eigene Einzahlung, nicht versichert = keine Beiträge'
            })}
            
            {renderFormField('Bisher erworbene Rente (€/Monat)', 'rentenHöhe', 'number', {
              placeholder: '0',
              min: 0,
              step: 10,
              helpText: 'Zu finden in Ihrer Renteninformation der DRV'
            })}
            
            {renderFormField('Freiwillige Einzahlung in Betracht gezogen', 'freiwilligeEinzahlung', 'checkbox')}
          </div>
        )}
      </div>
    );
  };
  
  // Rendert die Sektion für Private Altersvorsorge
  const renderPrivateVorsorgeSection = () => {
    return (
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer bg-blue-50 p-3 rounded-lg mb-2"
          onClick={() => toggleSection('privat')}
        >
          <h3 className="font-bold text-blue-900 flex items-center">
            <CircleDollarSign className="mr-2" size={20} /> 
            Private Altersvorsorge
          </h3>
          {expandedSections.privat ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.privat && (
          <div className="p-4 border border-gray-200 rounded-lg">
            {renderFormField('Private Rentenversicherung vorhanden', 'privateRente', 'checkbox')}
            
            {formData.privateRente && (
              <>
                {renderFormField('Garantierte Verzinsung (%)', 'privateRenteVerzinsung', 'number', {
                  placeholder: '0',
                  min: 0,
                  step: 0.1,
                  helpText: 'Der in Ihrem Vertrag garantierte Zinssatz (meist zwischen 0,25% und 3,5%)'
                })}
                
                {renderFormField('Jährliche Kosten (%)', 'privateRenteKosten', 'number', {
                  placeholder: '0',
                  min: 0,
                  step: 0.1,
                  helpText: 'Gesamtkosten inkl. Abschluss- und Verwaltungskosten (meist zwischen 1,5% und 3%)'
                })}
              </>
            )}
            
            {renderFormField('ETF-/Fonds-Sparpläne vorhanden', 'etfSparpläne', 'checkbox')}
            
            {formData.etfSparpläne && (
              renderFormField('Monatlicher Sparbetrag (€)', 'etfSparplanBetrag', 'number', {
                placeholder: '0',
                min: 0,
                step: 10,
                helpText: 'Gesamtbetrag aller regelmäßigen Sparplanraten'
              })
            )}
            
            {renderFormField('Rürup-Rente (Basisrente) vorhanden', 'rürupRente', 'checkbox')}
            {renderFormField('Riester-Rente vorhanden', 'riesterRente', 'checkbox')}
          </div>
        )}
      </div>
    );
  };
  
  // Rendert die Sektion für Betriebliche Altersvorsorge
  const renderBetrieblicheVorsorgeSection = () => {
    return (
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer bg-blue-50 p-3 rounded-lg mb-2"
          onClick={() => toggleSection('betrieblich')}
        >
          <h3 className="font-bold text-blue-900 flex items-center">
            <Building className="mr-2" size={20} /> 
            Betriebliche Altersvorsorge
          </h3>
          {expandedSections.betrieblich ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.betrieblich && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-4">Falls relevant für Ihre Situation als Selbständige/r:</p>
            
            {renderFormField('Direktversicherung über eigene Firma', 'direktversicherung', 'checkbox', {
              helpText: 'Eine Lebensversicherung, die über Ihre GmbH oder UG abgeschlossen wurde'
            })}
            {renderFormField('Unterstützungskasse über eigene Firma', 'unterstützungskasse', 'checkbox', {
              helpText: 'Eine Versorgungseinrichtung für Geschäftsführer oder leitende Angestellte'
            })}
            {renderFormField('Pensionskasse', 'pensionskasse', 'checkbox', {
              helpText: 'Mitglied in einer branchenspezifischen Pensionskasse'
            })}
            {renderFormField('Versorgungswerk', 'versorgungswerk', 'checkbox', {
              helpText: 'Mitglied in einem berufsständischen Versorgungswerk (z.B. für Ärzte, Rechtsanwälte)'
            })}
          </div>
        )}
      </div>
    );
  };
  
  // Rendert die Sektion für Immobilien als Altersvorsorge
  const renderImmobilienSection = () => {
    return (
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer bg-blue-50 p-3 rounded-lg mb-2"
          onClick={() => toggleSection('immobilien')}
        >
          <h3 className="font-bold text-blue-900 flex items-center">
            <Home className="mr-2" size={20} /> 
            Immobilien als Altersvorsorge
          </h3>
          {expandedSections.immobilien ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.immobilien && (
          <div className="p-4 border border-gray-200 rounded-lg">
            {renderFormField('Selbstgenutztes Wohneigentum vorhanden', 'wohneigentum', 'checkbox', {
              helpText: 'Eigene Immobilie, in der Sie selbst wohnen'
            })}
            {renderFormField('Vermietete Immobilien vorhanden', 'vermietet', 'checkbox', {
              helpText: 'Immobilien, die Sie zur Kapitalanlage vermieten'
            })}
            
            {(formData.wohneigentum || formData.vermietet) && (
              <>
                {renderFormField('Geschätzter Gesamtwert der Immobilien (€)', 'immobilienWert', 'number', {
                  placeholder: '0',
                  min: 0,
                  step: 10000,
                  helpText: 'Aktueller Marktwert aller Immobilien zusammen'
                })}
                
                {renderFormField('Höhe der laufenden Kredite (€)', 'kredite', 'number', {
                  placeholder: '0',
                  min: 0,
                  step: 10000,
                  helpText: 'Summe aller noch ausstehenden Immobilienkredite'
                })}
                
                {formData.vermietet && (
                  renderFormField('Mietrendite (% p.a.)', 'mietrendite', 'number', {
                    placeholder: '0',
                    min: 0,
                    max: 15,
                    step: 0.1,
                    helpText: 'Jährliche Nettomieteinnahmen geteilt durch Immobilienwert mal 100'
                  })
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Rendert die Sektion für Einnahmen & Steuerliche Situation
  const renderEinnahmenSection = () => {
    return (
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer bg-blue-50 p-3 rounded-lg mb-2"
          onClick={() => toggleSection('einnahmen')}
        >
          <h3 className="font-bold text-blue-900 flex items-center">
            <BarChart3 className="mr-2" size={20} /> 
            Einnahmen & Steuerliche Situation
          </h3>
          {expandedSections.einnahmen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.einnahmen && (
          <div className="p-4 border border-gray-200 rounded-lg">
            {renderFormField('Jährliche Einkünfte (€)', 'jährlicheEinkünfte', 'number', {
              placeholder: '0',
              min: 0,
              step: 1000,
              helpText: 'Brutto-Gewinn aus Selbstständigkeit oder Gehalt bei eigener GmbH'
            })}
            
            {renderFormField('Monatliche Rücklage für Altersvorsorge (€)', 'monatlicheRücklage', 'number', {
              placeholder: '0',
              min: 0,
              step: 50,
              helpText: 'Richtwert: 10–30% des Einkommens'
            })}
            
            <div className="mb-4">
              <div className="flex items-center mb-1">
                <label className="block text-gray-700 font-medium">
                  Steuerlich absetzbare Altersvorsorge
                </label>
                <div className="relative ml-2">
                  <HelpCircle
                    size={16}
                    className="text-blue-900 cursor-help"
                    onMouseEnter={() => toggleTooltip('steuerAbsetzung')}
                    onMouseLeave={() => toggleTooltip(null)}
                  />
                  {activeTooltip === 'steuerAbsetzung' && (
                    <div className="absolute z-10 left-6 top-0 p-2 bg-blue-900 text-white text-sm rounded shadow-lg w-64">
                      Altersvorsorgeprodukte, die Sie steuerlich geltend machen können, um Ihre Steuerlast zu reduzieren.
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {['Rürup-Rente', 'Freiwillige DRV-Einzahlungen', 'Betriebliche Altersvorsorge', 'Private Rentenversicherung'].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`steuer_${option}`}
                      name="steuerAbsetzung"
                      value={option}
                      checked={formData.steuerAbsetzung.includes(option)}
                      onChange={(e) => {
                        const value = e.target.value;
                        const isChecked = e.target.checked;
                        
                        setFormData({
                          ...formData,
                          steuerAbsetzung: isChecked
                            ? [...formData.steuerAbsetzung, value]
                            : formData.steuerAbsetzung.filter(item => item !== value)
                        });
                      }}
                      className="h-4 w-4 text-blue-900 border-gray-300 rounded mr-2"
                    />
                    <label htmlFor={`steuer_${option}`} className="text-gray-700">{option}</label>
                  </div>
                ))}
              </div>
            </div>
            
            {renderFormField('Steuerliche Höchstbeträge bereits ausgeschöpft', 'höchstbeträgeAusgeschöpft', 'checkbox', {
              helpText: 'Für 2024: Rürup bis 27.566 € bei Ledigen, 55.132 € bei Verheirateten'
            })}
          </div>
        )}
      </div>
    );
  };
  
  // Rendert die Sektion für Rentenlücke berechnen
  const renderRentenlückeSection = () => {
    return (
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer bg-blue-50 p-3 rounded-lg mb-2"
          onClick={() => toggleSection('rentenlücke')}
        >
          <h3 className="font-bold text-blue-900 flex items-center">
            <PieChart className="mr-2" size={20} /> 
            Rentenlücke berechnen
          </h3>
          {expandedSections.rentenlücke ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.rentenlücke && (
          <div className="p-4 border border-gray-200 rounded-lg">
            {renderFormField('Geschätzte monatliche Rente (gesetzlich + privat) in €', 'geschätzteRente', 'number', {
              placeholder: '0',
              min: 0,
              step: 50,
              helpText: 'Nutzen Sie ggf. Online-Rechner wie den Finanztip Rentenrechner'
            })}
            
            {renderFormField('Gewünschtes monatliches Netto-Einkommen im Alter (€)', 'gewünschtesEinkommen', 'number', {
              placeholder: '0',
              min: 0,
              step: 100,
              helpText: 'Betrag, den Sie monatlich im Ruhestand zur Verfügung haben möchten'
            })}
            
            <div className="mt-4 p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Faustregel zur Berechnung des benötigten Kapitals:</strong>
              </p>
              <p className="text-sm text-gray-700">
                Jährlicher Zusatzbedarf × 25 = benötigtes Kapital<br />
                Beispiel: 500 € monatliche Rentenlücke × 12 Monate × 25 = 150.000 € benötigtes Kapital
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div style={{ backgroundColor: '#001d6c' }} className="text-white p-6 mb-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Altersvorsorge-Check für Selbständige</h1>
        <p className="text-lg">Machen Sie eine Bestandsaufnahme Ihrer Altersvorsorge und erhalten Sie individuelle Empfehlungen</p>
      </div>

      {!formCompleted ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Fortschritt</span>
              <span className="text-sm font-medium">{Math.round(calculateProgress())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-900 h-2.5 rounded-full" 
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-blue-900">
            {currentStep === 0 && "1. Bestehende Altersvorsorge prüfen"}
            {currentStep === 1 && "2. Einnahmen & Steuerliche Situation klären"}
            {currentStep === 2 && "3. Rentenlücke berechnen"}
          </h2>

          <form onSubmit={handleSubmit}>
            {currentStep === 0 && (
              <>
                {renderGesetzlicheRenteSection()}
                {renderPrivateVorsorgeSection()}
                {renderBetrieblicheVorsorgeSection()}
                {renderImmobilienSection()}
              </>
            )}

            {currentStep === 1 && (
              <>
                {renderEinnahmenSection()}
              </>
            )}

            {currentStep === 2 && (
              <>
                {renderRentenlückeSection()}
              </>
            )}

            <div className="flex justify-between mt-8">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2 border border-blue-900 text-blue-900 rounded-md font-medium hover:bg-blue-50 transition-colors"
                >
                  Zurück
                </button>
              )}
              
              <button
                type="submit"
                className="bg-blue-900 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-950 transition-colors ml-auto"
              >
                {currentStep < 2 ? "Weiter" : "Ergebnisse anzeigen"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        renderResults()
      )}
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© 2025 House of Finance & Tech Berlin | Alle Angaben ohne Gewähr</p>
        <p className="mt-1">Diese Analyse ersetzt keine professionelle Finanzberatung.</p>
      </div>
    </div>
  );
};

export default AltersvorsorgeTool;
