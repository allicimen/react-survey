import React from 'react'

function Product(props) {
    console.log(props )
  return (
    <div>
      <div>  Ürün Bilgileri   </div>
      
      <div>
        <div>İsim : Ayakkabi</div>
        <div>Fiyat : 3000 TL</div>
      </div>
        <hr />
     
    </div>
  )
}

export default Product
