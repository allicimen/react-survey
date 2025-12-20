import React , {useState} from "react";

import "./Survey.css";

// basit anket komponenti
export default function Survey () {

// cevapları  saklayan state 
const [answers,setAnswers] = useState({name : "", age:"",color:"" });


//Sonuçları  gösterme  durumu
const[showResults ,setShowResults] = useState(false);

//tek fonksiyonla  alan güncelleme
const updateAnswer = (field, value) => {

    setAnswers((prev)=>({...prev , [field]:value}));
};

return (

    <div className="survey-container">
        <h1 className="survey-title">Mini anket</h1>

        {/* Ad */}
        <input 
        className="survey-input"
        placeholder="Adiniz"
        value ={answers.name}
        onChange={(e)=> updateAnswer("name",e.target.value)}
         />


       {/*Yaş*/}
       <input
        className="survey-input"
        placeholder="Favori renginiz"
        value = {answers.age}
        onChange = {(e)=> updateAnswer("age",e.target.value)} 
        />

      {/*Favori  renk*/}
     <input
      className="survey-input"
      placeholder="Favori renginiz"
      value = {answers.color}
      onChange={(e)=> updateAnswer("color",e.target.value)}
     /> 




    </div>



)

}