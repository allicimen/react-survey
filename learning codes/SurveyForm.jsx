function SurveyForm({ answers, updateAnswer }) {
  return (
    <div>
      <h2> Anket Formu </h2>

      {/* -----------------------------------------
          1) Kullanıcı inputa yazınca onChange tetiklenir
          2) updateAnswer fonksiyonunu çağırır
          3) Veri App.jsx'e gönderilir
      ------------------------------------------ */}

      <label>
        İsim :
        <input
          type="text"
          value={answers.name}
          onChange={(e =>updateAnswer("name", e.target.value))}
        />
      </label>
      <br />
      <br />

      <label>
        Yaş:
        <input
          type="number"
          onChange={(e) => updateAnswer("age", e.target.value)}
        />
      </label>
    </div>
  );
}

export default SurveyForm;
