import React, { useState } from 'react';

const Calculator = () => {
  const [formData, setFormData] = useState({
    n: '',
    r: '',
    values: '',
  });
  const [calculationType, setCalculationType] = useState('variation');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCalculate = async () => {
    try {
      setLoading(true);
      setError('');
      let endpoint = '';
      let bodyData = {};

      switch (calculationType) {
        case 'variation':
          endpoint = '/calculate/variation';
          bodyData = {
            n: parseInt(formData.n),
            r: parseInt(formData.r)
          };
          break;
        case 'standardDeviation':
        case 'variance':
          const values = formData.values.split(',').map(v => parseFloat(v.trim()));
          endpoint = calculationType === 'standardDeviation' 
            ? '/calculate/standard-deviation'
            : '/calculate/variance';
          bodyData = {
            values: values,
            parameter: 0
          };
          break;
        default:
          throw new Error('Tipo de cálculo no válido');
      }

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculationTypes = [
    { id: 'variation', name: 'Variación' },
    { id: 'standardDeviation', name: 'Desviación Estándar' },
    { id: 'variance', name: 'Varianza' },
  ];

  return (
    <div className="calculator-container">
      <div className="header">
        <h1>Calculadora Matemática</h1>
        <p>Creado por Damian Olivo y Luis Tinoco</p>
      </div>

      <div className="calculator">
        <div className="tabs">
          {calculationTypes.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => setCalculationType(id)}
              className={`tab ${calculationType === id ? 'active' : ''}`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="form-container">
          {calculationType === 'variation' ? (
            <div className="form">
              <div className="input-group">
                <label htmlFor="n">Valor de n</label>
                <input
                  type="number"
                  name="n"
                  value={formData.n}
                  onChange={handleInputChange}
                  placeholder="Ingrese n"
                />
              </div>
              <div className="input-group">
                <label htmlFor="r">Valor de r</label>
                <input
                  type="number"
                  name="r"
                  value={formData.r}
                  onChange={handleInputChange}
                  placeholder="Ingrese r"
                />
              </div>
            </div>
          ) : (
            <div className="form">
              <div className="input-group">
                <label htmlFor="values">Valores (separados por comas)</label>
                <input
                  type="text"
                  name="values"
                  value={formData.values}
                  onChange={handleInputChange}
                  placeholder="Ej: 1, 2, 3, 4, 5"
                />
              </div>
            </div>
          )}

          <button onClick={handleCalculate} className="calculate-btn" disabled={loading}>
            {loading ? 'Procesando...' : 'Calcular'}
          </button>

          {error && <div className="error">{error}</div>}

          {results && (
  <div className="results">
    <h3>Resultado</h3>
    <p className="result-value">{results.result}</p> {/* Solo muestra el valor del resultado */}
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default Calculator;
