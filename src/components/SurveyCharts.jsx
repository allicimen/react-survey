import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

const SurveyCharts = ({ survey, responses }) => {
  if (!survey || !survey.questions || !responses || responses.length === 0) {
    return <div className="no-data">Görselleştirilecek yeterli veri bulunamadı.</div>;
  }

  // Yalnızca çoktan seçmeli veya onay kutusu olan soruları filtrele
  const chartQuestions = survey.questions.filter(q => q.type === 'multipleChoice' || q.type === 'checkbox');

  if (chartQuestions.length === 0) {
    return <div className="no-data">Bu ankette grafik destekleyen çoktan seçmeli soru bulunmuyor.</div>;
  }

  return (
    <div className="charts-container">
      {chartQuestions.map((q, index) => {
        // Veriyi aggrege et
        const dataMap = {};
        if (q.options) {
          q.options.forEach(opt => { dataMap[opt] = 0; });
        }
        
        responses.forEach(res => {
          const answersObj = res.answers || res; // Geriye dönük uyumluluk
          const answer = answersObj[q.id];
          if (Array.isArray(answer)) {
            answer.forEach(a => {
              dataMap[a] = (dataMap[a] || 0) + 1;
            });
          } else if (answer) {
            dataMap[answer] = (dataMap[answer] || 0) + 1;
          }
        });

        // Boş veya 0 değerli olanları temizle
        const chartData = Object.keys(dataMap)
          .map(key => ({ name: key, value: dataMap[key] }))
          .filter(item => item.value > 0)
          .sort((a, b) => b.value - a.value); // Büyükten küçüğe sırala

        if (chartData.length === 0) return null;

        // Her iki soru tipinden birini farklı grafik olarak render edelim (Çeşitlilik)
        const isPieChart = index % 2 === 0;

        return (
          <div key={q.id} className="chart-card card">
            <h3 className="chart-title">{q.text}</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                {isPieChart ? (
                  <PieChart>
                    <Pie 
                      data={chartData} 
                      cx="50%" 
                      cy="50%" 
                      labelLine={false}
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                ) : (
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#f3f4f6' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}

      <style jsx="true">{`
        .charts-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .chart-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .chart-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--text-main);
          text-align: center;
        }
        .chart-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .no-data {
          padding: 2rem;
          text-align: center;
          color: var(--text-muted);
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          border: 1px dashed var(--border);
          margin-top: 2rem;
        }
        @media (max-width: 768px) {
          .charts-container { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default SurveyCharts;
