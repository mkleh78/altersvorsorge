import React, { useState } from 'react';
import { CircleDollarSign, Lightbulb, ArrowRight, ChevronDown, ChevronUp, PieChart, BarChart3, Building, Home, Calculator, CheckCircle } from 'lucide-react';

const AltersvorsorgeTool = () => {
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

  // Handler für Form-Änderungen
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
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
    if (currentStep < 3) {
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
                  <span>Erworbene Rente: {formData.rentenHöhe} €/Monat</span>
                </li>
              )}
              {formData.privateRente && (
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span>Private Rentenversicherung</span>
                </li>
              )}
              {formData.etfSparpläne && (
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span>ETF-/Fondssparpläne: {formData.etfSparplanBetrag} €/Monat</span>
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
              {(formData.wohneigentum || formData.vermietet) && (
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span>Immobilienvermögen: {formData.immobilienWert} €</span>
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
              <p><span className="font-medium">Geschätzte monatliche Rente:</span> {formData.geschätzteRente} €</p>
              <p><span className="font-medium">Gewünschtes Einkommen:</span> {formData.gewünschtesEinkommen} €</p>
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
            {parseFloat(formData.monatlicheRücklage) / (parseFloat(formData.jährlicheEinkünfte) / 12) < 0.1 && formData.monatlicheRücklage && formData.jährlicheEinkünfte && (
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

  // Rendert ein Formular-Feld mit Label
  const renderFormField = (label, name, type = 'text', options = {}) => {
    const { placeholder, min, step, choices, helpText } = options;
    
    return (
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 font-medium" htmlFor={name}>
          {label}
        </label>
        
        {type === 'select' ? (
          <select
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          >
            <option value="">Bitte wählen</option>
            {choices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
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
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            placeholder={placeholder}
            min={min}
            step={step}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          />
        )}
        
        {helpText && (
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
              ]
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
                  step: 0.1
                })}
                
                {renderFormField('Jährliche Kosten (%)', 'privateRenteKosten', 'number', {
                  placeholder: '0',
                  min: 0,
                  step: 0.1
                })}
              </>
            )}
            
            {renderFormField('ETF-/Fonds-Sparpläne vorhanden', 'etfSparpläne', 'checkbox')}
            
            {formData.etfSparpläne && (
              renderFormField('Monatlicher Sparbetrag (€)', 'etfSparplanBetrag', 'number', {
                placeholder: '0',
                min: 0,
                step: 10
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
            
            {renderFormField('Direktversicherung über eigene Firma', 'direktversicherung', 'checkbox')}
            {renderFormField('Unterstützungskasse über eigene Firma', 'unterstützungskasse', 'checkbox')}
            {renderFormField('Pensionskasse', 'pensionskasse', 'checkbox')}
            {renderFormField('Versorgungswerk', 'versorgungswerk', 'checkbox')}
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
            {renderFormField('Selbstgenutztes Wohneigentum vorhanden', 'wohneigentum', 'checkbox')}
            {renderFormField('Vermietete Immobilien vorhanden', 'vermietet', 'checkbox')}
            
            {(formData.wohneigentum || formData.vermietet) && (
              <>
                {renderFormField('Geschätzter Gesamtwert der Immobilien (€)', 'immobilienWert', 'number', {
                  placeholder: '0',
                  min: 0,
                  step: 10000
                })}
                
                {renderFormField('Höhe der laufenden Kredite (€)', 'kredite', 'number', {
                  placeholder: '0',
                  min: 0,
                  step: 10000
                })}
                
                {formData.vermietet && (
                  renderFormField('Mietrendite (% p.a.)', 'mietrendite', 'number', {
                    placeholder: '0',
                    min: 0,
                    max: 15,
                    step: 0.1
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
              <label className="block text-gray-700 mb-1 font-medium">
                Steuerlich absetzbare Altersvorsorge (Mehrfachauswahl möglich)
              </label>
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
              step: 100
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